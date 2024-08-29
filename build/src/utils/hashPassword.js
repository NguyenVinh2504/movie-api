"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var hashPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(password) {
    var salt, hashed;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _bcrypt["default"].genSalt(10);
        case 2:
          salt = _context.sent;
          _context.next = 5;
          return _bcrypt["default"].hash(password, salt);
        case 5:
          hashed = _context.sent;
          return _context.abrupt("return", hashed);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function hashPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();
var _default = hashPassword;
exports["default"] = _default;