'use strict';

const {resolve} = require('path');
const chalk = require('chalk');
const pkg = require('./package.json');
const debug = require('debug')(`${pkg.name}:boot`);


const env = Object.create(process.env);
const secretsFile = resolve(env.HOME, `.${pkg.name}.env`);

try {
  Object.assign(env, require(secretsFile));
} catch (error) {
  debug('%s: %s', secretsFile, error.message);
  debug('%s: env file not found or invalid, moving on', secretsFile);
}

const PORT = process.env.PORT || 8080;

module.exports = {
  get name() { return pkg.name; },
  get isTesting() { return !!global.it; },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get baseUrl() {
    return env.BASE_URL || `http://localhost:${PORT}`;
  },
  get port() {
    return env.PORT || 8080;
  },
  package: pkg,
  env,
}
