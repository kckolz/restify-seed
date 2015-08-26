var argv = require('yargs').argv;

exports.api = {
  name: 'Restify Seed',
  version: '0.0.1'
};

exports.limiter = {
  defaultBurstRate: 50,
  defaultRatePerSec: 0.5,
};

if (!argv.production) {
  exports.environment = {
    name: 'development',
    port: 1337
  };
} else {
  exports.environment = {
    name: 'production',
    port: 3000
  };
}
 
exports.mongo = {
  uri: 'mongodb://localhost:27017/test'
}

exports.seedDB = false;