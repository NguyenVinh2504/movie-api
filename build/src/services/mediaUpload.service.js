"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaUploadService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _sharp = _interopRequireDefault(require("sharp"));
var _constants = require("../utils/constants");
var _file = require("../utils/file");
var _fs = _interopRequireDefault(require("fs"));
var _environment = require("../config/environment");
var uploadImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req) {
    var files, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _file.handleUploadImage)(req);
        case 2:
          files = _context2.sent;
          _context2.next = 5;
          return Promise.all(files.map( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
              var newPath;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    newPath = "".concat(_constants.UPLOAD_DIR, "/").concat(file === null || file === void 0 ? void 0 : file.newFilename);
                    _context.next = 3;
                    return (0, _sharp["default"])(file.filepath).resize({
                      width: 400,
                      withoutEnlargement: true
                    }).toFile(newPath);
                  case 3:
                    try {
                      _fs["default"].unlinkSync(file.filepath);
                    } catch (error) {
                      // console.log(error)
                    }
                    return _context.abrupt("return", {
                      name: file === null || file === void 0 ? void 0 : file.newFilename,
                      type: file === null || file === void 0 ? void 0 : file.mimetype,
                      url: _environment.env.BUILD_MODE === 'production' ? "".concat(_environment.env.PRODUCT_APP_HOST, "/files/image/").concat(file === null || file === void 0 ? void 0 : file.newFilename) : "http://localhost:".concat(_environment.env.LOCAL_DEV_APP_PORT, "/api/v1/files/image/").concat(file === null || file === void 0 ? void 0 : file.newFilename)
                    });
                  case 5:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 5:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function uploadImage(_x) {
    return _ref.apply(this, arguments);
  };
}();
var mediaUploadService = {
  uploadImage: uploadImage
};
exports.mediaUploadService = mediaUploadService;