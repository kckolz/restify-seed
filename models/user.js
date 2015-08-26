var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  user = new OAuthUsersModel(fields);
  user.save(cb);
});

OAuthUsersSchema.static('getUser', function(email, password, cb) {
  OAuthUsersModel.authenticate(email, password, function(err, user) {
    if (err || !user) return cb(err);
    cb(null, user.email);
  });
});

OAuthUsersSchema.static('updateUser', function(currentUser, cb) {

  var model = this;
  model.update({_id:currentUser._id},
    {$set: { firstname: currentUser.firstname,
      lastname: currentUser.lastname,
      hashed_password: hashPassword(currentUser.password),
      email: currentUser.email}}, null,
    function(err){
      if (err) {
        cb(err);
      }
      model.findOne({'_id':currentUser._id}, function(err, user) {
        if (err) {
          cb(err);
        }
        cb(null, user);
      });
    });
});

OAuthUsersSchema.static('authenticate', function(email, password, cb) {
  this.findOne({ email: email }, function(err, user) {
    if (err || !user) return cb(err);
    cb(null, bcrypt.compareSync(password, user.hashed_password) ? user : null);
  });
});

mongoose.model('users', OAuthUsersSchema);

var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;
