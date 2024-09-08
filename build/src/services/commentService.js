"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _commentModel = require("../models/commentModel");
var addComment = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req) {
    var _req$body, movieId, movieType, content, userId, newComment;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, movieId = _req$body.movieId, movieType = _req$body.movieType, content = _req$body.content;
          userId = req.user._id;
          _context.next = 4;
          return _commentModel.commentModel.createComment({
            movieId: movieId,
            userId: userId,
            content: content,
            movieType: movieType
          });
        case 4:
          newComment = _context.sent;
          return _context.abrupt("return", newComment);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function addComment(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getCommentsByMovieId = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var movieId, movieType, limit, page, listComments, total;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          movieId = _ref2.movieId, movieType = _ref2.movieType, limit = _ref2.limit, page = _ref2.page;
          _context2.next = 3;
          return _commentModel.commentModel.getCommentsByMovieId({
            movieId: movieId,
            movieType: movieType,
            limit: limit,
            page: page
          });
        case 3:
          listComments = _context2.sent;
          _context2.next = 6;
          return _commentModel.commentModel.countDocument({
            movieId: movieId,
            movieType: movieType
          });
        case 6:
          total = _context2.sent;
          return _context2.abrupt("return", {
            listComments: listComments,
            total: total
          });
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getCommentsByMovieId(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var commentService = {
  addComment: addComment,
  getCommentsByMovieId: getCommentsByMovieId
};
exports.commentService = commentService;