'use strict';

// Load required packages
var OAuthClientsSchema = require('../models/client');
var responseUtil = require('../util/responseUtil');

var ClientController = {

  createClient: function(req, res) {

    OAuthClientsSchema.find({clientId:req.body.clientId}).exec()
      .then(function(client) {
        return responseUtil.handleBadRequest(res, 'A client already exists with that id.');
      }, function(error) {
        return responseUtil.handleInternalError(res, error);
      });

    // Save the client and check for errors
    OAuthClientsSchema.register(req.body.clientId, req.body.secret)
      .then(function(client) {
        return responseUtil.handleSuccess(res, client.clientId);
      }, function(error) {
        return responseUtil.handleInternalError(res, err);
      })
  },

  getClient: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    // Use the User model to find all clients
    OAuthClientsSchema.find({'clientId':req.params.clientId}).exec().then(function(client) {
      return responseUtil.handleSuccess(res, client);
    }, function(error) {
      return responseUtil.handleInternalError(res, err);
    })
  }
};

module.exports = ClientController;