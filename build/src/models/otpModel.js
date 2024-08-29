"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.otpModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("../config/mongodb");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var OTP_COLLECTION_NAME = 'otp';
var OTP_COLLECTION_SCHEMA = _joi["default"].object({
  email: _joi["default"].string().email().required().label('email').messages({
    'string.email': '{#label} Sai định dạng email',
    'any.required': '{#label} Email chưa nhập'
  }),
  otp: _joi["default"].string().required()
});
var createOtp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var validData, otp;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return OTP_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validData = _context.sent;
          _context.prev = 3;
          _context.next = 6;
          return (0, _mongodb.GET_DB)().collection(OTP_COLLECTION_NAME).insertOne(_objectSpread(_objectSpread({}, validData), {}, {
            createdAt: new Date(new Date().setMinutes(new Date().getMinutes() + 2))
          }));
        case 6:
          otp = _context.sent;
          (0, _mongodb.GET_DB)().collection(OTP_COLLECTION_NAME).createIndex({
            createdAt: 1
          }, {
            expireAfterSeconds: 10
          });
          return _context.abrupt("return", otp);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          throw new Error(_context.t0);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 11]]);
  }));
  return function createOtp(_x) {
    return _ref.apply(this, arguments);
  };
}();
var findOtp = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(email) {
    var otp;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _mongodb.GET_DB)().collection(OTP_COLLECTION_NAME).find({
            email: email
          }).toArray();
        case 3:
          otp = _context2.sent;
          return _context2.abrupt("return", otp);
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw new Error(_context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function findOtp(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var deleteOtp = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(email) {
    var otp;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _mongodb.GET_DB)().collection(OTP_COLLECTION_NAME).deleteMany({
            email: email
          });
        case 3:
          otp = _context3.sent;
          return _context3.abrupt("return", otp);
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw new Error(_context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function deleteOtp(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var otpModel = {
  OTP_COLLECTION_NAME: OTP_COLLECTION_NAME,
  OTP_COLLECTION_SCHEMA: OTP_COLLECTION_SCHEMA,
  createOtp: createOtp,
  findOtp: findOtp,
  deleteOtp: deleteOtp
};
exports.otpModel = otpModel;