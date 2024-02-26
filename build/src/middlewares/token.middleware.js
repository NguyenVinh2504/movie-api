"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _environment = require("../config/environment");
var _jwt = require("../helpers/jwt.helper");
var _authModel = require("../models/authModel");
var _userModel = require("../models/userModel");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var tokenDecode = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token) {
    var decoded;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          decoded = _jwt.jwtHelper.verifyToken(token, _environment.env.ACCESS_TOKEN_SECRET);
          return _context.abrupt("return", decoded);
        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", false);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 5]]);
  }));
  return function tokenDecode(_x) {
    return _ref.apply(this, arguments);
  };
}();
var auth = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$headers$authoriz, access_token, tokenDecoded, getAccessToken, user, _id, admin;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          access_token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', '');
          if (!access_token) {
            _context2.next = 23;
            break;
          }
          _context2.next = 5;
          return tokenDecode(access_token);
        case 5:
          tokenDecoded = _context2.sent;
          if (tokenDecoded) {
            _context2.next = 8;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập');
        case 8:
          _context2.next = 10;
          return _authModel.authModel.getAccessToken(access_token);
        case 10:
          getAccessToken = _context2.sent;
          if (getAccessToken) {
            _context2.next = 13;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy token');
        case 13:
          _context2.next = 15;
          return _userModel.userModel.getInfo(tokenDecoded._id);
        case 15:
          user = _context2.sent;
          if (user) {
            _context2.next = 18;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không tìm thấy user');
        case 18:
          _id = tokenDecoded._id, admin = tokenDecoded.admin;
          req.user = {
            _id: _id,
            admin: admin
          };
          next();
          _context2.next = 24;
          break;
        case 23:
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Token Không Được Gửi');
        case 24:
          _context2.next = 29;
          break;
        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 26]]);
  }));
  return function auth(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var _default = {
  auth: auth,
  tokenDecode: tokenDecode
};
exports["default"] = _default;