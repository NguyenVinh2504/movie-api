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
var _userModel = require("../models/userModel");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var tokenDecode = function tokenDecode(req) {
  try {
    var bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      var token = bearerHeader.split(' ')[1];
      return _jwt.jwtHelper.verifyToken(token, _environment.env.ACCESS_TOKEN_SECRET);
    }
    return false;
  } catch (_unused) {
    return false;
  }
};
var auth = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var tokenDecoded, user, _id, admin;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          tokenDecoded = tokenDecode(req);
          if (tokenDecoded) {
            _context.next = 4;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập');
        case 4:
          _context.next = 6;
          return _userModel.userModel.getInfo(tokenDecoded._id);
        case 6:
          user = _context.sent;
          if (user) {
            _context.next = 9;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không tìm thấy user');
        case 9:
          _id = tokenDecoded._id, admin = tokenDecoded.admin;
          req.user = {
            _id: _id,
            admin: admin
          };
          next();
          _context.next = 17;
          break;
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 14]]);
  }));
  return function auth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var _default = {
  auth: auth,
  tokenDecode: tokenDecode
};
exports["default"] = _default;