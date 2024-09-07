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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, movieId, movieType, content, userId, newComment, listComments;
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
          _context.next = 7;
          return _commentModel.commentModel.getCommentsByMovieId({
            movieId: movieId,
            movieType: movieType
          });
        case 7:
          listComments = _context.sent;
          // Phát sự kiện qua socket đến tất cả client
          req.io.to(movieId).emit('newComment', listComments);
          return _context.abrupt("return", newComment);
        case 10:
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
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req) {
    var _req$params, movieId, movieType, listComments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$params = req.params, movieId = _req$params.movieId, movieType = _req$params.movieType;
          _context2.next = 3;
          return _commentModel.commentModel.getCommentsByMovieId({
            movieId: movieId,
            movieType: movieType
          });
        case 3:
          listComments = _context2.sent;
          return _context2.abrupt("return", listComments);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getCommentsByMovieId(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var commentService = {
  addComment: addComment,
  getCommentsByMovieId: getCommentsByMovieId
};
exports.commentService = commentService;