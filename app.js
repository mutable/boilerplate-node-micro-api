const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const Controller = require('./api/mut-controller');
const Routes = require('./routes');
const SwaggerOptions = require('./utils/swaggerOptions.js');

(() => {
  Controller.init.then(async () => {
    const server = await new Hapi.Server({
      port: process.env.PORT || 3000,
      routes: {
        cors: {
          origin: ['*']
        }
      }
    });
  
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: SwaggerOptions
      }
    ]);
  
    try {
      server.route(Routes);
      await server.start();
      console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
      console.error(err);
    }
  })
  .catch(console.error)
})();

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});
