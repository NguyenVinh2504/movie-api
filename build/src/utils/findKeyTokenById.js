"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _authModel = require("../models/authModel");
var _ApiError = _interopRequireDefault(require("./ApiError"));
/* eslint-disable indent */

var findKeyTokenById = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token) {
    var payLoadToken, keyStore;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          payLoadToken = _jsonwebtoken["default"].decode(token);
          _context.next = 3;
          return _authModel.authModel.getKeyToken(payLoadToken._id);
        case 3:
          keyStore = _context.sent;
          if (keyStore) {
            _context.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, {
            name: 'NOT_FOUND',
            message: 'Không tìm thấy keyStore'
          });
        case 6:
          return _context.abrupt("return", keyStore);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function findKeyTokenById(_x) {
    return _ref.apply(this, arguments);
  };
}();
var _default = findKeyTokenById;
exports["default"] = _default;