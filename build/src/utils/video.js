"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeHLSWithMultipleVideoStreams = exports.checkVideoHasAudio = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _path = _interopRequireDefault(require("path"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var MAXIMUM_BITRATE_720P = 5 * Math.pow(10, 6); // 5Mbps
var MAXIMUM_BITRATE_1080P = 8 * Math.pow(10, 6); // 8Mbps
var MAXIMUM_BITRATE_1440P = 16 * Math.pow(10, 6); // 16Mbps

var checkVideoHasAudio = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(filePath) {
    var _yield$import, $, normalizedPath, _yield, stdout;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 2:
          _yield$import = _context.sent;
          $ = _yield$import.$;
          normalizedPath = filePath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          _context.next = 7;
          return $(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["ffprobe ", ""])), ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_type', '-of', 'default=nw=1:nk=1', normalizedPath]);
        case 7:
          _yield = _context.sent;
          stdout = _yield.stdout;
          return _context.abrupt("return", stdout.trim() === 'audio');
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function checkVideoHasAudio(_x) {
    return _ref.apply(this, arguments);
  };
}();
exports.checkVideoHasAudio = checkVideoHasAudio;
var getBitrate = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(filePath) {
    var _yield$import2, $, normalizedPath, _yield2, stdout;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 2:
          _yield$import2 = _context2.sent;
          $ = _yield$import2.$;
          normalizedPath = filePath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          _context2.next = 7;
          return $(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["ffprobe ", ""])), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=bit_rate', '-of', 'default=nw=1:nk=1', normalizedPath]);
        case 7:
          _yield2 = _context2.sent;
          stdout = _yield2.stdout;
          return _context2.abrupt("return", Number(stdout.trim()));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getBitrate(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getResolution = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(filePath) {
    var _yield$import3, $, normalizedPath, _yield3, stdout, resolution, _resolution, width, height;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 2:
          _yield$import3 = _context3.sent;
          $ = _yield$import3.$;
          normalizedPath = filePath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          _context3.next = 7;
          return $(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["ffprobe ", ""])), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', normalizedPath]);
        case 7:
          _yield3 = _context3.sent;
          stdout = _yield3.stdout;
          resolution = stdout.trim().split('x');
          _resolution = (0, _slicedToArray2["default"])(resolution, 2), width = _resolution[0], height = _resolution[1];
          return _context3.abrupt("return", {
            width: Number(width),
            height: Number(height)
          });
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getResolution(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var getWidth = function getWidth(height, resolution) {
  var width = Math.round(height * resolution.width / resolution.height);
  // Vì ffmpeg yêu cầu width và height phải là số chẵn
  return width % 2 === 0 ? width : width + 1;
};
var encodeMax720 = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref4) {
    var bitrate, inputPath, isHasAudio, outputPath, outputSegmentPath, resolution, _yield$import4, $, normalizedInputPath, normalizedOutputPath, normalizedOutputSegmentPath, args;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          bitrate = _ref4.bitrate, inputPath = _ref4.inputPath, isHasAudio = _ref4.isHasAudio, outputPath = _ref4.outputPath, outputSegmentPath = _ref4.outputSegmentPath, resolution = _ref4.resolution;
          _context4.next = 3;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 3:
          _yield$import4 = _context4.sent;
          $ = _yield$import4.$;
          normalizedInputPath = inputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputPath = outputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputSegmentPath = outputSegmentPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          args = ['-y', '-i', normalizedInputPath, '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0', '-map', '0:0'];
          if (isHasAudio) {
            args.push('-map', '0:1');
          }
          args.push('-s:v:0', "".concat(getWidth(720, resolution), "x720"), '-c:v:0', 'libx264', '-b:v:0', "".concat(bitrate[720]), '-c:a', 'copy', '-var_stream_map');
          if (isHasAudio) {
            args.push('v:0,a:0');
          } else {
            args.push('v:0');
          }
          args.push('-master_pl_name', 'master.m3u8', '-f', 'hls', '-hls_time', '6', '-hls_list_size', '0', '-hls_segment_filename', normalizedOutputSegmentPath, normalizedOutputPath);
          _context4.next = 15;
          return $(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["ffmpeg ", ""])), args);
        case 15:
          return _context4.abrupt("return", true);
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function encodeMax720(_x4) {
    return _ref5.apply(this, arguments);
  };
}();
var encodeMax1080 = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref6) {
    var bitrate, inputPath, isHasAudio, outputPath, outputSegmentPath, resolution, _yield$import5, $, normalizedInputPath, normalizedOutputPath, normalizedOutputSegmentPath, args;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          bitrate = _ref6.bitrate, inputPath = _ref6.inputPath, isHasAudio = _ref6.isHasAudio, outputPath = _ref6.outputPath, outputSegmentPath = _ref6.outputSegmentPath, resolution = _ref6.resolution;
          _context5.next = 3;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 3:
          _yield$import5 = _context5.sent;
          $ = _yield$import5.$;
          normalizedInputPath = inputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputPath = outputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputSegmentPath = outputSegmentPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          args = ['-y', '-i', normalizedInputPath, '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0'];
          if (isHasAudio) {
            args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
          } else {
            args.push('-map', '0:0', '-map', '0:0');
          }
          args.push('-s:v:0', "".concat(getWidth(720, resolution), "x720"), '-c:v:0', 'libx264', '-b:v:0', "".concat(bitrate[720]), '-s:v:1', "".concat(getWidth(1080, resolution), "x1080"), '-c:v:1', 'libx264', '-b:v:1', "".concat(bitrate[1080]), '-c:a', 'copy', '-var_stream_map');
          if (isHasAudio) {
            args.push('v:0,a:0 v:1,a:1');
          } else {
            args.push('v:0 v:1');
          }
          args.push('-master_pl_name', 'master.m3u8', '-f', 'hls', '-hls_time', '6', '-hls_list_size', '0', '-hls_segment_filename', normalizedOutputSegmentPath, normalizedOutputPath);
          _context5.next = 15;
          return $(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["ffmpeg ", ""])), args);
        case 15:
          return _context5.abrupt("return", true);
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function encodeMax1080(_x5) {
    return _ref7.apply(this, arguments);
  };
}();
var encodeMax1440 = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref8) {
    var bitrate, inputPath, isHasAudio, outputPath, outputSegmentPath, resolution, _yield$import6, $, normalizedInputPath, normalizedOutputPath, normalizedOutputSegmentPath, args;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          bitrate = _ref8.bitrate, inputPath = _ref8.inputPath, isHasAudio = _ref8.isHasAudio, outputPath = _ref8.outputPath, outputSegmentPath = _ref8.outputSegmentPath, resolution = _ref8.resolution;
          _context6.next = 3;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 3:
          _yield$import6 = _context6.sent;
          $ = _yield$import6.$;
          normalizedInputPath = inputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputPath = outputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputSegmentPath = outputSegmentPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          args = ['-y', '-i', normalizedInputPath, '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0'];
          if (isHasAudio) {
            args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
          } else {
            args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
          }
          args.push('-s:v:0', "".concat(getWidth(720, resolution), "x720"), '-c:v:0', 'libx264', '-b:v:0', "".concat(bitrate[720]), '-s:v:1', "".concat(getWidth(1080, resolution), "x1080"), '-c:v:1', 'libx264', '-b:v:1', "".concat(bitrate[1080]), '-s:v:2', "".concat(getWidth(1440, resolution), "x1440"), '-c:v:2', 'libx264', '-b:v:2', "".concat(bitrate[1440]), '-c:a', 'copy', '-var_stream_map');
          if (isHasAudio) {
            args.push('v:0,a:0 v:1,a:1 v:2,a:2');
          } else {
            args.push('v:0 v:1 v2');
          }
          args.push('-master_pl_name', 'master.m3u8', '-f', 'hls', '-hls_time', '6', '-hls_list_size', '0', '-hls_segment_filename', normalizedOutputSegmentPath, normalizedOutputPath);
          _context6.next = 15;
          return $(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["ffmpeg ", ""])), args);
        case 15:
          return _context6.abrupt("return", true);
        case 16:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function encodeMax1440(_x6) {
    return _ref9.apply(this, arguments);
  };
}();
var encodeMaxOriginal = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref10) {
    var bitrate, inputPath, isHasAudio, outputPath, outputSegmentPath, resolution, _yield$import7, $, normalizedInputPath, normalizedOutputPath, normalizedOutputSegmentPath, args;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          bitrate = _ref10.bitrate, inputPath = _ref10.inputPath, isHasAudio = _ref10.isHasAudio, outputPath = _ref10.outputPath, outputSegmentPath = _ref10.outputSegmentPath, resolution = _ref10.resolution;
          _context7.next = 3;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('zx'));
          });
        case 3:
          _yield$import7 = _context7.sent;
          $ = _yield$import7.$;
          normalizedInputPath = inputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputPath = outputPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          normalizedOutputSegmentPath = outputSegmentPath.split(_path["default"].win32.sep).join(_path["default"].posix.sep);
          args = ['-y', '-i', normalizedInputPath, '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0'];
          if (isHasAudio) {
            args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
          } else {
            args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
          }
          args.push('-s:v:0', "".concat(getWidth(720, resolution), "x720"), '-c:v:0', 'libx264', '-b:v:0', "".concat(bitrate[720]), '-s:v:1', "".concat(getWidth(1080, resolution), "x1080"), '-c:v:1', 'libx264', '-b:v:1', "".concat(bitrate[1080]), '-s:v:2', "".concat(resolution.width, "x").concat(resolution.height), '-c:v:2', 'libx264', '-b:v:2', "".concat(bitrate.original), '-c:a', 'copy', '-var_stream_map');
          if (isHasAudio) {
            args.push('v:0,a:0 v:1,a:1 v:2,a:2');
          } else {
            args.push('v:0 v:1 v2');
          }
          args.push('-master_pl_name', 'master.m3u8', '-f', 'hls', '-hls_time', '6', '-hls_list_size', '0', '-hls_segment_filename', normalizedOutputSegmentPath, normalizedOutputPath);
          _context7.next = 15;
          return $(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["ffmpeg ", ""])), args);
        case 15:
          return _context7.abrupt("return", true);
        case 16:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function encodeMaxOriginal(_x7) {
    return _ref11.apply(this, arguments);
  };
}();
var encodeHLSWithMultipleVideoStreams = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(inputPath) {
    var _yield$Promise$all, _yield$Promise$all2, bitrate, resolution, parent_folder, outputSegmentPath, outputPath, bitrate720, bitrate1080, bitrate1440, isHasAudio, encodeFunc;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return Promise.all([getBitrate(inputPath), getResolution(inputPath)]);
        case 2:
          _yield$Promise$all = _context8.sent;
          _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
          bitrate = _yield$Promise$all2[0];
          resolution = _yield$Promise$all2[1];
          parent_folder = _path["default"].join(inputPath, '..');
          outputSegmentPath = _path["default"].join(parent_folder, 'v%v/fileSequence%d.ts');
          outputPath = _path["default"].join(parent_folder, 'v%v/prog_index.m3u8');
          bitrate720 = bitrate > MAXIMUM_BITRATE_720P ? MAXIMUM_BITRATE_720P : bitrate;
          bitrate1080 = bitrate > MAXIMUM_BITRATE_1080P ? MAXIMUM_BITRATE_1080P : bitrate;
          bitrate1440 = bitrate > MAXIMUM_BITRATE_1440P ? MAXIMUM_BITRATE_1440P : bitrate;
          _context8.next = 14;
          return checkVideoHasAudio(inputPath);
        case 14:
          isHasAudio = _context8.sent;
          encodeFunc = encodeMax720;
          if (resolution.height > 720) {
            encodeFunc = encodeMax1080;
          }
          if (resolution.height > 1080) {
            encodeFunc = encodeMax1440;
          }
          if (resolution.height > 1440) {
            encodeFunc = encodeMaxOriginal;
          }
          _context8.next = 21;
          return encodeFunc({
            bitrate: {
              720: bitrate720,
              1080: bitrate1080,
              1440: bitrate1440,
              original: bitrate
            },
            inputPath: inputPath,
            isHasAudio: isHasAudio,
            outputPath: outputPath,
            outputSegmentPath: outputSegmentPath,
            resolution: resolution
          });
        case 21:
          return _context8.abrupt("return", true);
        case 22:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function encodeHLSWithMultipleVideoStreams(_x8) {
    return _ref12.apply(this, arguments);
  };
}();
exports.encodeHLSWithMultipleVideoStreams = encodeHLSWithMultipleVideoStreams;