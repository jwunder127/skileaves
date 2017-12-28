'use strict';

const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const devMode = process.env.NODE_ENV === 'development' || env['NODE_ENV'] === 'development';
const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './public/ant-default-vars.less'), 'utf8'));

/**
 * Fast source maps rebuild quickly during development, but only give a link
 * to the line where the error occurred. The stack trace will show the bundled
 * code, not the original code. Keep this on `false` for slower builds but
 * usable stack traces. Set to `true` if you want to speed up development.
 */

const USE_FAST_SOURCE_MAPS = false;

const config = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  context: __dirname,
  devtool: devMode && USE_FAST_SOURCE_MAPS
    ? 'cheap-module-eval-source-map'
    : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  },
  module: {
    loaders: [
      {
      test: /jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader' // config in .babelrc
    },
    {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader",
      include:  /node_modules\/antd\/lib/
    },
    {
      test: /\.less$/,
      loader: 'style-loader!css-loader?module=true&localIdentName=[hash:base64:5]!less-loader',
      exclude:  /node_modules\/antd\/lib/
  }]
  },
  plugins: devMode
    ? [new LiveReloadPlugin({appendScriptTag: true})
    ]
    : []
};

if (devMode){
  config.devtool = USE_FAST_SOURCE_MAPS
    ? 'cheap-module-eval-source-map'
    : 'source-map';
  config.plugins.push(
    new LiveReloadPlugin({
      appendScriptTag: true
    })
  );
}

module.exports = config;
