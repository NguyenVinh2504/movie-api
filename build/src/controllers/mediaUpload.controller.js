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
var _constants = require("../utils/constants");
var uploadImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _mediaUpload.mediaUploadService.uploadImage(req);
        case 3:
          result = _context.sent;
          return _context.abrupt("return", res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            result: result
          }));
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function uploadImage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var serveImage = function serveImage(req, res, next) {
  try {
    var name = req.params.name;
    var filePath = _path["default"].resolve(_constants.UPLOAD_DIR, name);
    res.sendFile(filePath, function (err) {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};
var mediaUploadController = {
  uploadImage: uploadImage,
  serveImage: serveImage
};
exports.mediaUploadController = mediaUploadController;