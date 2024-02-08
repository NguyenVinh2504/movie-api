"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _joiPassword = require("joi-password");
/* eslint-disable no-console */

var joiPassword = _joi["default"].extend(_joiPassword.joiPasswordExtendCore);
var signUp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          correctCondition = _joi["default"].object({
            name: _joi["default"].string().required().label('name').messages({
              'any.required': '{#label} Chưa nhập tên đăng nhập'
            }),
            email: _joi["default"].string().email().required('This is required').label('email').messages({
              'string.email': '{#label} Sai định dạng email',
              'any.required': '{#label} Email chưa nhập'
            }),
            avatar: _joi["default"].string()["default"](null),
            password: joiPassword.string().min(8).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters().required().label('Mật khẩu').messages({
              'any.required': 'Chưa nhập {#label}',
              'string.min': '{#label} chứa ít nhất 8 kí tự',
              'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
              'password.minOfSpecialCharacters': '{#label} nên chứa kí tự đặc biệt',
              'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
              'password.minOfNumeric': '{#label} nên chứa chữ số',
              'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
              'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
            }),
            confirmPassword: _joi["default"].any().valid(_joi["default"].ref('password')).required().label('Confirm password').messages({
              'any.only': '{{#label}} nhập lại mật khẩu chưa chính xác',
              'any.required': '{{#label}} Chưa nhập lại mật khẩu'
            })
          });
          _context.prev = 1;
          _context.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context.t0.message));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function signUp(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          correctCondition = _joi["default"].object({
            email: _joi["default"].string().required().label('email').messages({
              'any.required': '{#label} Chưa nhập email đăng nhập'
            }),
            password: joiPassword.string().required().label('Mật khẩu').messages({
              'any.required': 'Chưa nhập {#label}'
            })
          });
          _context2.prev = 1;
          _context2.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context2.t0.message));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function login(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var authValidation = {
  signUp: signUp,
  login: login
};
exports.authValidation = authValidation;