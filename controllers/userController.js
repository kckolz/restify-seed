// Load required packages
var OAuthUsersSchema = require('../models/user');
var responseUtil = require('../util/responseUtil');
var uuid = require('node-uuid');
var bson = require("bson");
var objectid = bson.BSONPure.ObjectID;

var UserController = {

  createUser: function(req, res) {

    // Create a new instance of the User model
    var user = new OAuthUsersSchema();

    // Set the client properties that came from the POST data
    var isAdmin = req.body.admin;
    user.admin = isAdmin == null || isAdmin == '' ? false : isAdmin;
    user.firstname = req.body.firstName;
    user.lastname = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.password_reset_token = uuid.v1();

    OAuthUsersSchema.find({email:req.body.email}, function(err, userExistsResult) {
      if (err) {
        return responseUtil.handleInternalError(res, err);
      }

      if (userExistsResult.length > 0) {
        return responseUtil.handleBadRequest(res, 'A user already exists with that email address.')
      }

      // Save the client and check for errors
      OAuthUsersSchema.register(user, function(err) {
        if (err) {
          return responseUtil.handleInternalError(res, err);
        }

        return responseUtil.handleSuccess(res, user);
      });
    });
  },

  me: function(req, res) {
    var authUser = res.locals.user;
    return responseUtil.handleSuccess(res, authUser)
  },

  getUser: function(req, res) {
    var userId = req.params.userId;

    // Use the User model to find all clients
    OAuthUsersSchema.find({'_id':userId}, function(err, user) {
      if (err) {
        return responseUtil.handleInternalError(res, err);
      }
      return responseUtil.handleSuccess(res, user);
    });
  },

  updateUser: function(req,res) {
    var userId = req.params.userId;
    var authUser = res.locals.user;
    var authUserId = authUser.id;

    //must be this user or an admin
    if (authUserId != userId && !authUser.admin) {
      return responseUtil.handleUnauthorizedRequest(res, 'Insufficient privileges.');
    }

    //must be valid mongo id format or shit blows up
    if (!objectid.isValid(userId)) {
      return responseUtil.handleBadRequest(res, 'Invalid userId format.');
    }

    OAuthUsersSchema.find({'_id':userId}, function(err, user) {
      if (err) {
        return responseUtil.handleInternalError(res, err);
      }

      if (user.length > 0) {

        user._id=userId;
        user.firstname=req.body.firstName;
        user.lastname=req.body.lastName;
        user.password=req.body.password;
        user.email=req.body.email;

        OAuthUsersSchema.updateUser(user, function(err, updatedUser){
          if (err) {
            return responseUtil.handleInternalError(res, err);
          }
          return responseUtil.handleSuccess(res, updatedUser)
        });
      } else {
        return responseUtil.handleNotFoundRequest(res, 'Unable to find specified user.')
      }
    });
  }
};

module.exports = UserController;