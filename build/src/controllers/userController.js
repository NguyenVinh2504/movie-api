"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _userService = require("../services/userService");
/* eslint-disable no-console */

var deleteUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _userService.userService.deleteUser(req);
        case 3:
          user = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(user);
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function deleteUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updatePassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _userService.userService.updatePassword(req);
        case 3:
          user = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(user);
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function updatePassword(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateProfile = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _userService.userService.updateProfile(req);
        case 3:
          user = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(user);
          _context3.next = 10;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function updateProfile(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

// /user/info
var getInfo = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var signInUser;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _userService.userService.getInfo(req.user._id);
        case 3:
          signInUser = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(signInUser);
          _context4.next = 10;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          next(_context4.t0);
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function getInfo(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
var checkEmail = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _userService.userService.checkEmail(req);
        case 3:
          result = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(result);
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function checkEmail(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var sendEmail = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _userService.userService.sendEmail(req);
        case 3:
          res.status(_httpStatusCodes.StatusCodes.CREATED).json('Send successfully');
          _context6.next = 9;
          break;
        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          next(_context6.t0);
        case 9:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 6]]);
  }));
  return function sendEmail(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();
var forgotPassword = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _userService.userService.forgotPassword(req);
        case 3:
          result = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(result);
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          next(_context7.t0);
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function forgotPassword(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();
var userController = {
  deleteUser: deleteUser,
  updatePassword: updatePassword,
  updateProfile: updateProfile,
  getInfo: getInfo,
  sendEmail: sendEmail,
  checkEmail: checkEmail,
  forgotPassword: forgotPassword
};
exports.userController = userController;