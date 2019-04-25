const Joi = require('joi');
const Boom = require('boom');

const Api = require('../api/index');

const routes = [];
module.exports = routes;

const LIST_DEFAULT = {
  offset: Joi.number().optional().default(0).description('Set db query OFFSET'),
  limit: Joi.number().optional().default(10).description('Set db query LIMIT'),
}

const FAIL_ACTION = async (request, h, err) => Boom.badRequest(err.details[0].message);

routes.push({
  method: 'GET',
  path: '/get',    
  config: {
    auth: false,
    description: 'Dummy get request',
    tags: ['api'],
    handler: Api.get,  
    validate: {
      query: Object.assign({}, LIST_DEFAULT, {}),
    },
    response: {      
      failAction: FAIL_ACTION
    },
  },
});