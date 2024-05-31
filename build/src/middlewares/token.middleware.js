"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _jwt = require("../helpers/jwt.helper");
var _authModel = require("../models/authModel");
var _userModel = require("../models/userModel");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _findKeyTokenById = _interopRequireDefault(require("../utils/findKeyTokenById"));
var tokenDecode = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token) {
    var keyStore, decoded;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _findKeyTokenById["default"])(token);
        case 2:
          keyStore = _context.sent;
          _context.prev = 3;
          decoded = _jwt.jwtHelper.verifyToken(token, keyStore.publicKey);
          return _context.abrupt("return", decoded);
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](3);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, {
            name: 'EXPIRED_TOKEN',
            message: 'Token hết hạn'
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 8]]);
  }));
  return function tokenDecode(_x) {
    return _ref.apply(this, arguments);
  };
}();
var refreshTokenDecode = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token) {
    var keyStore, decoded;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _findKeyTokenById["default"])(token);
        case 2:
          keyStore = _context2.sent;
          _context2.prev = 3;
          decoded = _jwt.jwtHelper.verifyToken(token, keyStore.privateKey);
          return _context2.abrupt("return", decoded);
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](3);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập');
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 8]]);
  }));
  return function refreshTokenDecode(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var auth = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$headers$authoriz, access_token, tokenDecoded, getAccessToken, user, _id, admin;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          access_token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', '');
          if (!access_token) {
            _context3.next = 21;
            break;
          }
          _context3.next = 5;
          return tokenDecode(access_token);
        case 5:
          tokenDecoded = _context3.sent;
          _context3.next = 8;
          return _authModel.authModel.getAccessToken(access_token);
        case 8:
          getAccessToken = _context3.sent;
          if (getAccessToken) {
            _context3.next = 11;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy token');
        case 11:
          _context3.next = 13;
          return _userModel.userModel.getInfo(tokenDecoded._id);
        case 13:
          user = _context3.sent;
          if (user) {
            _context3.next = 16;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy user');
        case 16:
          _id = tokenDecoded._id, admin = tokenDecoded.admin;
          req.user = {
            _id: _id,
            admin: admin
          };
          next();
          _context3.next = 22;
          break;
        case 21:
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Token không được gửi');
        case 22:
          _context3.next = 27;
          break;
        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);
        case 27:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 24]]);
  }));
  return function auth(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var _default = {
  auth: auth,
  tokenDecode: tokenDecode,
  refreshTokenDecode: refreshTokenDecode
};
exports["default"] = _default;