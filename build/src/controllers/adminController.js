"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _adminServices = require("../services/adminServices");
// Helper để lấy phân trang từ query
var getPagingParams = function getPagingParams(req) {
  return {
    page: parseInt(req.query.page, 10) || 1,
    pageSize: parseInt(req.query.pageSize, 10) || 5
  };
};
var updateMedia = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next, fetchFn) {
    var reqBody, idMedia, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          reqBody = req.body;
          idMedia = req.params.mediaId;
          _context.next = 5;
          return fetchFn(idMedia, reqBody);
        case 5:
          results = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(results);
          _context.next = 12;
          break;
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function updateMedia(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
var getMediaById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var results;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _adminServices.adminService.getMediaById(req.params.mediaId);
        case 3:
          results = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(results);
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function getMediaById(_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();
var deleteMedia = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var idMedia, results;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          idMedia = req.params.mediaId;
          _context3.next = 4;
          return _adminServices.adminService.deleteMedia(idMedia);
        case 4:
          results = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(results);
          _context3.next = 11;
          break;
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function deleteMedia(_x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();
var createMovie = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var movie;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _adminServices.adminService.createMovie(req.body);
        case 3:
          movie = _context4.sent;
          // Có kết quả thì trả về Client
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(
          //dữ liệu từ service
          movie);
          _context4.next = 10;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(_context4.t0);
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function createMovie(_x11, _x12, _x13) {
    return _ref4.apply(this, arguments);
  };
}();
var getMovieList = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var _getPagingParams, page, pageSize, results;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _getPagingParams = getPagingParams(req), page = _getPagingParams.page, pageSize = _getPagingParams.pageSize;
          _context5.next = 4;
          return _adminServices.adminService.getMovieList({
            page: page,
            pageSize: pageSize
          });
        case 4:
          results = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(results);
          _context5.next = 11;
          break;
        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 8]]);
  }));
  return function getMovieList(_x14, _x15, _x16) {
    return _ref5.apply(this, arguments);
  };
}();
var updateMovie = function updateMovie(req, res, next) {
  return updateMedia(req, res, next, _adminServices.adminService.updateMovie);
};
var createTvShow = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var tvShow;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _adminServices.adminService.createTvShow(req.body);
        case 3:
          tvShow = _context6.sent;
          // Có kết quả thì trả về Client
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(
          //dữ liệu từ service
          tvShow);
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(_context6.t0);
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function createTvShow(_x17, _x18, _x19) {
    return _ref6.apply(this, arguments);
  };
}();
var getTvShowList = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var _getPagingParams2, page, pageSize, results;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _getPagingParams2 = getPagingParams(req), page = _getPagingParams2.page, pageSize = _getPagingParams2.pageSize;
          _context7.next = 4;
          return _adminServices.adminService.getTvShowList({
            page: page,
            pageSize: pageSize
          });
        case 4:
          results = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(results);
          _context7.next = 11;
          break;
        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          next(_context7.t0);
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 8]]);
  }));
  return function getTvShowList(_x20, _x21, _x22) {
    return _ref7.apply(this, arguments);
  };
}();
var updateTvShow = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", updateMedia(req, res, next, _adminServices.adminService.updateTvShow));
        case 1:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function updateTvShow(_x23, _x24, _x25) {
    return _ref8.apply(this, arguments);
  };
}();
var adminController = {
  createMovie: createMovie,
  getMovieList: getMovieList,
  updateMovie: updateMovie,
  //Tv Show
  createTvShow: createTvShow,
  getTvShowList: getTvShowList,
  updateTvShow: updateTvShow,
  getMediaById: getMediaById,
  deleteMedia: deleteMedia
};
exports.adminController = adminController;