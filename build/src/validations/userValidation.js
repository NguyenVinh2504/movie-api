"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _joiPassword = require("joi-password");
var _userModel = require("../models/userModel");
/* eslint-disable no-console */

var joiPassword = _joi["default"].extend(_joiPassword.joiPasswordExtendCore);
var deleteUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          correctCondition = _joi["default"].object({
            password: joiPassword.string().required().label('Mật khẩu').messages({
              'any.required': 'Chưa nhập {#label}'
            }),
            userId: _joi["default"].string()
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
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, new Error(_context.t0).message));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function deleteUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updatePassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          correctCondition = _joi["default"].object({
            password: joiPassword.string().required().label('Mật khẩu').messages({
              'any.required': 'Chưa nhập {#label}'
            }),
            newPassword: joiPassword.string().min(8).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters().required().label('Mật khẩu mới').messages({
              'any.required': 'Chưa nhập {#label}',
              'string.min': '{#label} chứa ít nhất 8 kí tự',
              'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
              'password.minOfSpecialCharacters': '{#label} nên chứa kí tự đặc biệt',
              'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
              'password.minOfNumeric': '{#label} nên chứa chữ số',
              'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
              'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
            }),
            confirmNewPassword: _joi["default"].any().valid(_joi["default"].ref('newPassword')).required().label('Confirm password').messages({
              'any.only': '{{#label}} nhập lại mật khẩu chưa chính xác',
              'any.required': '{{#label}} Chưa nhập lại mật khẩu'
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
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, new Error(_context2.t0).message));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function updatePassword(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateProfile = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          correctCondition = _joi["default"].object({
            name: _joi["default"].string().label('name').messages({
              'any.required': '{#label} Chưa nhập tên đăng nhập'
            }),
            email: _joi["default"].string().email().label('email').messages({
              'string.email': '{#label} Sai định dạng email'
            }).external( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(value, help) {
                var email;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return _userModel.userModel.getEmail(value);
                    case 2:
                      email = _context3.sent;
                      if (!email) {
                        _context3.next = 5;
                        break;
                      }
                      return _context3.abrupt("return", help.message('Email đã được sử dụng. Vui lòng đăng nhập với mật khẩu hoặc sử dụng email khác'));
                    case 5:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              }));
              return function (_x10, _x11) {
                return _ref4.apply(this, arguments);
              };
            }()),
            phone: _joi["default"].number().allow('')["default"](null).messages({
              'number.base': 'Vui lòng nhập chữ số'
            }),
            avatar: _joi["default"].string().allow(null)["default"](null)
          });
          _context4.prev = 1;
          _context4.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context4.next = 10;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, new Error(_context4.t0).message));
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return function updateProfile(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var sendGmail = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          correctCondition = _joi["default"].object({
            email: _joi["default"].string().email().required().label('email').messages({
              'string.email': '{#label} Sai định dạng email',
              'any.required': '{#label} Email chưa nhập'
            })
          });
          _context5.prev = 1;
          _context5.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, new Error(_context5.t0).message));
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return function sendGmail(_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();
var forgotPassword = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          correctCondition = _joi["default"].object({
            email: _joi["default"].string().email().required().label('email').messages({
              'string.email': '{#label} Sai định dạng email',
              'any.required': '{#label} Email chưa nhập'
            }),
            otp: _joi["default"].number().required().label('otp').messages({
              'number.base': 'Vui lòng nhập chữ số',
              'any.required': '{#label} Otp chưa nhập'
            }),
            newPassword: joiPassword.string().min(8).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters().required().label('Mật khẩu').messages({
              'any.required': 'Chưa nhập {#label}',
              'string.min': '{#label} chứa ít nhất 8 kí tự',
              'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
              'password.minOfSpecialCharacters': '{#label} nên chứa kí tự đặc biệt',
              'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
              'password.minOfNumeric': '{#label} nên chứa chữ số',
              'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
              'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
            })
          });
          _context6.prev = 1;
          _context6.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, new Error(_context6.t0).message));
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 7]]);
  }));
  return function forgotPassword(_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}();
var userValidation = {
  deleteUser: deleteUser,
  updatePassword: updatePassword,
  updateProfile: updateProfile,
  sendGmail: sendGmail,
  forgotPassword: forgotPassword
};
exports.userValidation = userValidation;