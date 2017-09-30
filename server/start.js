'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {resolve} = require('path');
const PrettyError = require('pretty-error');
const finalHandler = require('finalhandler');
const pkg = require('APP');
const {env} = pkg;
const db = require('../database/db');
const url = env['MONGODBURL'];


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

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

  // Serve static files from ../public
app.use(express.static(resolve(__dirname, '..', 'public')));

app.use('/api', require('./api'));

  // // Send index.html for anything else.
app.get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));

db.connect(url, (err) => {
  if (err){
    console.log('unable to connect:', err);
    process.exit(1);
  } else {
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
