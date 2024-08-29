"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeExpired = exports.WHITELIST_DOMAINS = exports.UPLOAD_VIDEO_TEMP_DIR = exports.UPLOAD_VIDEO_DIR = exports.UPLOAD_IMAGE_TEMP_DIR = exports.UPLOAD_IMAGE_DIR = exports.EncodingStatus = void 0;
var _path = _interopRequireDefault(require("path"));
var WHITELIST_DOMAINS = ['https://viejoy.vercel.app', 'http://localhost:3000', 'https://viejoy.site', 'https://www.viejoy.site'];
exports.WHITELIST_DOMAINS = WHITELIST_DOMAINS;
var UPLOAD_IMAGE_TEMP_DIR = _path["default"].resolve('uploads/images/temp');
exports.UPLOAD_IMAGE_TEMP_DIR = UPLOAD_IMAGE_TEMP_DIR;
var UPLOAD_IMAGE_DIR = _path["default"].resolve('uploads/images');
exports.UPLOAD_IMAGE_DIR = UPLOAD_IMAGE_DIR;
var UPLOAD_VIDEO_TEMP_DIR = _path["default"].resolve('uploads/videos/temp');
exports.UPLOAD_VIDEO_TEMP_DIR = UPLOAD_VIDEO_TEMP_DIR;
var UPLOAD_VIDEO_DIR = _path["default"].resolve('uploads/videos');
exports.UPLOAD_VIDEO_DIR = UPLOAD_VIDEO_DIR;
var timeExpired = '1h';
exports.timeExpired = timeExpired;
var EncodingStatus = {
  pending: 'pending',
  processing: 'processing',
  success: 'success',
  failed: 'failed'
};
exports.EncodingStatus = EncodingStatus;