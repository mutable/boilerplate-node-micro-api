const Pack = require('../package.json');

module.exports = {
  documentationPath: '/',
  auth: false,
  schemes: ['http', 'https'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: [{ Bearer: [] }],
  info: {
    title: Pack.name,
    description: Pack.description,
    version: Pack.version,
  },
};