"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaUploadController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _path = _interopRequireDefault(require("path"));
var _mediaUpload = require("../services/mediaUpload.service");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _constants = require("../utils/constants");
var _fs = _interopRequireDefault(require("fs"));
var _mime = _interopRequireDefault(require("mime"));
var _storage = require("firebase/storage");
var _firebase = require("../config/firebase");
var uploadImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _mediaUpload.mediaUploadService.uploadImage(req);
        case 2:
          result = _context.sent;
          return _context.abrupt("return", res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            message: 'Upload image successfully',
            result: result
          }));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function uploadImage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var uploadVideo = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _mediaUpload.mediaUploadService.uploadVideo(req);
        case 2:
          result = _context2.sent;
          return _context2.abrupt("return", res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            message: 'Upload video successfully',
            result: result
          }));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function uploadVideo(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var uploadVideoHls = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _mediaUpload.mediaUploadService.uploadVideoHls(req);
        case 2:
          result = _context3.sent;
          return _context3.abrupt("return", res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            message: 'Upload video successfully',
            result: result
          }));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function uploadVideoHls(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var serveImage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var name, file;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          name = req.params.name; // const filePath = path.resolve(UPLOAD_IMAGE_DIR, name)
          file = (0, _storage.ref)(_firebase.storage, "images/".concat(name));
          (0, _storage.getStream)(file).pipe(res);
          // response.data.pipe(res)
          // res.sendFile(file, (err) => {
          //   if (err) {
          //     next(err)
          //   }
          // })
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function serveImage(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var serveM3u8 = function serveM3u8(req, res) {
  var id = req.params.id;
  var filePath = _path["default"].resolve(_constants.UPLOAD_VIDEO_DIR, id, 'master.m3u8');
  res.sendFile(filePath, function (err) {
    if (err) {
      res.status(_httpStatusCodes.StatusCodes.NOT_FOUND).json({
        message: 'Not found',
        err: err.message
      });
    }
  });
};
var serveSegment = function serveSegment(req, res) {
  var _req$params = req.params,
    id = _req$params.id,
    v = _req$params.v,
    segment = _req$params.segment;
  var filePath = _path["default"].resolve(_constants.UPLOAD_VIDEO_DIR, id, v, segment);
  res.sendFile(filePath, function (err) {
    if (err) {
      res.status(_httpStatusCodes.StatusCodes.NOT_FOUND).json({
        message: 'Not found',
        err: err.message
      });
    }
  });
};
var serveVideoStream = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var name, range, filePath, videoSize, CHUNK_SIZE, start, end, contentLength, contentType, headers, videoStream;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          name = req.params.name;
          range = req.headers.range;
          if (range) {
            _context5.next = 4;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Missing Range header');
        case 4:
          filePath = _path["default"].resolve(_constants.UPLOAD_VIDEO_DIR, name.split('.')[0], name); // 1MB = 10^6 bytes (Tính theo hệ thập phân, đây là giá trị thấy trên UI )
          // 1 MB = 2^20 bytes tính theo hệ thập phân (1024 * 1024)
          //Lấy dung lượng video (Bytes)
          videoSize = _fs["default"].statSync(filePath).size; // Dung lượng video cho mỗi phân đoạn stream
          CHUNK_SIZE = Math.pow(10, 6); // 1MB
          // Lấy giá trị byte bắt đầu từ header Range (vd: bytes=1048575-)
          start = Number(range.replace(/\D/g, ''));
          end = Math.min(start + CHUNK_SIZE, videoSize - 1); // Dung lượng thực tế cho một phân đoạn stream
          // Thường đây là chunks, ngoại trừ đoạn cuối cùng
          contentLength = end - start + 1;
          contentType = _mime["default"].getType(filePath) || 'video/*';
          headers = {
            'Content-Range': "bytes ".concat(start, "-").concat(end, "/").concat(videoSize),
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': contentType
          };
          res.writeHead(_httpStatusCodes.StatusCodes.PARTIAL_CONTENT, headers);
          videoStream = _fs["default"].createReadStream(filePath, {
            start: start,
            end: end
          });
          videoStream.pipe(res);
        case 15:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function serveVideoStream(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var videoStatus = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var id, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.next = 3;
          return _mediaUpload.mediaUploadService.getVideoStatus(id);
        case 3:
          result = _context6.sent;
          return _context6.abrupt("return", res.status(_httpStatusCodes.StatusCodes.OK).json({
            message: 'Get video status successfully',
            result: result
          }));
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function videoStatus(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var mediaUploadController = {
  uploadImage: uploadImage,
  serveM3u8: serveM3u8,
  serveSegment: serveSegment,
  uploadVideo: uploadVideo,
  uploadVideoHls: uploadVideoHls,
  serveImage: serveImage,
  serveVideoStream: serveVideoStream,
  videoStatus: videoStatus
};
exports.mediaUploadController = mediaUploadController;