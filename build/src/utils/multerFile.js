"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoUploadMulter = exports.uploadMulter = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _ApiError = _interopRequireDefault(require("./ApiError"));
var _httpStatusCodes = require("http-status-codes");
var uploadMulter = (0, _multer["default"])({
  storage: _multer["default"].memoryStorage(),
  fileFilter: function fileFilter(req, file, cb) {
    if (!file.mimetype.includes('image/')) {
      // upload only mp4 and mkv format
      return cb(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Please upload a Image'), false);
    }
    cb(undefined, true);
  }
});
exports.uploadMulter = uploadMulter;
var videoUploadMulter = (0, _multer["default"])({
  storage: _multer["default"].memoryStorage(),
  limits: {
    // fileSize: 10000000, // 10000000 Bytes = 10 MB,
    files: 1
  },
  fileFilter: function fileFilter(req, file, cb) {
    if (!(file.mimetype === 'video/mp4' || file.mimetype === 'video/quicktime')) {
      // upload only mp4 and mkv format
      return cb(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Please upload a Video MP4 or Quicktime'), false);
    }
    cb(undefined, true);
  }
});
exports.videoUploadMulter = videoUploadMulter;