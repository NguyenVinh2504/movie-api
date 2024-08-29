"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFolder = exports.handleUploadVideo = exports.handleUploadImage = exports.getNameFromFullName = void 0;
var _formidable = _interopRequireDefault(require("formidable"));
var _fs = _interopRequireDefault(require("fs"));
var _ApiError = _interopRequireDefault(require("./ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _constants = require("./constants");
var _crypto = require("crypto");
var _path = _interopRequireDefault(require("path"));
var initFolder = function initFolder() {
  try {
    ;
    [_constants.UPLOAD_IMAGE_TEMP_DIR, _constants.UPLOAD_VIDEO_TEMP_DIR].forEach(function (dir) {
      if (!_fs["default"].existsSync(dir)) {
        _fs["default"].mkdirSync(dir, {
          recursive: true // Tạo folder lồng nhau
        });
      }
    });
  } catch (_unused) {
    // console.log(error)
  }
};
exports.initFolder = initFolder;
var handleUploadImage = function handleUploadImage(req) {
  var form = (0, _formidable["default"])({
    uploadDir: null,
    // maxFiles: 4,
    keepExtensions: true,
    // maxFileSize: 1 * 1024 * 1024, // 1MB,
    filter: function filter(_ref) {
      var name = _ref.name,
        mimetype = _ref.mimetype;
      var valid = name === 'image' && Boolean(mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('image/'));
      if (!valid) {
        form.emit('error', new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Invalid file type'));
      }
      return valid;
    }
  });
  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      // console.log('fields', fields)
      // console.log('files', files)

      if (err) {
        return reject(err);
      }
      if (Object.keys(files).length === 0) {
        return reject(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'File is empty'));
      }
      return resolve(files.image);
    });
  });
};
exports.handleUploadImage = handleUploadImage;
var handleUploadVideo = function handleUploadVideo(req) {
  var idName = (0, _crypto.randomUUID)();
  _fs["default"].mkdirSync(_path["default"].resolve(_constants.UPLOAD_VIDEO_DIR, idName));
  var form = (0, _formidable["default"])({
    uploadDir: _path["default"].resolve(_constants.UPLOAD_VIDEO_DIR, idName),
    maxFiles: 1,
    keepExtensions: true,
    // maxFileSize: 1 * 1024 * 1024, // 1MB,

    // Filter file type nếu trả về true thì pass
    filter: function filter(_ref2) {
      var name = _ref2.name,
        mimetype = _ref2.mimetype;
      var valid = name === 'video' && Boolean((mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('mp4')) || (mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('quicktime')));
      if (!valid) {
        form.emit('error', new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Invalid file type'));
      }
      return valid;
    },
    // eslint-disable-next-line no-unused-vars
    filename: function filename(name, ext, part, form) {
      return "".concat(idName).concat(ext);
    }
  });
  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      // console.log('fields', fields)
      // console.log('files', files)

      if (err) {
        return reject(err);
      }
      if (Object.keys(files).length === 0) {
        return reject(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'File is empty'));
      }
      return resolve(files.video);
    });
  });
};
exports.handleUploadVideo = handleUploadVideo;
var getNameFromFullName = function getNameFromFullName(fullName) {
  var name = fullName.split('.');
  name.pop();
  return name.join('');
};
exports.getNameFromFullName = getNameFromFullName;