"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _environment = require("../config/environment");
var _authService = require("../services/authService");
/* eslint-disable no-console */

//register
// /user/signup
var signUp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _authService.authService.signUp(req, res);
        case 3:
          user = _context.sent;
          // Có kết quả thì trả về Client
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(
          //dữ liệu từ service
          user);
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(_context.t0);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function signUp(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// const loginGoogle = async (req, res, next) => {
//   try {

//     //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
//     const user = await authService.loginGoogle(req, res)

//     // Có kết quả thì trả về Client
//     res.status(StatusCodes.CREATED).json(
//       //dữ liệu từ service
//       user
//     )
//   } catch (error) {
//     // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
//     next(error)
//   }
// }

var loginGoogle = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var code, user, urlRedirect;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log(req.query);

          //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
          if (!req.query.error) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.redirect("".concat(_environment.env.CLIENT_URL_REDIRECT, "?error=").concat(req.query.error)));
        case 4:
          code = req.query.code;
          _context2.next = 7;
          return _authService.authService.loginGoogle(code, res);
        case 7:
          user = _context2.sent;
          console.log(user, code);
          urlRedirect = "".concat(_environment.env.CLIENT_URL_REDIRECT, "?accessToken=").concat(user.accessToken, "&refreshToken=").concat(user.refreshToken); // Có kết quả thì trả về Client
          res.redirect(urlRedirect);
          // res.status(StatusCodes.CREATED).json(
          //   //dữ liệu từ service
          //   user
          // )
          _context2.next = 16;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(_context2.t0);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return function loginGoogle(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

//login user
// /user/login
var login = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _authService.authService.login(req, res);
        case 3:
          user = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(user);
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
  return function login(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var refreshToken = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var newRefreshToken;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _authService.authService.refreshToken(req, res);
        case 3:
          newRefreshToken = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(newRefreshToken);
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
  return function refreshToken(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
var logout = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _authService.authService.logout(req, res);
        case 3:
          res.status(_httpStatusCodes.StatusCodes.CREATED).json('Logged out');
          _context5.next = 9;
          break;
        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);
        case 9:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 6]]);
  }));
  return function logout(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var authController = {
  signUp: signUp,
  loginGoogle: loginGoogle,
  login: login,
  refreshToken: refreshToken,
  logout: logout
};
exports.authController = authController;