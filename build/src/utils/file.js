"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFolder = exports.handleUploadImage = exports.getNameFromFullName = void 0;
var _formidable = _interopRequireDefault(require("formidable"));
var _fs = _interopRequireDefault(require("fs"));
var _ApiError = _interopRequireDefault(require("./ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _constants = require("./constants");
var initFolder = function initFolder() {
  if (!_fs["default"].existsSync(_constants.UPLOAD_TEMP_DIR)) {
    _fs["default"].mkdirSync(_constants.UPLOAD_TEMP_DIR, {
      recursive: true // Tạo folder lồng nhau
    });
  }
};
exports.initFolder = initFolder;
var handleUploadImage = function handleUploadImage(req) {
  var form = (0, _formidable["default"])({
    uploadDir: _constants.UPLOAD_TEMP_DIR,
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
var getNameFromFullName = function getNameFromFullName(fullName) {
  var name = fullName.split('.');
  name.pop();
  return name.join('');
};
exports.getNameFromFullName = getNameFromFullName;