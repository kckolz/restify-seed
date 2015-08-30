'use strict';

var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var OAuthUsersSchema = new Schema({
  email: { type: String, unique: true, required: true },
  admin: { type: Boolean, required: true},
  hashed_password: { type: String, required: true },
  password_reset_token: { type: String, unique: true },
  reset_token_expires: Date,
  firstname: String,
  lastname: String
});

function hashPassword(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

OAuthUsersSchema.static('register', function(fields, cb) {
  var user;
  var dfd = Q.defer();
  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  user = new OAuthUsersModel(fields);
  user.save().then(function(user) {
    dfd.resolve(user)
  }, function(error) {
    dfd.reject(error);
  });
  return dfd.promise;
});

OAuthUsersSchema.static('getUser', function(email) {
  var dfd = Q.defer();
  this.findOne({ email: email }).then(function(user) {
    dfd.resolve(user);
  }, function(error) {
    dfd.reject(error);
  })
  return dfd.promise;
});

OAuthUsersSchema.static('updateUser', function(currentUser) {
  var dfd = Q.defer();
  var model = this;
  model.update({_id:currentUser._id},
    {$set: { firstname: currentUser.firstname,
      lastname: currentUser.lastname,
      hashed_password: hashPassword(currentUser.password),
      email: currentUser.email}}, null,
    function(err, user){
      if (err) {
        dfd.reject(err);
      } else {
        dfd.resolve(user);
      }
    });
  return dfd.promise;
});

OAuthUsersSchema.static('authenticate', function(email, password) {
  var dfd = Q.defer();
  this.findOne({ email: email }).then(function(user) {
    dfd.resolve(bcrypt.compareSync(password, user.hashed_password) ? user : null);
  }, function(error) {
    dfd.reject(error);
  })
  return dfd.promise;
});

mongoose.model('users', OAuthUsersSchema);

var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;
