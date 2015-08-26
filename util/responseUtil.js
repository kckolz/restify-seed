'use strict';

exports.handleSuccess = function(res, data) {
  return res.send(200, { success: true, result: data });
};

exports.handleInternalError = function(res, err) {
  return res.send(500, { success: false, message: err });
};

exports.handleBadRequest = function(res, err) {
  return res.send(400, { success: false, message: err });
};

exports.handleNotFoundRequest = function(res, err) {
  return res.send(404, { success: false, message: err });
};

exports.handleUnauthorizedRequest = function(res, err) {
  return res.send(401, { success: false, message: err });
};
