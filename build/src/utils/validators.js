"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OBJECT_ID_RULE_MESSAGE = exports.OBJECT_ID_RULE = exports.LIMIT_COMMON_FILE_SIZE = exports.ALLOW_COMMON_FILE_TYPES = void 0;
var OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
exports.OBJECT_ID_RULE = OBJECT_ID_RULE;
var OBJECT_ID_RULE_MESSAGE = 'Chuỗi của bạn không khớp với mẫu Id đối tượng!';
exports.OBJECT_ID_RULE_MESSAGE = OBJECT_ID_RULE_MESSAGE;
var ALLOW_COMMON_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
exports.ALLOW_COMMON_FILE_TYPES = ALLOW_COMMON_FILE_TYPES;
var LIMIT_COMMON_FILE_SIZE = 10 * 1024 * 1024; // 10MB;
exports.LIMIT_COMMON_FILE_SIZE = LIMIT_COMMON_FILE_SIZE;