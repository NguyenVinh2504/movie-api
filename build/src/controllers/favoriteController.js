"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.favoriteController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _favoriteService = require("../services/favoriteService");
/* eslint-disable no-console */

var addFavorite = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var dataFavorite;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _favoriteService.favoriteService.addFavorite(req);
        case 3:
          dataFavorite = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(dataFavorite);
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
  return function addFavorite(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var removeFavorite = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var favoriteId, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          favoriteId = req.params.id;
          _context2.next = 4;
          return _favoriteService.favoriteService.removeFavorite({
            req: req,
            favoriteId: favoriteId
          });
        case 4:
          result = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            favorites: result
          });
          _context2.next = 11;
          break;
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return function removeFavorite(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var favoriteController = {
  addFavorite: addFavorite,
  removeFavorite: removeFavorite
};
exports.favoriteController = favoriteController;