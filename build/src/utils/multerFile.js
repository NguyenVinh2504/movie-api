"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadMulter = void 0;
var _multer = _interopRequireDefault(require("multer"));
var uploadMulter = (0, _multer["default"])({
  storage: _multer["default"].memoryStorage()
});
exports.uploadMulter = uploadMulter;