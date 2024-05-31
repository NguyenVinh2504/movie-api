"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtHelper = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var generateToken = function generateToken(_ref) {
  var user = _ref.user,
    tokenLife = _ref.tokenLife,
    exp = _ref.exp,
    tokenSecret = _ref.tokenSecret;
  var data = {
    _id: user._id,
    admin: user.admin
  };
  if (exp) {
    return _jsonwebtoken["default"].sign(_objectSpread({
      exp: exp
    }, data), tokenSecret, {});
  } else {
    return _jsonwebtoken["default"].sign(data, tokenSecret, {
      expiresIn: tokenLife
    });
  }
};
var verifyToken = function verifyToken(token, secretKey) {
  return _jsonwebtoken["default"].verify(token, secretKey);
};
var jwtHelper = {
  generateToken: generateToken,
  verifyToken: verifyToken
};
exports.jwtHelper = jwtHelper;