"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _nodeCrypto = _interopRequireDefault(require("node:crypto"));
/* eslint-disable indent */

var generateKey = function generateKey() {
  var privateKey = _nodeCrypto["default"].randomBytes(64).toString('hex');
  var publicKey = _nodeCrypto["default"].randomBytes(64).toString('hex');
  return {
    privateKey: privateKey,
    publicKey: publicKey
  };
};
var _default = generateKey;
exports["default"] = _default;