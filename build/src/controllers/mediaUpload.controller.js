"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaUploadController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
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
var serveM3u8 = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var id, fileRef, stream;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          fileRef = (0, _storage.ref)(_firebase.storage, "video-hls/".concat(id, "/master.m3u8")); // Kiểm tra file có tồn tại không trước khi get stream
          // const [exists] = await getMetadata(fileRef)
          //   .then(() => [true])
          //   .catch(() => [false])
          // if (!exists) {
          //   return res.status(404).send('File not found')
          // }
          _context5.next = 5;
          return (0, _storage.getStream)(fileRef);
        case 5:
          stream = _context5.sent;
          // Xử lý lỗi stream
          stream.on('error', function (error) {
            res.status(500).send('Error streaming file');
          });
          res.setHeader('Content-Type', 'application/vnd.apple.mpegurl'); // Content type cho .m3u8
          res.setHeader('Content-Disposition', "attachment; filename=".concat(id, "-master.m3u8"));
          stream.pipe(res);

          // const filePath = path.resolve(UPLOAD_VIDEO_DIR, 'test.m3u8')
          // res.sendFile(filePath)
          _context5.next = 15;
          break;
        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          if (!res.headersSent) {
            if (_context5.t0.code === 'storage/object-not-found') {
              res.status(404).send('File not found');
            } else {
              res.status(500).send('Error downloading file');
            }
          }
        case 15:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 12]]);
  }));
  return function serveM3u8(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var serveSegment = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$params, id, v, segment, fileRef, _yield$getMetadata$th, _yield$getMetadata$th2, exists, stream;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$params = req.params, id = _req$params.id, v = _req$params.v, segment = _req$params.segment;
          fileRef = (0, _storage.ref)(_firebase.storage, "video-hls/".concat(id, "/").concat(v, "/").concat(segment)); // Kiểm tra file tồn tại
          _context6.next = 5;
          return (0, _storage.getMetadata)(fileRef).then(function () {
            return [true];
          })["catch"](function () {
            return [false];
          });
        case 5:
          _yield$getMetadata$th = _context6.sent;
          _yield$getMetadata$th2 = (0, _slicedToArray2["default"])(_yield$getMetadata$th, 1);
          exists = _yield$getMetadata$th2[0];
          if (exists) {
            _context6.next = 10;
            break;
          }
          return _context6.abrupt("return", res.status(404).send('Segment not found'));
        case 10:
          _context6.next = 12;
          return (0, _storage.getStream)(fileRef);
        case 12:
          stream = _context6.sent;
          // Set content type phù hợp cho segment file (.ts)
          res.setHeader('Content-Type', 'video/MP2T');

          // Xử lý lỗi stream
          stream.on('error', function (error) {
            if (!res.headersSent) {
              res.status(500).send('Error streaming segment');
            }
          });

          // Stream trực tiếp không cần attachment
          stream.pipe(res);
          _context6.next = 21;
          break;
        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          if (!res.headersSent) {
            if (_context6.t0.code === 'storage/object-not-found') {
              res.status(404).send('Segment not found');
            } else {
              res.status(500).send('Error streaming segment');
            }
          }
        case 21:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 18]]);
  }));
  return function serveSegment(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var serveVideoStream = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var name, range, filePath, videoSize, CHUNK_SIZE, start, end, contentLength, contentType, headers, videoStream;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          name = req.params.name;
          range = req.headers.range;
          if (range) {
            _context7.next = 4;
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
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function serveVideoStream(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var videoStatus = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var id, result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          _context8.next = 3;
          return _mediaUpload.mediaUploadService.getVideoStatus(id);
        case 3:
          result = _context8.sent;
          return _context8.abrupt("return", res.status(_httpStatusCodes.StatusCodes.OK).json({
            message: 'Get video status successfully',
            result: result
          }));
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function videoStatus(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
var serveSubtitle = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var _req$params2, id, name, fileRef, _yield$getMetadata$th3, _yield$getMetadata$th4, exists, stream, contentType;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$params2 = req.params, id = _req$params2.id, name = _req$params2.name;
          fileRef = (0, _storage.ref)(_firebase.storage, "/video-hls/".concat(id, "/subtitle/").concat(name)); // Kiểm tra sự tồn tại của file
          _context9.next = 5;
          return (0, _storage.getMetadata)(fileRef).then(function () {
            return [true];
          })["catch"](function () {
            return [false];
          });
        case 5:
          _yield$getMetadata$th3 = _context9.sent;
          _yield$getMetadata$th4 = (0, _slicedToArray2["default"])(_yield$getMetadata$th3, 1);
          exists = _yield$getMetadata$th4[0];
          if (exists) {
            _context9.next = 10;
            break;
          }
          return _context9.abrupt("return", res.status(404).send('File not found'));
        case 10:
          _context9.next = 12;
          return (0, _storage.getStream)(fileRef);
        case 12:
          stream = _context9.sent;
          // Xác định Content-Type phù hợp
          contentType = getContentType(name); // Thêm hàm xử lý định dạng file
          // Thiết lập headers QUAN TRỌNG
          res.setHeader('Content-Type', "".concat(contentType, "; charset=utf-8"));
          res.setHeader('Content-Disposition', "inline; filename=\"".concat(name, "\"")); // Sử dụng "inline" thay vì "attachment"
          res.setHeader('Cache-Control', 'public, max-age=3600'); // Tùy chọn cache

          // Xử lý lỗi stream
          stream.on('error', function (error) {
            if (!res.headersSent) {
              res.status(500).send('Error streaming file');
            }
          });
          stream.pipe(res);
          _context9.next = 24;
          break;
        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](0);
          if (!res.headersSent) {
            if (_context9.t0.code === 'storage/object-not-found') {
              res.status(404).send('File not found');
            } else {
              res.status(500).send('Internal Server Error');
            }
          }
        case 24:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 21]]);
  }));
  return function serveSubtitle(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

// Hỗ trợ xác định Content-Type
function getContentType(filename) {
  var ext = filename.split('.').pop().toLowerCase();
  var typeMap = {
    vtt: 'text/vtt',
    srt: 'text/plain',
    ass: 'text/x-ssa',
    dfxp: 'application/ttml+xml'
  };
  return typeMap[ext] || 'application/octet-stream';
}
var mediaUploadController = {
  uploadImage: uploadImage,
  serveM3u8: serveM3u8,
  serveSegment: serveSegment,
  uploadVideo: uploadVideo,
  uploadVideoHls: uploadVideoHls,
  serveImage: serveImage,
  serveVideoStream: serveVideoStream,
  videoStatus: videoStatus,
  serveSubtitle: serveSubtitle
};
exports.mediaUploadController = mediaUploadController;