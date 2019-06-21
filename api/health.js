
/**
* Monitor service health
**/

const tooBusy = require('toobusy-js');

const HealthApi = {};
module.exports = HealthApi;

HealthApi.healthCheck = () => tooBusy.lag().toString();
