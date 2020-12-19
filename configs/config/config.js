require('dotenv').config()
const _ = require('lodash');
const env = process.env.NODE_ENV;
const envConfig = require('./' + env);

let defaultConfig = {
  env: env
};

module.exports = _.merge(defaultConfig, envConfig);