"use strict";

var _ = require("lodash");
var crypto = require("crypto");
var UserModel = require('../models/user');
var ClientModel = require('../models/client');

var redis = require("redis"),
redisClient = redis.createClient();

function generateToken(data) {
    var random = Math.floor(Math.random() * 100001);
    var timestamp = (new Date()).getTime();
    var sha256 = crypto.createHmac("sha256", random + "WOO" + timestamp);

    return sha256.update(data).digest("base64");
}

exports.validateClient = function (credentials, req, cb) {
    // Call back with `true` to signal that the client is valid, and `false` otherwise.
    // Call back with an error if you encounter an internal server error situation while trying to validate.
    ClientModel.authenticate(credentials.clientId, credentials.clientSecret, function(error, client) {
        if(client) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    })
};

exports.grantUserToken = function (credentials, req, cb) {
    UserModel.getUser(credentials.username, credentials.password, function (err, user) {
        if(user) {
            // If the user authenticates, generate a token for them and store it so `exports.authenticateToken` below
            // can look it up later.
            var token = generateToken(credentials.username + ":" + credentials.password);
            redisClient.set(token, credentials.username, redis.print);

            // Call back with the token so Restify-OAuth2 can pass it on to the client.
            return cb(null, token);
        } else {
             // Call back with `false` to signal the username/password combination did not authenticate.
            // Calling back with an error would be reserved for internal server error situations.
            cb(null, false);
        }
    });
};

exports.authenticateToken = function (token, req, cb) {
    // This will return a JavaScript String
    redisClient.get(token, function (err, reply) {
        if(reply) {
            // If the token authenticates, set the corresponding property on the request, and call back with `true`.
            // The routes can now use these properties to check if the request is authorized and authenticated.
            req.username = reply.toString();
            return cb(null, true);
        } else {
            // If the token does not authenticate, call back with `false` to signal that.
            // Calling back with an error would be reserved for internal server error situations.
            cb(null, false);
        }
    });
};