"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaUploadService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));
var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));
var _sharp = _interopRequireDefault(require("sharp"));
var _constants = require("../utils/constants");
var _file = require("../utils/file");
var _environment = require("../config/environment");
var _video = require("../utils/video.js");
var _promises = _interopRequireDefault(require("fs/promises"));
var _mediaModel = require("../models/mediaModel");
var _storage = require("firebase/storage");
var _firebase = require("../config/firebase");
var _crypto = require("crypto");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } } /* eslint-disable no-console */
var _listItem = /*#__PURE__*/new WeakMap();
var _isEncoding = /*#__PURE__*/new WeakMap();
var Queue = /*#__PURE__*/function () {
  function Queue() {
    (0, _classCallCheck2["default"])(this, Queue);
    _classPrivateFieldInitSpec(this, _listItem, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _isEncoding, {
      writable: true,
      value: false
    });
  }
  (0, _createClass2["default"])(Queue, [{
    key: "enqueue",
    value: function () {
      var _enqueue = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(item) {
        var fileName, idName;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              (0, _classPrivateFieldGet2["default"])(this, _listItem).push(item);
              fileName = item.split('\\').pop();
              idName = (0, _file.getNameFromFullName)(fileName);
              _context.next = 5;
              return _mediaModel.mediaModel.createVideoStatus({
                name: idName,
                status: _constants.EncodingStatus.pending
              })["catch"](function (err) {
                return console.error('createVideoStatus error: ', err);
              });
            case 5:
              this.processEncode();
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function enqueue(_x) {
        return _enqueue.apply(this, arguments);
      }
      return enqueue;
    }()
  }, {
    key: "processEncode",
    value: function () {
      var _processEncode = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var videoPath, fileName, idName;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(0, _classPrivateFieldGet2["default"])(this, _isEncoding)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              if (!((0, _classPrivateFieldGet2["default"])(this, _listItem).length > 0)) {
                _context2.next = 30;
                break;
              }
              (0, _classPrivateFieldSet2["default"])(this, _isEncoding, true);
              videoPath = (0, _classPrivateFieldGet2["default"])(this, _listItem)[0];
              fileName = videoPath.split('\\').pop();
              idName = (0, _file.getNameFromFullName)(fileName);
              _context2.next = 9;
              return _mediaModel.mediaModel.updateVideoStatus({
                name: idName,
                status: _constants.EncodingStatus.processing
              });
            case 9:
              _context2.prev = 9;
              _context2.next = 12;
              return (0, _video.encodeHLSWithMultipleVideoStreams)(videoPath);
            case 12:
              _context2.next = 14;
              return _promises["default"].unlink(videoPath);
            case 14:
              _context2.next = 16;
              return _mediaModel.mediaModel.updateVideoStatus({
                name: idName,
                status: _constants.EncodingStatus.success
              });
            case 16:
              console.log('encode success');
              _context2.next = 25;
              break;
            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](9);
              console.error("encode error: ".concat(videoPath));
              _context2.next = 24;
              return _mediaModel.mediaModel.updateVideoStatus({
                name: idName,
                status: _constants.EncodingStatus.failed
              })["catch"](function (err) {
                return console.error('updateVideoStatus error: ', err);
              });
            case 24:
              console.error(_context2.t0);
            case 25:
              (0, _classPrivateFieldSet2["default"])(this, _isEncoding, false);
              (0, _classPrivateFieldGet2["default"])(this, _listItem).shift();
              this.processEncode();
              _context2.next = 31;
              break;
            case 30:
              console.log('queue is empty');
            case 31:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[9, 19]]);
      }));
      function processEncode() {
        return _processEncode.apply(this, arguments);
      }
      return processEncode;
    }()
  }]);
  return Queue;
}();
var queue = new Queue();
var uploadImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if ('files' in req) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'File is empty');
        case 2:
          _context4.next = 4;
          return Promise.all(
          // files.map(async (file) => {
          req.files.map( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(file) {
              var newFile, idName, imageRef, metadata, resultUpload, _resultUpload$metadat, name, contentType;
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _sharp["default"])(file.buffer).resize({
                      width: 400,
                      withoutEnlargement: true
                    }).toBuffer();
                  case 2:
                    newFile = _context3.sent;
                    // console.log('newFile', newFile)
                    // Upload lên firebase
                    idName = (0, _crypto.randomUUID)();
                    imageRef = (0, _storage.ref)(_firebase.storage, "images/".concat(idName));
                    metadata = {
                      contentType: file === null || file === void 0 ? void 0 : file.mimetype
                    };
                    _context3.next = 8;
                    return (0, _storage.uploadBytes)(imageRef, newFile, metadata);
                  case 8:
                    resultUpload = _context3.sent;
                    // Trả dữ liệu file sau khi update về cho người dùng
                    _resultUpload$metadat = resultUpload.metadata, name = _resultUpload$metadat.name, contentType = _resultUpload$metadat.contentType; // const newFile = await sharp(file.filepath).resize({ width: 400, withoutEnlargement: true }).toFile(newPath)
                    // console.log('newFile', resultUpload)
                    // try {
                    //   fs.unlinkSync(file.filepath)
                    // } catch (error) {
                    //   // console.log(error)
                    // }
                    return _context3.abrupt("return", {
                      name: name,
                      type: contentType,
                      url: _environment.env.BUILD_MODE === 'production' ? "".concat(_environment.env.PRODUCT_APP_HOST, "/files/image/").concat(name) : "http://localhost:".concat(_environment.env.LOCAL_DEV_APP_PORT, "/api/v1/files/image/").concat(name)
                    });
                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 4:
          result = _context4.sent;
          return _context4.abrupt("return", result);
        case 6:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function uploadImage(_x2) {
    return _ref.apply(this, arguments);
  };
}();
var uploadVideo = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req) {
    var file, idName, videoRef, metadata, resultUpload, _resultUpload$metadat2, name, contentType, fileRef, downloadURL;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          // const files = await handleUploadVideo(req)
          // const result = files.map((file) => {
          //   return {
          //     name: file?.newFilename,
          //     type: file?.mimetype,
          //     url:
          //       env.BUILD_MODE === 'production'
          //         ? `${env.PRODUCT_APP_HOST}/files/video/${file?.newFilename}`
          //         : `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/video/${file?.newFilename}`
          //   }
          // })
          file = req.file; // Upload lên firebase
          idName = (0, _crypto.randomUUID)();
          videoRef = (0, _storage.ref)(_firebase.storage, "video/".concat(idName));
          metadata = {
            contentType: file === null || file === void 0 ? void 0 : file.mimetype
          };
          _context5.next = 6;
          return (0, _storage.uploadBytes)(videoRef, file.buffer, metadata);
        case 6:
          resultUpload = _context5.sent;
          // Trả dữ liệu file sau khi update về cho người dùng
          _resultUpload$metadat2 = resultUpload.metadata, name = _resultUpload$metadat2.name, contentType = _resultUpload$metadat2.contentType;
          fileRef = (0, _storage.ref)(_firebase.storage, "video/".concat(name));
          _context5.next = 11;
          return (0, _storage.getDownloadURL)(fileRef);
        case 11:
          downloadURL = _context5.sent;
          return _context5.abrupt("return", {
            name: name,
            type: contentType,
            url: downloadURL
          });
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function uploadVideo(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var uploadVideoHls = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req) {
    var files, result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _file.handleUploadVideo)(req);
        case 2:
          files = _context7.sent;
          _context7.next = 5;
          return Promise.all(files.map( /*#__PURE__*/function () {
            var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(file) {
              var newName;
              return _regenerator["default"].wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    // console.log('file.filepath', file)
                    newName = (0, _file.getNameFromFullName)(file === null || file === void 0 ? void 0 : file.newFilename);
                    queue.enqueue(file.filepath);
                    return _context6.abrupt("return", {
                      name: file === null || file === void 0 ? void 0 : file.newName,
                      type: 'video/m3u8',
                      url: _environment.env.BUILD_MODE === 'production' ? "".concat(_environment.env.PRODUCT_APP_HOST, "/files/video-hls/").concat(newName, ".m3u8") : "http://localhost:".concat(_environment.env.LOCAL_DEV_APP_PORT, "/api/v1/files/video-hls/").concat(newName, ".m3u8")
                    });
                  case 3:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            }));
            return function (_x6) {
              return _ref5.apply(this, arguments);
            };
          }()));
        case 5:
          result = _context7.sent;
          return _context7.abrupt("return", result);
        case 7:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function uploadVideoHls(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var getVideoStatus = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(idName) {
    var videoStatus;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _mediaModel.mediaModel.getVideoStatus(idName);
        case 2:
          videoStatus = _context8.sent;
          return _context8.abrupt("return", videoStatus);
        case 4:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function getVideoStatus(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
var mediaUploadService = {
  uploadImage: uploadImage,
  uploadVideo: uploadVideo,
  uploadVideoHls: uploadVideoHls,
  getVideoStatus: getVideoStatus
};
exports.mediaUploadService = mediaUploadService;