"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeExpired = exports.WHITELIST_DOMAINS = exports.UPLOAD_TEMP_DIR = exports.UPLOAD_DIR = void 0;
var _path = _interopRequireDefault(require("path"));
var WHITELIST_DOMAINS = ['https://viejoy.vercel.app', 'http://localhost:3000', 'https://viejoy.site', 'https://www.viejoy.site'];
exports.WHITELIST_DOMAINS = WHITELIST_DOMAINS;
var UPLOAD_TEMP_DIR = _path["default"].resolve('tmp/uploads/temp');
exports.UPLOAD_TEMP_DIR = UPLOAD_TEMP_DIR;
var UPLOAD_DIR = _path["default"].resolve('tmp/uploads');
exports.UPLOAD_DIR = UPLOAD_DIR;
var timeExpired = '1h';
exports.timeExpired = timeExpired;