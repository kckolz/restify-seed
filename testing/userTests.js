var expect = require('chai').expect;
var sinon = require('sinon');
var userModel = require('../models/user');

describe('User Tests', function() {
  var savedUser,
      testUser;

  beforeEach(function(){    
    //add some test data  
    testUser = {
      email : "test@gmail.com",
      admin : true,
      firstname: 'First',
      lastname: 'Last',
      password: 'password'
    }
    userModel.register(testUser).then(function(user) {
      savedUser = user;
    })
    .finally(function() {
      expect(savedUser.email).to.equal(testUser.email);
    });
  });  

  afterEach(function(){    
    userModel.remove(savedUser, function() {         
    });  
  });

  describe('createUser function', function() {
    var testUser2 = {
      email : "test2@gmail.com",
      admin : true,
      firstname: 'First',
      lastname: 'Last',
      password: 'password'
    };
    it('returns the newly created user', function() {
      var out = '';
      userModel.register(testUser2).then(function(user) {
        out = user;
      })
      .finally(function() {
        expect(out.email).to.equal(testUser2.email);
      });
    });
  });

  describe('getUser function', function() {
    it('gets the newly created user', function() {
      var out = '';

      userModel.getUser("test@gmail.com").then(function(user) {
        out = user;
      })
      .finally(function() {
        expect(out.email).to.equal("test@gmail.com");
      });
    });
  });

  describe('updateUser function', function() {
    it('updates the newly created user', function() {
      var out = '';
      testUser = {
        email : "test-updated@gmail.com",
        admin : true,
        firstname: 'First',
        lastname: 'Last',
        password: 'password'
      }
      userModel.updateUser(testUser).then(function(user) {
        out = user;
      })
      .finally(function() {
        expect(out.firstname).to.equal(testUser.firstname);
      });
    });
  });

  describe('authenticate function', function() {
    it('authenticates the newly created user', function() {
      var out = '';
      userModel.authenticate(testUser.email, testUser.password).then(function(user) {
        out = user;
      })
      .finally(function() {
        expect(out.firstname).to.equal(testUser.firstname);
      });
    });
  });
});