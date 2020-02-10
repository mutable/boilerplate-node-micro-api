const Meta = require('@mutable/meta');
const Promise = require('promise');
const Pg = require('pg-promise');
const Redis = require('redis');

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const Controller = {
  config: {},
};

const setConfigs = (fullConfig) => {
  const config = fullConfig[env];
  if (JSON.stringify(Controller.config) === JSON.stringify(config)) return undefined;

  if (!config.postgres) throw new Error('config.postgres is not set');
  if (!config.redis) throw new Error('config.redis is not set');
  if (!config.sendgrid) throw new Error('config.sendgrid is not set');

  if (JSON.stringify(Controller.config.postgres) !== JSON.stringify(config.postgres)) {
    Controller.pg = Pg({ promiseLib: Promise })(`postgres://${config.postgres.user}:${config.postgres.pass}@${config.postgres.host}/${config.postgres.db}`);
  }

  if (typeof JSON.stringify(Controller.config.redis) === 'undefined') {
    Controller.pub = Redis.createClient(config.redis.port, config.redis.host);
    Controller.sub = Redis.createClient(config.redis.port, config.redis.host);

    if (env === 'prod') {
      Controller.pub.auth(config.redis.pass);
      Controller.sub.auth(config.redis.pass);
      Controller.pub.select(config.redis.db);
      Controller.sub.select(config.redis.db);
    }

    Controller.pub.setMaxListeners(0);
    Controller.sub.setMaxListeners(0);
  } else if (JSON.stringify(Controller.config.redis) !== JSON.stringify(config.redis)) {
    throw new Error('Killed because redis changed and didnt handle redis change on hapi catbox');
  }

  Controller.config = config;
  return config;
};

Meta.on('configChange', setConfigs);

Controller.init = Meta.config()
  .then(setConfigs)
  .catch((e) => {
    console.error(e);
    throw e;
  });


Controller.underscoreToCamel = (dataParam) => {
  let data = dataParam;
  let isArray;
  if (data.constructor !== Array) {
    isArray = true;
    data = [data];
  }

  data = data.map((item) => {
    const obj = {};
    Object.keys(item).forEach((key) => {
      let value = item[key];
      if (value === null
        || value === undefined
        || value === 'null'
        || value === 'NULL'
        || value === 'Null') value = '';

      obj[key.replace(/(_[a-z0-9])/g, (val) => val.toUpperCase().replace('_', ''))] = value;
    });
    return obj;
  });

  data = data.map((itemParam) => {
    let item = itemParam;
    if (item === null
      || item === undefined
      || item === 'null'
      || item === 'NULL'
      || item === 'Null') item = '';
    return item;
  });
  return isArray ? data[0] : data;
};

Controller.camelToUnderscore = (dataParam) => {
  let data = dataParam;
  let isArray;
  if (data.constructor !== Array) {
    isArray = true;
    data = [data];
  }

  data = data.map((item) => {
    const obj = {};
    Object.keys(item).forEach((key) => {
      obj[key.replace(/([A-Z])/g, (val) => `_${val.toLowerCase()}`)] = item[key];
    });
    return obj;
  });

  return isArray ? data[0] : data;
};

module.exports = Controller;
