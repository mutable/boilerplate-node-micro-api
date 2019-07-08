
/**
* Health status check endpoint
**/

const HEALTH_API = require('../api/health');

const Routes = [];
module.exports = Routes;

Routes.push({
  method: 'GET',
  path: '/health',
  options :{
    description: 'Health Check',
    tags: ['api','mutable','Health'],
    handler: HEALTH_API.healthCheck
    }
});
