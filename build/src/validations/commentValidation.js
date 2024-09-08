"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
/* eslint-disable no-console */

var addComment = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          correctCondition = _joi["default"].object({
            movieId: _joi["default"].string().required(),
            movieType: _joi["default"].string().valid('movie', 'tv').required(),
            content: _joi["default"].string().min(1).max(400).required()
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
  return function addComment(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var paginationValidation = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var correctCondition, value;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          correctCondition = _joi["default"].object({
            page: _joi["default"].number().integer().min(1)["default"](1).messages({
              'number.base': '"page" phải là số',
              'number.min': '"page" phải lớn hơn hoặc bằng 1',
              'number.integer': '"page" phải là số nguyên'
            }),
            limit: _joi["default"].number().integer().min(1)["default"](10).messages({
              'number.base': '"limit" phải là số',
              'number.min': '"limit" phải lớn hơn hoặc bằng 1',
              'number.integer': '"limit" phải là số nguyên'
            })
          });
          _context2.prev = 1;
          _context2.next = 4;
          return correctCondition.validateAsync(req.query, {
            abortEarly: false
          });
        case 4:
          value = _context2.sent;
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          req.query = value;
          next();
          _context2.next = 12;
          break;
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context2.t0.message));
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 9]]);
  }));
  return function paginationValidation(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var commentValidation = {
  addComment: addComment,
  paginationValidation: paginationValidation
};
exports.commentValidation = commentValidation;