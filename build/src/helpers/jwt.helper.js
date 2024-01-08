"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtHelper = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var generateToken = function generateToken(user, tokenSecret, tokenLife) {
  var data = {
    _id: user._id,
    admin: user.admin
  };
  return _jsonwebtoken["default"].sign(data, tokenSecret, {
    expiresIn: tokenLife
  });
};
var verifyToken = function verifyToken(token, secretKey) {
  return _jsonwebtoken["default"].verify(token, secretKey);
};
var jwtHelper = {
  generateToken: generateToken,
  verifyToken: verifyToken
};
exports.jwtHelper = jwtHelper;