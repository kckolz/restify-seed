'use strict';

// Load required packages
var OAuthClientsSchema = require('../models/client');
var responseUtil = require('../util/responseUtil');

var ClientController = {

  createClient: function(req, res) {

    OAuthClientsSchema.find({clientId:req.body.clientId}, function(err, client) {
      if (err) {
        return responseUtil.handleInternalError(res, err);
      }

      if (client.length) {
        return responseUtil.handleBadRequest(res, 'A client already exists with that id.');
      }

      // Save the client and check for errors
      OAuthClientsSchema.register(req.body.clientId, req.body.secret, function(err, client) {
        if (err) {
          return responseUtil.handleInternalError(res, err);
        }

        return responseUtil.handleSuccess(res, client.clientId);
      });
    });
  },

  getClient: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    var clientId = req.params.clientId;

    // Use the User model to find all clients
    OAuthClientsSchema.find({'clientId':clientId}, function(err, client) {
      if (err) {
        return responseUtil.handleInternalError(res, err);
      } else {
        return responseUtil.handleSuccess(res, client);
      }
      
    });
  }
};

module.exports = ClientController;