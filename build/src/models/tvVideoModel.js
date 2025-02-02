"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tvVideoModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("../config/mongodb");
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
var TV_VIDEO_COLLECTION_NAME = 'tvVideo';
var TV_VIDEO_COLLECTION_SCHEMA = _joi["default"].object({
  // name: Joi.string().optional(),
  // status: Joi.string().valid('pending', 'processing', 'success', 'failed').required(),
  // message: Joi.string().optional().default(''),
  // updated_at: Joi.date()
  //   .optional()
  //   .default(() => new Date())
});
var getTvVideoInfo = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var mediaId, episodeId, seasonNumber, episodeNumber, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          mediaId = _ref.mediaId, episodeId = _ref.episodeId, seasonNumber = _ref.seasonNumber, episodeNumber = _ref.episodeNumber;
          console.log({
            mediaId: mediaId,
            episodeId: episodeId,
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber
          });
          _context.next = 4;
          return (0, _mongodb.GET_DB)().collection(TV_VIDEO_COLLECTION_NAME).findOne({
            mediaId: mediaId,
            episodeId: episodeId,
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber
          });
        case 4:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getTvVideoInfo(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var tvVideoModel = {
  TV_VIDEO_COLLECTION_NAME: TV_VIDEO_COLLECTION_NAME,
  TV_VIDEO_COLLECTION_SCHEMA: TV_VIDEO_COLLECTION_SCHEMA,
  getTvVideoInfo: getTvVideoInfo
};
exports.tvVideoModel = tvVideoModel;