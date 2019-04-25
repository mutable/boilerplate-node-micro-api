const tooBusy = require('toobusy-js');

const routes = [];
module.exports = routes;

routes.push({
  method: 'GET',
  path: '/health',
  config: {
    auth: false,
    description: 'Health Check',
    tags: ['api', 'mutable', 'Health'],
    handler: () => tooBusy.lag().toString(),
  },
});
