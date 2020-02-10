
/**
* DEMO FILE
*
* Dummy request validator
**/

const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

const Models = {};
module.exports = Models;

// Example validation
Models.FAIL_ACTION = async (request, h, err) => Boom.badRequest(err.details[0].message);

Models.LIST_DEFAULT = {
  offset: Joi.number().optional().default(0).description('Set db query OFFSET'),
  limit: Joi.number().optional().default(10).description('Set db query LIMIT'),
};

module.exports = Models;
