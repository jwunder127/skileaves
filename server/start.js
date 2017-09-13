'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {resolve} = require('path');
const PrettyError = require('pretty-error');
const finalHandler = require('finalhandler');
const pkg = require('APP');
const {env} = pkg;
const MongoClient = require('mongodb').MongoClient;
const db = require('../database/db');


const app = express();

if (!pkg.isProduction && !pkg.isTesting) {
  // Logging middleware (dev only)
  app.use(require('volleyball'));
}

const prettyError = new PrettyError();

// Skip events.js and http.js and similar core node files.
prettyError.skipNodeFiles();

// Skip all the trace lines about express' core and sub-modules.
prettyError.skipPackage('express');

// module.exports = app

// Body parsing middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);
  if (module === require.main) {

  // Serve static files from ../public
  app.use(express.static(resolve(__dirname, '..', 'public')));

  // use api for api routes (need to make this private so it's inaccessible from url bar)
  require('./api')(app, database);

  // // Send index.html for anything else.
  app.get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));

  app.use((error, req, res, next) => {
    console.error(prettyError.render(error));
    finalHandler(req, res)(error);
  });
  // Start listening only if we're the main module.
  //
  // https://nodejs.org/api/modules.html#modules_accessing_the_main_module
  const server = app.listen(
    process.env.PORT || 8080,
    () => {
      console.log(`--- Started HTTP Server for ${pkg.name} ---`);
      const { address, port } = server.address();
      const host = address === '::' ? 'localhost' : address;
      const urlSafeHost = host.includes(':') ? `[${host}]` : host;
      console.log(`Listening on http://${urlSafeHost}:${port}`);
    }
    );
  }
});
