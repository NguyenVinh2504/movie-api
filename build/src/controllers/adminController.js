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
    var mediaId, results;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          mediaId = req.params.mediaId;
          _context3.next = 4;
          return _adminServices.adminService.deleteMedia(mediaId);
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
var addEpisode = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var tvShowId, episodeData, newEpisode;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          tvShowId = req.params.tvShowId;
          episodeData = req.body; // Gọi service để thêm tập phim, truyền vào cả tvShowId và dữ liệu tập phim
          _context9.next = 5;
          return _adminServices.adminService.addEpisode(tvShowId, episodeData);
        case 5:
          newEpisode = _context9.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(newEpisode);
          _context9.next = 12;
          break;
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          next(_context9.t0);
        case 12:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 9]]);
  }));
  return function addEpisode(_x26, _x27, _x28) {
    return _ref9.apply(this, arguments);
  };
}();
var getEpisodeList = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var tvShowId, _req$query, page, pageSize, result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          tvShowId = req.params.tvShowId;
          _req$query = req.query, page = _req$query.page, pageSize = _req$query.pageSize;
          _context10.next = 5;
          return _adminServices.adminService.getEpisodeList(tvShowId, {
            page: page,
            pageSize: pageSize
          });
        case 5:
          result = _context10.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(result);
          _context10.next = 12;
          break;
        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          next(_context10.t0);
        case 12:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 9]]);
  }));
  return function getEpisodeList(_x29, _x30, _x31) {
    return _ref10.apply(this, arguments);
  };
}();
var getEpisodeDetails = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var _req$params, tvShowId, episodeId, result;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _req$params = req.params, tvShowId = _req$params.tvShowId, episodeId = _req$params.episodeId;
          _context11.next = 4;
          return _adminServices.adminService.getEpisodeDetails(tvShowId, episodeId);
        case 4:
          result = _context11.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(result);
          _context11.next = 11;
          break;
        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](0);
          next(_context11.t0);
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 8]]);
  }));
  return function getEpisodeDetails(_x32, _x33, _x34) {
    return _ref11.apply(this, arguments);
  };
}();
var getEpisodeDetailsByTmdbId = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var tvShowId, episodeTmdbId, result;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          tvShowId = req.params.tvShowId;
          episodeTmdbId = req.query.episodeTmdbId;
          _context12.next = 5;
          return _adminServices.adminService.getEpisodeDetailsByTmdbId({
            tvShowId: tvShowId,
            episodeTmdbId: episodeTmdbId
          });
        case 5:
          result = _context12.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(result);
          _context12.next = 12;
          break;
        case 9:
          _context12.prev = 9;
          _context12.t0 = _context12["catch"](0);
          next(_context12.t0);
        case 12:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 9]]);
  }));
  return function getEpisodeDetailsByTmdbId(_x35, _x36, _x37) {
    return _ref12.apply(this, arguments);
  };
}();
var updateEpisode = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var _req$params2, tvShowId, episodeId, result;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _req$params2 = req.params, tvShowId = _req$params2.tvShowId, episodeId = _req$params2.episodeId;
          _context13.next = 4;
          return _adminServices.adminService.updateEpisode(tvShowId, episodeId, req.body);
        case 4:
          result = _context13.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(result);
          _context13.next = 11;
          break;
        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](0);
          next(_context13.t0);
        case 11:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 8]]);
  }));
  return function updateEpisode(_x38, _x39, _x40) {
    return _ref13.apply(this, arguments);
  };
}();
var deleteEpisode = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var _req$params3, tvShowId, episodeId, result;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _req$params3 = req.params, tvShowId = _req$params3.tvShowId, episodeId = _req$params3.episodeId;
          _context14.next = 4;
          return _adminServices.adminService.deleteEpisode(tvShowId, episodeId);
        case 4:
          result = _context14.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(result);
          _context14.next = 11;
          break;
        case 8:
          _context14.prev = 8;
          _context14.t0 = _context14["catch"](0);
          next(_context14.t0);
        case 11:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 8]]);
  }));
  return function deleteEpisode(_x41, _x42, _x43) {
    return _ref14.apply(this, arguments);
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
  addEpisode: addEpisode,
  getEpisodeList: getEpisodeList,
  updateEpisode: updateEpisode,
  deleteEpisode: deleteEpisode,
  getEpisodeDetails: getEpisodeDetails,
  getEpisodeDetailsByTmdbId: getEpisodeDetailsByTmdbId,
  getMediaById: getMediaById,
  deleteMedia: deleteMedia
};
exports.adminController = adminController;