var restify = require('restify');
var config = require('../config');
var userController = require('../controllers/userController');

function UserRoutes(api) {
  api.post('/api/user', userController.createUser);
  api.get('/api/user/me', userController.me);
  api.get('/api/user/:userId', userController.getUser);
  api.put('/api/user', userController.updateUser);

  api.get('api/test', function(req, res) {
    res.send(200, "hi");
  })
}

module.exports.routes = UserRoutes;