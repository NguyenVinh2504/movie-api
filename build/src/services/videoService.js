"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _require = require('http-status-codes'),
  StatusCodes = _require.StatusCodes;
var _require2 = require("../models/movieVideoModel"),
  movieVideoModel = _require2.movieVideoModel;
var _require3 = require("../utils/ApiError"),
  ApiError = _require3["default"];
var getMovieVideo = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var mediaId, movieVideo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          mediaId = _ref.mediaId;
          _context.prev = 1;
          _context.next = 4;
          return movieVideoModel.getMovieVideoInfo({
            mediaId: mediaId
          });
        case 4:
          movieVideo = _context.sent;
          if (movieVideo) {
            _context.next = 7;
            break;
          }
          throw new ApiError(StatusCodes.NOT_FOUND, 'Movie video not found');
        case 7:
          return _context.abrupt("return", movieVideo);
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          throw _context.t0;
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 10]]);
  }));
  return function getMovieVideo(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var videoService = {
  getMovieVideo: getMovieVideo
};
exports.videoService = videoService;