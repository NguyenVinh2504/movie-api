"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoMediaModel = exports.videoLinkSchema = exports.subtitleLinkSchema = exports.TV_SHOW_INPUT_SCHEMA = exports.MOVIE_INPUT_SCHEMA = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// --- 1. ĐỊNH NGHĨA CONSTANTS VÀ SCHEMA ---
// Tên collection cho media (bao gồm cả movies và tv_shows)
var MEDIA_COLLECTION_NAME = 'media';

// Sub‑schema chung cho video link
var videoLinkSchema = _joi["default"].object({
  label: _joi["default"].string().trim().min(1).required().messages({
    'any.required': 'Mỗi video link phải có "label".',
    'string.empty': '"label" không được để trống.'
  }),
  url: _joi["default"].string().uri({
    allowRelative: true
  }).required().messages({
    'any.required': 'Mỗi video link phải có "url".',
    'string.uri': '"url" phải là một đường dẫn hợp lệ.'
  })
});

// Sub‑schema chung cho subtitle link
exports.videoLinkSchema = videoLinkSchema;
var subtitleLinkSchema = _joi["default"].object({
  lang: _joi["default"].string().trim().lowercase().length(2).allow(null).optional()["default"](null).messages({
    'any.required': 'Mỗi subtitle phải có mã ngôn ngữ "lang" (ví dụ: "vi", "en").',
    'string.length': '"lang" phải là mã ISO 639-1 (2 ký tự).'
  }),
  url: _joi["default"].string().uri({
    allowRelative: true
  }).required().messages({
    'any.required': 'Mỗi subtitle phải có "url".',
    'string.uri': '"url" phải là một đường dẫn hợp lệ.'
  }),
  label: _joi["default"].string().trim().min(1).required().messages({
    'any.required': 'Mỗi video link phải có "label".',
    'string.empty': '"label" không được để trống.'
  }),
  kind: _joi["default"].string().trim().optional()["default"]('subtitles')
});

// Schema cơ bản chung cho mọi media (Movie & TVShow)
exports.subtitleLinkSchema = subtitleLinkSchema;
var MediaBaseSchema = _joi["default"].object({
  tmdb_id: _joi["default"].number().integer().positive().required(),
  poster_path: _joi["default"].string().uri({
    allowRelative: true
  }).allow(null, '').optional(),
  status: _joi["default"].string().valid('published', 'draft').required(),
  createdAt: _joi["default"].forbidden(),
  updatedAt: _joi["default"].forbidden()
}).unknown(false);

// Schema dành cho Movie
var MOVIE_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: _joi["default"].valid('movie').required(),
  title: _joi["default"].string().trim().min(1).required(),
  video_links: _joi["default"].array().items(videoLinkSchema).required(),
  subtitle_links: _joi["default"].array().items(subtitleLinkSchema).required()
});

// // Sub‑schema cho Season
// const SeasonSchema = Joi.object({
//   season_number: Joi.number().integer().required(),
//   episodes: Joi.array().items(EpisodeSchema).required()
// })

// Schema dành cho TVShow
exports.MOVIE_INPUT_SCHEMA = MOVIE_INPUT_SCHEMA;
var TV_SHOW_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: _joi["default"].valid('tv').required(),
  name: _joi["default"].string().trim().min(1).required(),
  seasonCount: _joi["default"].number().integer().min(0)["default"](0),
  episodeCount: _joi["default"].number().integer().min(0)["default"](0)
  // seasons: Joi.array().items(SeasonSchema).required()
});

// --- 2. HÀM TƯƠNG TÁC VỚI DATABASE ---
exports.TV_SHOW_INPUT_SCHEMA = TV_SHOW_INPUT_SCHEMA;
var createMedia = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(inputData, schema) {
    var validatedData, now, mediaCollection, insertResult, createdMedia;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return schema.validateAsync(inputData, {
            abortEarly: false,
            stripUnknown: true
          });
        case 2:
          validatedData = _context.sent;
          now = new Date();
          validatedData.createdAt = now;
          validatedData.updatedAt = now;
          mediaCollection = (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME);
          _context.next = 9;
          return mediaCollection.insertOne(validatedData);
        case 9:
          insertResult = _context.sent;
          _context.next = 12;
          return mediaCollection.findOne({
            _id: insertResult.insertedId
          });
        case 12:
          createdMedia = _context.sent;
          return _context.abrupt("return", createdMedia);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createMedia(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Sử dụng cho Movie
var createMovie = function createMovie(movieData) {
  return createMedia(movieData, MOVIE_INPUT_SCHEMA);
};

// Sử dụng cho TV Show
var createTvShow = function createTvShow(tvShowData) {
  return createMedia(tvShowData, TV_SHOW_INPUT_SCHEMA);
};
var getMovieList = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var page, pageSize, skip, mediaCollection, pipeline, results;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          page = _ref2.page, pageSize = _ref2.pageSize;
          _context2.prev = 1;
          skip = (page - 1) * pageSize;
          mediaCollection = (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME); // 2. Xây dựng Aggregation Pipeline
          pipeline = [
          // Giai đoạn 1: Chỉ lấy các document là 'movie'
          {
            $match: {
              media_type: 'movie'
            }
          },
          // Giai đoạn 2: Sắp xếp (ví dụ: mới nhất lên đầu)
          {
            $sort: {
              createdAt: -1
            }
          },
          // // Giai đoạn 3: Join với collection 'categories'
          // {
          //   $lookup: {
          //     from: 'categories', // Collection để join
          //     localField: 'category_ids', // Trường trong collection 'media'
          //     foreignField: '_id', // Trường trong collection 'categories'
          //     as: 'categories' // Tên mảng mới chứa kết quả join
          //   }
          // },
          // Giai đoạn 4: Định hình lại output cuối cùng
          {
            $project: {
              // Bỏ các trường không cần thiết
              video_links: 0,
              subtitle_links: 0
              // category_ids: 0, // Bỏ trường id sau khi đã join

              // Chỉ lấy các trường cần thiết trong 'categories'
              // 'categories._id': 1,
              // 'categories.name': 1
            }
          },
          // Giai đoạn 5: Thực hiện phân trang và đếm tổng số document
          // $facet cho phép chạy nhiều pipeline con trên cùng một bộ dữ liệu
          {
            $facet: {
              // Pipeline con 1: Lấy dữ liệu cho trang hiện tại
              data: [{
                $skip: skip
              }, {
                $limit: pageSize
              }],
              // Pipeline con 2: Lấy metadata (chỉ cần đếm tổng số)
              pagination: [{
                $count: 'totalItems'
              }]
            }
          }]; // 3. Thực thi pipeline
          _context2.next = 7;
          return mediaCollection.aggregate(pipeline).toArray();
        case 7:
          results = _context2.sent;
          return _context2.abrupt("return", results);
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          throw new Error(_context2.t0);
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 11]]);
  }));
  return function getMovieList(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var getTvShowList = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref4) {
    var page, pageSize, skip, mediaCollection, pipeline, results;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          page = _ref4.page, pageSize = _ref4.pageSize;
          _context3.prev = 1;
          skip = (page - 1) * pageSize;
          mediaCollection = (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME); // 2. Xây dựng Aggregation Pipeline
          pipeline = [
          // Giai đoạn 1: Chỉ lấy các document là 'tv'
          {
            $match: {
              media_type: 'tv'
            }
          },
          // Giai đoạn 2: Sắp xếp (ví dụ: mới nhất lên đầu)
          {
            $sort: {
              createdAt: -1
            }
          },
          // // Giai đoạn 3: Thêm các trường tính toán
          // {
          //   $addFields: {
          //     seasonCount: { $size: '$seasons' },
          //     episodeCount: {
          //       $sum: {
          //         $map: {
          //           input: '$seasons',
          //           as: 'season',
          //           in: { $size: '$$season.episodes' }
          //         }
          //       }
          //     }
          //   }
          // },
          // Giai đoạn 4: Định hình lại output cuối cùng
          {
            $project: {
              _id: 1,
              tmdb_id: 1,
              media_type: 1,
              name: 1,
              poster_path: 1,
              status: 1,
              seasonCount: 1,
              episodeCount: 1,
              createdAt: 1,
              updatedAt: 1
              // Loại bỏ seasons array gốc và các trường không cần thiết
            }
          },
          // Giai đoạn 5: Thực hiện phân trang và đếm tổng số document
          {
            $facet: {
              // Pipeline con 1: Lấy dữ liệu cho trang hiện tại
              data: [{
                $skip: skip
              }, {
                $limit: pageSize
              }],
              // Pipeline con 2: Lấy metadata (chỉ cần đếm tổng số)
              pagination: [{
                $count: 'totalItems'
              }]
            }
          }]; // 3. Thực thi pipeline
          _context3.next = 7;
          return mediaCollection.aggregate(pipeline).toArray();
        case 7:
          results = _context3.sent;
          return _context3.abrupt("return", results);
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](1);
          throw new Error(_context3.t0);
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 11]]);
  }));
  return function getTvShowList(_x4) {
    return _ref5.apply(this, arguments);
  };
}();
var findMediaByTmdbId = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(tmdb_id, media_type) {
    var mediaCollection;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          mediaCollection = (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME);
          _context4.next = 3;
          return mediaCollection.findOne({
            tmdb_id: tmdb_id,
            media_type: media_type
          });
        case 3:
          return _context4.abrupt("return", _context4.sent);
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function findMediaByTmdbId(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();
var findById = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(mediaId) {
    var result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOne({
            _id: new _mongodb.ObjectId(mediaId)
          });
        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", result);
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          throw new Error(_context5.t0);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function findById(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
var update = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref8) {
    var mediaId,
      media_type,
      updateData,
      options,
      session,
      result,
      _args6 = arguments;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          mediaId = _ref8.mediaId, media_type = _ref8.media_type, updateData = _ref8.updateData;
          options = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
          // Lấy session từ options
          session = options.session;
          _context6.prev = 3;
          _context6.next = 6;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOneAndUpdate({
            _id: new _mongodb.ObjectId(mediaId),
            media_type: media_type
          }, {
            // Dùng $set để cập nhật các trường trong updateData
            $set: _objectSpread(_objectSpread({}, updateData), {}, {
              updatedAt: new Date()
            })
          }, {
            returnDocument: 'after',
            // Trả về document sau khi cập nhật
            session: session // <-- Thêm session vào đây
          });
        case 6:
          result = _context6.sent;
          if (result) {
            _context6.next = 9;
            break;
          }
          throw new Error("Kh\xF4ng t\xECm th\u1EA5y ".concat(media_type, " v\u1EDBi ID n\xE0y \u0111\u1EC3 c\u1EADp nh\u1EADt."));
        case 9:
          return _context6.abrupt("return", result);
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](3);
          throw new Error(_context6.t0);
        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[3, 12]]);
  }));
  return function update(_x8) {
    return _ref9.apply(this, arguments);
  };
}();
var deleteOneById = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(mediaId) {
    var options,
      session,
      result,
      _args7 = arguments;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
          session = options.session;
          _context7.prev = 2;
          _context7.next = 5;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOneAndDelete({
            _id: new _mongodb.ObjectId(mediaId)
          }, {
            session: session
          });
        case 5:
          result = _context7.sent;
          return _context7.abrupt("return", result);
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](2);
          throw new Error(_context7.t0);
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[2, 9]]);
  }));
  return function deleteOneById(_x9) {
    return _ref10.apply(this, arguments);
  };
}();
var getMovieByTmdbIdForUser = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref11) {
    var tmdbId, result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          tmdbId = _ref11.tmdbId;
          _context8.prev = 1;
          _context8.next = 4;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOne({
            tmdb_id: +tmdbId,
            status: 'published',
            media_type: 'movie'
          }, {
            projection: {
              _id: 1,
              title: 1,
              poster_path: 1,
              video_links: 1,
              subtitle_links: 1,
              createdAt: 1,
              updatedAt: 1
            }
          });
        case 4:
          result = _context8.sent;
          return _context8.abrupt("return", result);
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](1);
          throw new Error(_context8.t0.message || 'Failed to fetch media');
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[1, 8]]);
  }));
  return function getMovieByTmdbIdForUser(_x10) {
    return _ref12.apply(this, arguments);
  };
}();
var getEpisodeForUser = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_ref13) {
    var tmdbId, seasonNumber, episodeNumber, episodeId, _result$seasons, _season$episodes, result, season, episode;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          tmdbId = _ref13.tmdbId, seasonNumber = _ref13.seasonNumber, episodeNumber = _ref13.episodeNumber, episodeId = _ref13.episodeId;
          _context9.prev = 1;
          _context9.next = 4;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOne({
            tmdb_id: +tmdbId,
            status: 'published',
            media_type: 'tv'
          }, {
            projection: {
              name: 1,
              poster_path: 1,
              'seasons.season_number': 1,
              'seasons.episodes': 1
            }
          });
        case 4:
          result = _context9.sent;
          if (result) {
            _context9.next = 7;
            break;
          }
          throw new Error('TV show not found or not available');
        case 7:
          // Tìm season
          season = (_result$seasons = result.seasons) === null || _result$seasons === void 0 ? void 0 : _result$seasons.find(function (s) {
            return s.season_number === seasonNumber;
          });
          if (season) {
            _context9.next = 10;
            break;
          }
          throw new Error('Season not found');
        case 10:
          // Tìm episode với nhiều điều kiện
          episode = (_season$episodes = season.episodes) === null || _season$episodes === void 0 ? void 0 : _season$episodes.find(function (e) {
            return e.episode_number === episodeNumber && e.episode_id === episodeId;
          });
          if (episode) {
            _context9.next = 13;
            break;
          }
          throw new Error('Episode not found');
        case 13:
          return _context9.abrupt("return", {
            poster_path: result.poster_path,
            season_number: seasonNumber,
            episode_id: episode.episode_id,
            episode_number: episode.episode_number,
            name: episode.name,
            video_links: episode.video_links,
            subtitle_links: episode.subtitle_links
          });
        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](1);
          throw new Error(_context9.t0.message || 'Failed to fetch episode');
        case 19:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 16]]);
  }));
  return function getEpisodeForUser(_x11) {
    return _ref14.apply(this, arguments);
  };
}();
var videoMediaModel = {
  MEDIA_COLLECTION_NAME: MEDIA_COLLECTION_NAME,
  createMovie: createMovie,
  getMovieList: getMovieList,
  findMediaByTmdbId: findMediaByTmdbId,
  findById: findById,
  update: update,
  deleteOneById: deleteOneById,
  //Tv show
  createTvShow: createTvShow,
  getTvShowList: getTvShowList,
  getMovieByTmdbIdForUser: getMovieByTmdbIdForUser,
  getEpisodeForUser: getEpisodeForUser
};
exports.videoMediaModel = videoMediaModel;