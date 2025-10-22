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
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
var _resolveLangCode = _interopRequireDefault(require("../helpers/resolveLangCode"));
var _episodeModel = require("../models/episodeModel");
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
            subtitle_links: processedSubtitles
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
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(mediaId) {
    var session, deletedMedia;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          session = _mongodb2.mongoClientInstance.startSession();
          _context6.prev = 1;
          deletedMedia = null; // Biến để lưu trữ media đã xóa
          _context6.next = 5;
          return session.withTransaction( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return _videoMeidaModel.videoMediaModel.deleteOneById(mediaId, {
                    session: session
                  });
                case 2:
                  deletedMedia = _context5.sent;
                  if (deletedMedia) {
                    _context5.next = 5;
                    break;
                  }
                  throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Media không tồn tại.');
                case 5:
                  if (!(deletedMedia.media_type === 'tv')) {
                    _context5.next = 8;
                    break;
                  }
                  _context5.next = 8;
                  return _episodeModel.episodeModel.deleteManyByTvShowId(mediaId, {
                    session: session
                  });
                case 8:
                case "end":
                  return _context5.stop();
              }
            }, _callee5);
          })));
        case 5:
          return _context6.abrupt("return", {
            status: 'success',
            message: 'Xóa media thành công.'
          });
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](1);
          throw _context6.t0;
        case 11:
          _context6.prev = 11;
          _context6.next = 14;
          return session.endSession();
        case 14:
          return _context6.finish(11);
        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 8, 11, 15]]);
  }));
  return function deleteMedia(_x8) {
    return _ref6.apply(this, arguments);
  };
}();
var createTvShow = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(body) {
    var existed, data, createdTvShow;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _videoMeidaModel.videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'tv');
        case 3:
          existed = _context7.sent;
          if (!existed) {
            _context7.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.');
        case 6:
          data = _objectSpread(_objectSpread({}, body), {}, {
            media_type: 'tv'
          }); // Validate và thêm vào DB
          _context7.next = 9;
          return _videoMeidaModel.videoMediaModel.createTvShow(data);
        case 9:
          createdTvShow = _context7.sent;
          return _context7.abrupt("return", createdTvShow);
        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          throw _context7.t0;
        case 16:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 13]]);
  }));
  return function createTvShow(_x9) {
    return _ref8.apply(this, arguments);
  };
}();
var getTvShowList = function getTvShowList(params) {
  return getPaginatedList(_videoMeidaModel.videoMediaModel.getTvShowList, params, 'Lấy danh sách phim thành công');
};
var updateTvShow = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(idTvShow, reqBody) {
    var status, name, poster_path, updateData, updatedTvShow;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          // const tvShow = await videoMediaModel.findById(idTvShow)
          // if (!tvShow) {
          //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
          // }
          status = reqBody.status, name = reqBody.name, poster_path = reqBody.poster_path;
          updateData = {
            status: status,
            name: name,
            poster_path: poster_path
          };
          _context8.next = 5;
          return _videoMeidaModel.videoMediaModel.update({
            media_type: 'tv',
            mediaId: idTvShow,
            updateData: updateData
          });
        case 5:
          updatedTvShow = _context8.sent;
          return _context8.abrupt("return", {
            status: 'success',
            message: 'Cập nhật thông tin phim thành công',
            data: updatedTvShow
          });
        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          throw _context8.t0;
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 9]]);
  }));
  return function updateTvShow(_x10, _x11) {
    return _ref9.apply(this, arguments);
  };
}();
var addEpisode = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(tvShowId, episodeData) {
    var tvShow, existingEpisode, session, newEpisode;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return _videoMeidaModel.videoMediaModel.findById(tvShowId);
        case 2:
          tvShow = _context10.sent;
          if (tvShow) {
            _context10.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Vui lòng tạo TV show trước khi thêm tập phim.');
        case 5:
          _context10.next = 7;
          return _episodeModel.episodeModel.findOne({
            tv_show_id: new _mongodb.ObjectId(tvShowId),
            season_number: episodeData.season_number,
            episode_number: episodeData.episode_number
          });
        case 7:
          existingEpisode = _context10.sent;
          if (!existingEpisode) {
            _context10.next = 10;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.CONFLICT, 'Tập phim này đã tồn tại.');
        case 10:
          // Bắt đầu một session để chạy transaction
          session = _mongodb2.mongoClientInstance.startSession();
          _context10.prev = 11;
          _context10.next = 14;
          return session.withTransaction( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
            var dataToCreate, stats, _stats$, seasonCount, episodeCount;
            return _regenerator["default"].wrap(function _callee9$(_context9) {
              while (1) switch (_context9.prev = _context9.next) {
                case 0:
                  // Thao tác 1: Tạo tập phim mới
                  dataToCreate = _objectSpread(_objectSpread({}, episodeData), {}, {
                    tv_show_id: tvShowId
                  }); // Gán kết quả vào newEpisode và truyền session
                  _context9.next = 3;
                  return _episodeModel.episodeModel.create(dataToCreate, {
                    session: session
                  });
                case 3:
                  newEpisode = _context9.sent;
                  if (newEpisode) {
                    _context9.next = 6;
                    break;
                  }
                  throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Thêm tập phim mới thất bại.');
                case 6:
                  _context9.next = 8;
                  return _episodeModel.episodeModel.aggregate([{
                    $match: {
                      tv_show_id: new _mongodb.ObjectId(tvShowId)
                    }
                  }, {
                    $group: {
                      _id: '$tv_show_id',
                      episodeCount: {
                        $sum: 1
                      },
                      uniqueSeasons: {
                        $addToSet: '$season_number'
                      }
                    }
                  }, {
                    $project: {
                      _id: 0,
                      episodeCount: 1,
                      seasonCount: {
                        $size: '$uniqueSeasons'
                      }
                    }
                  }], {
                    session: session
                  });
                case 8:
                  stats = _context9.sent;
                  if (!(stats.length > 0)) {
                    _context9.next = 13;
                    break;
                  }
                  _stats$ = stats[0], seasonCount = _stats$.seasonCount, episodeCount = _stats$.episodeCount;
                  _context9.next = 13;
                  return _videoMeidaModel.videoMediaModel.update({
                    mediaId: tvShowId,
                    media_type: 'tv',
                    updateData: {
                      seasonCount: seasonCount,
                      episodeCount: episodeCount,
                      updatedAt: new Date()
                    }
                  }, {
                    session: session
                  });
                case 13:
                case "end":
                  return _context9.stop();
              }
            }, _callee9);
          })));
        case 14:
          return _context10.abrupt("return", newEpisode);
        case 15:
          _context10.prev = 15;
          _context10.next = 18;
          return session.endSession();
        case 18:
          return _context10.finish(15);
        case 19:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[11,, 15, 19]]);
  }));
  return function addEpisode(_x12, _x13) {
    return _ref10.apply(this, arguments);
  };
}();
var getEpisodeList = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(tvShowId, _ref12) {
    var page, pageSize, tvShow, _yield$episodeModel$f, data, pagination, totalPages;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          page = _ref12.page, pageSize = _ref12.pageSize;
          _context11.next = 3;
          return _videoMeidaModel.videoMediaModel.findById(tvShowId);
        case 3:
          tvShow = _context11.sent;
          if (tvShow) {
            _context11.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'TV show không tồn tại.');
        case 6:
          _context11.next = 8;
          return _episodeModel.episodeModel.findByTvShow(tvShowId, {
            page: page,
            pageSize: pageSize
          });
        case 8:
          _yield$episodeModel$f = _context11.sent;
          data = _yield$episodeModel$f.data;
          pagination = _yield$episodeModel$f.pagination;
          totalPages = Math.ceil(pagination.totalItems / pageSize);
          return _context11.abrupt("return", {
            status: 'success',
            message: 'Lấy danh sách tập phim',
            data: data,
            pagination: {
              totalItems: pagination.totalItems,
              totalPages: totalPages,
              currentPage: page,
              itemsPerPage: pageSize
            }
          });
        case 13:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function getEpisodeList(_x14, _x15) {
    return _ref13.apply(this, arguments);
  };
}();
var deleteEpisode = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(tvShowId, episodeId) {
    var tvShow, episode, session;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return _videoMeidaModel.videoMediaModel.findById(tvShowId);
        case 2:
          tvShow = _context13.sent;
          if (tvShow) {
            _context13.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'TV show không tồn tại.');
        case 5:
          _context13.next = 7;
          return _episodeModel.episodeModel.findOne({
            _id: new _mongodb.ObjectId(episodeId)
          });
        case 7:
          episode = _context13.sent;
          if (episode) {
            _context13.next = 10;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Tập phim không tồn tại.');
        case 10:
          // Bắt đầu một session để chạy transaction
          session = _mongodb2.mongoClientInstance.startSession();
          _context13.prev = 11;
          _context13.next = 14;
          return session.withTransaction( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
            var stats, _ref16, _ref16$seasonCount, seasonCount, _ref16$episodeCount, episodeCount;
            return _regenerator["default"].wrap(function _callee12$(_context12) {
              while (1) switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return _episodeModel.episodeModel.deleteOneById(episodeId, {
                    session: session
                  });
                case 2:
                  _context12.next = 4;
                  return _episodeModel.episodeModel.aggregate([{
                    $match: {
                      tv_show_id: new _mongodb.ObjectId(tvShowId)
                    }
                  }, {
                    $group: {
                      _id: null,
                      episodeCount: {
                        $sum: 1
                      },
                      uniqueSeasons: {
                        $addToSet: '$season_number'
                      }
                    }
                  }, {
                    $project: {
                      _id: 0,
                      episodeCount: 1,
                      seasonCount: {
                        $size: '$uniqueSeasons'
                      }
                    }
                  }], {
                    session: session
                  });
                case 4:
                  stats = _context12.sent;
                  _ref16 = stats[0] || {}, _ref16$seasonCount = _ref16.seasonCount, seasonCount = _ref16$seasonCount === void 0 ? 0 : _ref16$seasonCount, _ref16$episodeCount = _ref16.episodeCount, episodeCount = _ref16$episodeCount === void 0 ? 0 : _ref16$episodeCount; // 4. Cập nhật lại TV show cha
                  _context12.next = 8;
                  return _videoMeidaModel.videoMediaModel.update({
                    mediaId: tvShowId,
                    media_type: 'tv',
                    updateData: {
                      seasonCount: seasonCount,
                      episodeCount: episodeCount,
                      updatedAt: new Date()
                    }
                  }, {
                    session: session
                  });
                case 8:
                case "end":
                  return _context12.stop();
              }
            }, _callee12);
          })));
        case 14:
          _context13.prev = 14;
          _context13.next = 17;
          return session.endSession();
        case 17:
          return _context13.finish(14);
        case 18:
          return _context13.abrupt("return", {
            status: 'success',
            message: 'Xóa tập phim thành công.'
          });
        case 19:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[11,, 14, 18]]);
  }));
  return function deleteEpisode(_x16, _x17) {
    return _ref14.apply(this, arguments);
  };
}();
var getEpisodeDetails = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(tvShowId, episodeId) {
    var episode;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return _episodeModel.episodeModel.findOne({
            _id: new _mongodb.ObjectId(episodeId),
            tv_show_id: new _mongodb.ObjectId(tvShowId) // Thêm điều kiện tv_show_id vào đây
          }, episodeId);
        case 2:
          episode = _context14.sent;
          if (episode) {
            _context14.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Tập phim không tồn tại hoặc không thuộc TV show này.');
        case 5:
          return _context14.abrupt("return", {
            status: 'success',
            message: 'Lấy thông tin tập phim thành công.',
            data: episode
          });
        case 6:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return function getEpisodeDetails(_x18, _x19) {
    return _ref17.apply(this, arguments);
  };
}();
var getEpisodeDetailsByTmdbId = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(_ref18) {
    var tvShowId, episodeTmdbId, episode;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          tvShowId = _ref18.tvShowId, episodeTmdbId = _ref18.episodeTmdbId;
          _context15.next = 3;
          return _episodeModel.episodeModel.findByTmdbId({
            tvShowId: tvShowId,
            episodeTmdbId: episodeTmdbId
          });
        case 3:
          episode = _context15.sent;
          if (episode) {
            _context15.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Tập phim hiện chưa được tạo.');
        case 6:
          return _context15.abrupt("return", {
            status: 'success',
            message: 'Lấy thông tin tập phim thành công.',
            data: episode
          });
        case 7:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return function getEpisodeDetailsByTmdbId(_x20) {
    return _ref19.apply(this, arguments);
  };
}();
var updateEpisode = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(tvShowId, episodeId, body) {
    var episode, name, season_number, episode_number, episode_id, video_links, subtitle_links, processedSubtitles, updateData, updatedEpisode;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return _episodeModel.episodeModel.findOne({
            _id: new _mongodb.ObjectId(episodeId),
            tv_show_id: new _mongodb.ObjectId(tvShowId)
          });
        case 2:
          episode = _context16.sent;
          if (episode) {
            _context16.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Tập phim không tồn tại hoặc không thuộc TV show này.');
        case 5:
          name = body.name, season_number = body.season_number, episode_number = body.episode_number, episode_id = body.episode_id, video_links = body.video_links, subtitle_links = body.subtitle_links;
          processedSubtitles = (subtitle_links !== null && subtitle_links !== void 0 ? subtitle_links : []).map(function (sub) {
            return _objectSpread(_objectSpread({}, sub), {}, {
              lang: (0, _resolveLangCode["default"])(sub.label),
              kind: 'subtitles'
            });
          }); // Tạo object updateData chứa tất cả các trường
          updateData = {
            name: name,
            season_number: season_number,
            episode_number: episode_number,
            episode_id: episode_id,
            video_links: video_links,
            subtitle_links: processedSubtitles
          };
          _context16.next = 10;
          return _episodeModel.episodeModel.update(episodeId, updateData);
        case 10:
          updatedEpisode = _context16.sent;
          _context16.next = 13;
          return _videoMeidaModel.videoMediaModel.update({
            mediaId: tvShowId,
            media_type: 'tv',
            updateData: {
              updatedAt: new Date()
            }
          });
        case 13:
          return _context16.abrupt("return", {
            status: 'success',
            message: 'Cập nhật thông tin tập phim thành công.',
            data: updatedEpisode
          });
        case 14:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return function updateEpisode(_x21, _x22, _x23) {
    return _ref20.apply(this, arguments);
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
  updateTvShow: updateTvShow,
  //Episode
  addEpisode: addEpisode,
  updateEpisode: updateEpisode,
  getEpisodeList: getEpisodeList,
  deleteEpisode: deleteEpisode,
  getEpisodeDetails: getEpisodeDetails,
  getEpisodeDetailsByTmdbId: getEpisodeDetailsByTmdbId
};
exports.adminService = adminService;