const app = require('APP');
const {env} = app;

module.exports = {
    url: env['MONGODBURL']
}
