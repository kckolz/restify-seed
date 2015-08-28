var Q = require('q');
var logger = require('../libraries/logger').getLogger('ClientModel');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OAuthClientSchema = new Schema({
  clientId: { type: String, unique: true, required: true },
  secret: { type: String, required: true}
});

function hashSecret(secret) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(secret, salt);
}

OAuthClientSchema.static('register', function(clientId, secret) {
  hashedSecret = hashSecret(secret);
  var client = new OAuthClientsModel({clientId: clientId, secret: hashedSecret});
  return client.save();
});

OAuthClientSchema.static('authenticate', function(clientId, secret, cb) {

  this.findOne({ clientId: clientId }).then(function(client) {
    cb(null, bcrypt.compareSync(secret, client.secret) ? client : null);
  }, function(error) {
    return error;
  })
});

mongoose.model('clients', OAuthClientSchema);

var OAuthClientsModel = mongoose.model('clients');
module.exports = OAuthClientsModel;