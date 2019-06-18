/**
* Combine all routes into one array
*/

const health = require('./health');
const api = require('./api');

const _routes = [health, api];
const routes = [];

_routes.forEach((_route) => {
  if (typeof _route === 'object' && _route.length) {
    _route.forEach((_r) => {
      routes.push(_r);
    });
  } else if (typeof _route === 'object') { routes.push(_route); }
});

module.exports = routes;