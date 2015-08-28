'use strict';

var userController = require('../controllers/userController');

function UserRoutes(api) {
  api.post('/api/user', userController.createUser);
  api.get('/api/user/:userId', userController.getUserById);
  api.put('/api/user', userController.updateUser);
}

module.exports.routes = UserRoutes;