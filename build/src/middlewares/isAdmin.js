"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = void 0;
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var isAdmin = function isAdmin(req, res, next) {
  if (req.user && req.user.admin === true) {
    next();
  } else {
    next(new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Yêu cầu quyền admin'));
  }
};
exports.isAdmin = isAdmin;