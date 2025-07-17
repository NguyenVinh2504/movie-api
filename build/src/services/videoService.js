"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _videoMeidaModel = require("../models/videoMeidaModel");
var _require = require('http-status-codes'),
  StatusCodes = _require.StatusCodes;
var _require2 = require("../utils/ApiError"),
  ApiError = _require2["default"];
var getMovieVideo = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var tmdbId, movieVideo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          tmdbId = _ref.tmdbId;
          _context.next = 3;
          return _videoMeidaModel.videoMediaModel.getMovieByTmdbIdForUser({
            tmdbId: tmdbId
          });
        case 3:
          movieVideo = _context.sent;
          if (movieVideo) {
            _context.next = 6;
            break;
          }
          throw new ApiError(StatusCodes.NOT_FOUND, 'Movie video not found');
        case 6:
          return _context.abrupt("return", movieVideo);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getMovieVideo(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var getTvVideo = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var tmdbId, episodeId, seasonNumber, episodeNumber, episodeVideo;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          tmdbId = _ref3.tmdbId, episodeId = _ref3.episodeId, seasonNumber = _ref3.seasonNumber, episodeNumber = _ref3.episodeNumber;
          _context2.next = 3;
          return _videoMeidaModel.videoMediaModel.getEpisodeForUser({
            tmdbId: tmdbId,
            episodeId: episodeId,
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber
          });
        case 3:
          episodeVideo = _context2.sent;
          return _context2.abrupt("return", episodeVideo);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getTvVideo(_x2) {
    return _ref4.apply(this, arguments);
  };
}();
var videoService = {
  getMovieVideo: getMovieVideo,
  getTvVideo: getTvVideo
};
exports.videoService = videoService;