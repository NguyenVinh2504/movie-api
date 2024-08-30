"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoMulterMiddleware = exports.imageMulterMiddleware = void 0;
var _httpStatusCodes = require("http-status-codes");
var _multer = _interopRequireDefault(require("multer"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _require = require("../utils/multerFile"),
  videoUploadMulter = _require.videoUploadMulter,
  uploadMulter = _require.uploadMulter;
var imageMulterMiddleware = function imageMulterMiddleware(req, res, next) {
  var arrayImage = uploadMulter.array('image');
  arrayImage(req, res, function (err) {
    if (err) {
      if (err instanceof _multer["default"].MulterError) {
        return next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, err.message));
      }
      return next(err);
    }
    // Kiểm tra nếu không có file nào được tải lên
    if (!req.files) {
      return next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Không có file nào được tải lên!'));
    }
    next();
  });
};
exports.imageMulterMiddleware = imageMulterMiddleware;
var videoMulterMiddleware = function videoMulterMiddleware(req, res, next) {
  var singleVideo = videoUploadMulter.single('video');
  singleVideo(req, res, function (err) {
    if (err) {
      if (err instanceof _multer["default"].MulterError) {
        return next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, err.message));
      }
      return next(err);
    }
    // Kiểm tra nếu không có file nào được tải lên
    if (!req.file) {
      return next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Không có file nào được tải lên!'));
    }
  });
};
exports.videoMulterMiddleware = videoMulterMiddleware;