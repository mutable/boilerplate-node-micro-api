const HapiSwagger = require('hapi-swagger');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Meta = require('@mutable/meta');

const routes = require('./routes');

const swaggerOptions = require('./utils/swaggerOptions.js');

let server;
let cache;

const startServer = async () => {
  try {
    server.route(routes);
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error(err);
  }
};

const registerPlugins = async () => {  
  try {
    server = new Hapi.Server({
      port: process.env.PORT || 3000,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });
    
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);    
  } catch (err) {
    console.error(err);
  }
  startServer();
};

registerPlugins();