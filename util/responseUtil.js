'use strict';

exports.handleSuccess = function(res, data) {
  return res.send(200, data);
};

exports.handleInternalError = function(res, err) {
  return res.send(500, err);
};

exports.handleBadRequest = function(res, err) {
  return res.send(400, err);
};

exports.handleNotFoundRequest = function(res, err) {
  return res.send(404, err);
};

exports.handleUnauthorizedRequest = function(res, err) {
  return res.send(401, err);
};
