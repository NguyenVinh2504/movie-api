"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _require = require('http-status-codes'),
  StatusCodes = _require.StatusCodes;
var _require2 = require("../services/videoService"),
  videoService = _require2.videoService;
var getMovieVideo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var mediaId, mediaVideo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          mediaId = req.params.mediaId;
          _context.next = 4;
          return videoService.getMovieVideo({
            mediaId: mediaId
          });
        case 4:
          mediaVideo = _context.sent;
          res.status(StatusCodes.CREATED).json(mediaVideo);
          _context.next = 11;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function getMovieVideo(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getTvVideo = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$params, mediaId, episodeId, seasonNumber, episodeNumber, mediaVideo;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$params = req.params, mediaId = _req$params.mediaId, episodeId = _req$params.episodeId, seasonNumber = _req$params.seasonNumber, episodeNumber = _req$params.episodeNumber;
          _context2.next = 4;
          return videoService.getTvVideo({
            mediaId: mediaId,
            episodeId: episodeId,
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber
          });
        case 4:
          mediaVideo = _context2.sent;
          res.status(StatusCodes.CREATED).json(mediaVideo);
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
  return function getTvVideo(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var videoController = {
  getMovieVideo: getMovieVideo,
  getTvVideo: getTvVideo
};
exports.videoController = videoController;