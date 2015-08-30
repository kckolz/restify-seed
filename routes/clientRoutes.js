'use strict';

var clientController = require('../controllers/clientController');

function ClientRoutes(api) {
  api.post('/api/client', clientController.createClient);
  api.get('/api/client/:clientId', clientController.getClient);
}

module.exports.routes = ClientRoutes;