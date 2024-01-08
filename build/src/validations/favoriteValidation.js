"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.favoriteValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _validators = require("../utils/validators");
var createFavorite = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          correctCondition = _joi["default"].object({
            media_type: _joi["default"].string().allow('').valid('tv', 'movie').required(),
            mediaId: _joi["default"].number().allow('').required(),
            title: _joi["default"].string().allow('').required(),
            poster_path: _joi["default"].string().allow('').required(),
            vote_average: _joi["default"].number().allow('').required(),
            release_date: _joi["default"].string().allow('').required()
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
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context.t0.message));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function createFavorite(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var deleteFavorite = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          correctCondition = _joi["default"].object({
            id: _joi["default"].string().required().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE)
          });
          _context2.prev = 1;
          _context2.next = 4;
          return correctCondition.validateAsync(req.params);
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context2.t0.message));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function deleteFavorite(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var favoriteValidation = {
  createFavorite: createFavorite,
  deleteFavorite: deleteFavorite
};
exports.favoriteValidation = favoriteValidation;