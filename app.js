var restify = require('restify');
var fs = require('fs');
var oauthserver = require('oauth2-server');
var oauthModel = require('./models/oauth')
var mongoose = require('mongoose');
var domain = require('domain');
var config = require('./config');
var logger = require('./libraries/logger').getLogger('app');
var middleware = require('./components/middleware');

var api = restify.createServer({
  name: config.api.name,
  formatters: {
    'application/json': function(req, res, body) {
      return JSON.stringify(body);
    }
  }
});

api.pre(restify.pre.sanitizePath());
api.use(restify.acceptParser(api.acceptable));
api.use(restify.bodyParser());
api.use(restify.queryParser());
api.use(restify.authorizationParser());

logger.info('enabling CORS');
api.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  return next();
});

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./seed'); }

//Global error handler
api.use(function(req, res, next) {
  var domainHandler = domain.create();

  domainHandler.on('error', function(err) {
    var errMsg = 'Request: \n' + req + '\n';
    errMsg += 'Response: \n' + res + '\n';
    errMsg += 'Context: \n' + err;
    errMsg += 'Trace: \n' + err.stack + '\n';

    logger.error(errMsg || '');

    domain.dispose();
  });

  domainHandler.enter();
  next();
});

// oauth config
api.oauth = oauthserver({
  model: oauthModel,
  grants: ['password', 'refresh_token'],
  debug: true,
  accessTokenLifetime: 31536000
});

api.get('/oauth/token', api.oauth.grant());

api.use(middleware.authorise)

api.use(api.oauth.errorHandler());

//Iterates through all ./routes files to find matching route
logger.info('loading routes');
fs.readdirSync('./routes').forEach(function(curFile) {
  if (curFile.substr(-3) === '.js') {
    route = require('./routes/' + curFile);
    route.routes(api);
  }
});

logger.info('attempting to start server');
api.listen(config.environment.port, function() {
  logger.info('%s is running at %s', config.api.name, api.url);
});

module.exports = api;