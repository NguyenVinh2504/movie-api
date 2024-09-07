"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _commentService = require("../services/commentService");
var addComment = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _commentService.commentService.addComment(req, res);
        case 2:
          data = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            message: 'Add comment successfully',
            data: data
          });
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function addComment(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getCommentsByMovieId = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _commentService.commentService.getCommentsByMovieId(req, res);
        case 2:
          data = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            message: 'Get comment successfully',
            data: data
          });
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getCommentsByMovieId(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var commentController = {
  addComment: addComment,
  getCommentsByMovieId: getCommentsByMovieId
};
exports.commentController = commentController;