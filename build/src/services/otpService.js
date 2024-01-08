"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.otpService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _otpModel = require("../models/otpModel");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _hashPassword = _interopRequireDefault(require("../utils/hashPassword"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */

var otpCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var email, otp, hastOtp, getOtp;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          email = data.email, otp = data.otp;
          _context.next = 4;
          return (0, _hashPassword["default"])(otp);
        case 4:
          hastOtp = _context.sent;
          _context.next = 7;
          return _otpModel.otpModel.createOtp({
            email: email,
            otp: hastOtp
          });
        case 7:
          getOtp = _context.sent;
          return _context.abrupt("return", getOtp ? 1 : 0);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          throw _context.t0;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return function otpCreate(_x) {
    return _ref.apply(this, arguments);
  };
}();
var otpVerify = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var otp, hashOtp, isValid;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          otp = _ref2.otp, hashOtp = _ref2.hashOtp;
          _context2.prev = 1;
          _context2.next = 4;
          return _bcrypt["default"].compare(otp, hashOtp);
        case 4:
          isValid = _context2.sent;
          return _context2.abrupt("return", isValid);
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          throw _context2.t0;
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return function otpVerify(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var otpService = {
  otpCreate: otpCreate,
  otpVerify: otpVerify
};
exports.otpService = otpService;