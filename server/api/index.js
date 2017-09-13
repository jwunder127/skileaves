'use strict'; // eslint-disable-line semi

require('APP/database/db');
const routes = module.exports = require('express').Router();// eslint-disable-line new-cap
const mountains = require('./mountains');

routes
  .get('/heartbeat', (req, res) => res.send({ok: true}));

// No routes matched? 404.
routes.use((req, res) => res.status(404).end());

module.exports = function(app, db) {
    mountains(app, db);
};
