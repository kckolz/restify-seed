var models = require('./../../models');
var User = models.User;
var app = require('./../../app');

function authorise(req, res, next) {
  // if (req.session.userId) {
  //   req.user = { id: req.session.userId };
  //   next();
  // } else {
    app.oauth.authorise()(req, res, next);
  // }
}

function loadUser(req, res, next) {
  User.findOne({ email: req.user.id}, function(err, user) {
    if (err) return next(err);
    res.locals.user = user;
    next();
  });
}

function isValidationError(err) {
  return err && err.name === 'ValidationError';
}

function notFoundHandler(req, res, next) {
  res.status(404);
  res.format({
    html: function() {
      res.render('404', { url: req.url });
    },
    json: function() {
      res.send({ error: 'Not Found' });
    }
  });
}

module.exports.authorise = authorise;
module.exports.loadUser = loadUser;
module.exports.isValidationError = isValidationError;
module.exports.notFoundHandler = notFoundHandler;
