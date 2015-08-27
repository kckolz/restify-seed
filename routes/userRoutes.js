'use strict';

var userController = require('../controllers/userController');

function UserRoutes(api) {
  api.post('/api/user', userController.createUser);
  api.get('/api/user/me', userController.me);
  api.get('/api/user/:userId', userController.getUser);
  api.put('/api/user', userController.updateUser);
}

module.exports.routes = UserRoutes;