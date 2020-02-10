const Hapi = require('@hapi/hapi');
const HapiAuthCookie = require('@hapi/cookie');
const HapiAuthBearer = require('hapi-auth-bearer-token');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const CatboxRedis = require('@hapi/catbox-redis');

const Controller = require('./mut-controller');
const Routes = require('./routes');
const SwaggerOptions = require('./utils/swaggerOptions.js');

(() => {
  Controller.init.then(async () => {
    const server = Hapi.Server({
      port: process.env.PORT || 3000,
      routes: {
        cors: {
          credentials: true,
        },
      },
      cache: [
        {
          name: 'redisCache',
          provider: {
            constructor: CatboxRedis,
            options: {
              partition: 'cache',
              host: Controller.config.redis.host,
              port: Controller.config.redis.port,
              password: process.env.NODE_ENV === 'production' ? Controller.config.redis.pass : undefined,
              database: process.env.NODE_ENV === 'production' ? Controller.config.redis.db : undefined,
            },
          },
        },
      ],
    });

    const cache = server.cache({
      cache: 'redisCache',
      segment: 'sessions',
      expiresIn: 3 * 24 * 60 * 60 * 1000, // 3 days
    });
    server.app.cache = cache;

    await server.register([
      Inert,
      Vision,
      HapiAuthCookie,
      HapiAuthBearer,
      {
        plugin: HapiSwagger,
        options: SwaggerOptions,
      },
    ]);

    server.auth.strategy('session', 'cookie', {
      cookie: {
        name: 'session',
        path: '/',
        password: Controller.config.session.secret,
        isSecure: false,
      },
      redirectTo: false,
      validateFunc: async (request, session) => {
        const cached = await cache.get(session.sid);
        const out = {
          valid: !!cached,
        };
        if (out.valid) {
          out.credentials = cached.account;
        }
        return out;
      },
    });

    server.auth.strategy('simple', 'bearer-access-token', {
      validate: async (request, token) => Controller.pg.oneOrNone(`
        SELECT
          users.id, users.uuid, users.email, users.first_name, users.last_name,
          users.auth_method, users.email_verified
        FROM auth_tokens, users
        WHERE
          token_hash = $1 AND
          users.id = auth_tokens.user_id
      `, [token])
        .then(Controller.underscoreToCamel)
        .then((user) => {
          const artifacts = { test: 'info' };
          if (user) {
            return { isValid: true, credentials: user, artifacts };
          }
          return { isValid: false, credentials: {}, artifacts: {} };
        })
        .catch(console.error),
    });

    server.auth.default('simple');

    try {
      server.route(Routes);
      await server.start();
      console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
      console.error(err);
    }
  })
    .catch(console.error);
})();

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});
