"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _userModel = require("../models/userModel");
var validationsPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var id, password, user, validations;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          id = data.id, password = data.password;
          _context.next = 3;
          return _userModel.userModel.getIdUser(id);
        case 3:
          user = _context.sent;
          _context.next = 6;
          return _bcrypt["default"].compare(password, user.password);
        case 6:
          validations = _context.sent;
          return _context.abrupt("return", validations);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function validationsPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();
var _default = validationsPassword;
exports["default"] = _default;