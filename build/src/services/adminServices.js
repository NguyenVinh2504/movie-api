"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _resolveLangCode = _interopRequireDefault(require("../helpers/resolveLangCode"));
var _videoMeidaModel = require("../models/videoMeidaModel");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } /* eslint-disable no-useless-catch */
var getPaginatedList = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fetchFn, _ref, message) {
    var page, pageSize, results, data, totalItems, totalPages;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          page = _ref.page, pageSize = _ref.pageSize;
          _context.prev = 1;
          _context.next = 4;
          return fetchFn({
            page: page,
            pageSize: pageSize
          });
        case 4:
          results = _context.sent;
          data = results[0].data;
          totalItems = results[0].pagination[0] ? results[0].pagination[0].totalItems : 0;
          totalPages = Math.ceil(totalItems / pageSize);
          return _context.abrupt("return", {
            status: 'success',
            message: message,
            data: data,
            pagination: {
              totalItems: totalItems,
              totalPages: totalPages,
              currentPage: page,
              itemsPerPage: pageSize
            }
          });
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          throw _context.t0;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 11]]);
  }));
  return function getPaginatedList(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var createMovie = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(body) {
    var existed, subtitle_links, data, createdMovie;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _videoMeidaModel.videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'movie');
        case 3:
          existed = _context2.sent;
          if (!existed) {
            _context2.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.');
        case 6:
          // Chuẩn hóa subtitle_links
          subtitle_links = (body.subtitle_links || []).map(function (sub) {
            return _objectSpread(_objectSpread({}, sub), {}, {
              lang: (0, _resolveLangCode["default"])(sub.label)
            });
          });
          data = _objectSpread(_objectSpread({}, body), {}, {
            media_type: 'movie',
            subtitle_links: subtitle_links
          }); // Validate và thêm vào DB
          _context2.next = 10;
          return _videoMeidaModel.videoMediaModel.createMovie(data);
        case 10:
          createdMovie = _context2.sent;
          return _context2.abrupt("return", {
            status: 'success',
            message: 'Tạo phim thành công',
            data: createdMovie
          });
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;
        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 14]]);
  }));
  return function createMovie(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

// Sử dụng:
var getMovieList = function getMovieList(params) {
  return getPaginatedList(_videoMeidaModel.videoMediaModel.getMovieList, params, 'Lấy danh sách phim thành công');
};
var getMediaById = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(mediaId) {
    var movie;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _videoMeidaModel.videoMediaModel.findById(mediaId);
        case 3:
          movie = _context3.sent;
          if (movie) {
            _context3.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Phim không tồn tại.');
        case 6:
          return _context3.abrupt("return", {
            status: 'success',
            message: 'Lấy thông tin phim thành công',
            data: movie
          });
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function getMediaById(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var updateMovie = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(idMovie, reqBody) {
    var status, video_links, subtitle_links, title, poster_path, processedSubtitles, updateData, updatedMovie;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // const movie = await videoMediaModel.findById(idMovie)
          // if (!movie) {
          //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
          // }
          status = reqBody.status, video_links = reqBody.video_links, subtitle_links = reqBody.subtitle_links, title = reqBody.title, poster_path = reqBody.poster_path;
          processedSubtitles = subtitle_links.map(function (sub) {
            return _objectSpread(_objectSpread({}, sub), {}, {
              lang: (0, _resolveLangCode["default"])(sub.label),
              kind: 'subtitles'
            });
          });
          updateData = {
            status: status,
            title: title,
            poster_path: poster_path,
            video_links: video_links,
            subtitle_links: processedSubtitles,
            updatedAt: new Date()
          };
          _context4.next = 6;
          return _videoMeidaModel.videoMediaModel.update({
            mediaId: idMovie,
            updateData: updateData,
            media_type: 'movie'
          });
        case 6:
          updatedMovie = _context4.sent;
          return _context4.abrupt("return", {
            status: 'success',
            message: 'Cập nhật thông tin phim thành công',
            data: updatedMovie
          });
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          throw _context4.t0;
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return function updateMovie(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteMedia = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(idMovie) {
    var movie;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _videoMeidaModel.videoMediaModel.findById(idMovie);
        case 3:
          movie = _context5.sent;
          if (movie) {
            _context5.next = 8;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Phim không tồn tại.');
        case 8:
          _context5.next = 10;
          return _videoMeidaModel.videoMediaModel.deleteOneById(idMovie);
        case 10:
          return _context5.abrupt("return", {
            status: 'success',
            message: 'Xóa phim thành công'
          });
        case 11:
          _context5.next = 16;
          break;
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          throw _context5.t0;
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function deleteMedia(_x8) {
    return _ref6.apply(this, arguments);
  };
}();
var createTvShow = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(body) {
    var existed, data, createdTvShow;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _videoMeidaModel.videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'tv');
        case 3:
          existed = _context6.sent;
          if (!existed) {
            _context6.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.');
        case 6:
          body.seasons.flatMap(function (s) {
            return s.episodes;
          }).flatMap(function (e) {
            return e.subtitle_links;
          }).forEach(function (sub) {
            return sub.lang = (0, _resolveLangCode["default"])(sub.label);
          });
          data = _objectSpread(_objectSpread({}, body), {}, {
            media_type: 'tv'
          }); // Validate và thêm vào DB
          _context6.next = 10;
          return _videoMeidaModel.videoMediaModel.createTvShow(data);
        case 10:
          createdTvShow = _context6.sent;
          return _context6.abrupt("return", createdTvShow);
        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          throw _context6.t0;
        case 17:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 14]]);
  }));
  return function createTvShow(_x9) {
    return _ref7.apply(this, arguments);
  };
}();
var getTvShowList = function getTvShowList(params) {
  return getPaginatedList(_videoMeidaModel.videoMediaModel.getTvShowList, params, 'Lấy danh sách phim thành công');
};
var updateTvShow = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(idTvShow, reqBody) {
    var status, name, poster_path, seasons, updateData, updatedTvShow;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          // const tvShow = await videoMediaModel.findById(idTvShow)
          // if (!tvShow) {
          //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
          // }
          reqBody.seasons.flatMap(function (s) {
            return s.episodes;
          }).flatMap(function (e) {
            return e.subtitle_links;
          }).forEach(function (sub) {
            sub.lang = (0, _resolveLangCode["default"])(sub.label);
            sub.kind = 'subtitles';
          });
          status = reqBody.status, name = reqBody.name, poster_path = reqBody.poster_path, seasons = reqBody.seasons;
          updateData = {
            status: status,
            name: name,
            poster_path: poster_path,
            seasons: seasons,
            updatedAt: new Date()
          };
          _context7.next = 6;
          return _videoMeidaModel.videoMediaModel.update({
            media_type: 'tv',
            mediaId: idTvShow,
            updateData: updateData
          });
        case 6:
          updatedTvShow = _context7.sent;
          return _context7.abrupt("return", {
            status: 'success',
            message: 'Cập nhật thông tin phim thành công',
            data: updatedTvShow
          });
        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          throw _context7.t0;
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 10]]);
  }));
  return function updateTvShow(_x10, _x11) {
    return _ref8.apply(this, arguments);
  };
}();
var adminService = {
  createMovie: createMovie,
  getMovieList: getMovieList,
  getMediaById: getMediaById,
  updateMovie: updateMovie,
  deleteMedia: deleteMedia,
  //Tv Show
  createTvShow: createTvShow,
  getTvShowList: getTvShowList,
  updateTvShow: updateTvShow
};
exports.adminService = adminService;