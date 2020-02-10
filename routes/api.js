
/**
* DEMO FILE
*
* Dummy API route
**/

const Joi = require('@hapi/joi');

const DummyApi = require('../api/index');
const JoiModels = require('../utils/joi-models');

const routes = [];
module.exports = routes;

// Example request
routes.push({
  method: 'GET',
  path: '/get',
  options: {
    auth: false,
    description: 'Dummy get request',
    tags: ['api'],
    handler: DummyApi.get,
    validate: {
      query: Joi.object(JoiModels.LIST_DEFAULT),
    },
    response: {
      failAction: JoiModels.FAIL_ACTION,
    },
  },
});
