"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoMediaModel = exports.TV_SHOW_INPUT_SCHEMA = exports.MOVIE_INPUT_SCHEMA = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
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
var subtitleLinkSchema = _joi["default"].object({
  lang: _joi["default"].string().trim().lowercase().length(2).allow(null).required().messages({
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

// Sub‑schema cho Episode
exports.MOVIE_INPUT_SCHEMA = MOVIE_INPUT_SCHEMA;
var EpisodeSchema = _joi["default"].object({
  episode_number: _joi["default"].number().integer().required(),
  episode_id: _joi["default"].number().integer().positive().required(),
  name: _joi["default"].string().trim().min(1).required(),
  video_links: _joi["default"].array().items(videoLinkSchema).required(),
  subtitle_links: _joi["default"].array().items(subtitleLinkSchema).required()
});

// Sub‑schema cho Season
var SeasonSchema = _joi["default"].object({
  season_number: _joi["default"].number().integer().required(),
  episodes: _joi["default"].array().items(EpisodeSchema).required()
});

// Schema dành cho TVShow
var TV_SHOW_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: _joi["default"].valid('tv').required(),
  name: _joi["default"].string().trim().min(1).required(),
  seasons: _joi["default"].array().items(SeasonSchema).required()
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
          // Giai đoạn 3: Thêm các trường tính toán
          {
            $addFields: {
              seasonCount: {
                $size: '$seasons'
              },
              episodeCount: {
                $sum: {
                  $map: {
                    input: '$seasons',
                    as: 'season',
                    "in": {
                      $size: '$$season.episodes'
                    }
                  }
                }
              }
            }
          },
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
    var mediaId, media_type, updateData, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          mediaId = _ref8.mediaId, media_type = _ref8.media_type, updateData = _ref8.updateData;
          _context6.prev = 1;
          _context6.next = 4;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOneAndUpdate({
            _id: new _mongodb.ObjectId(mediaId),
            media_type: media_type
          }, {
            $set: updateData
          }, {
            returnDocument: 'after' // Trả về document sau khi cập nhật
          });
        case 4:
          result = _context6.sent;
          if (result) {
            _context6.next = 7;
            break;
          }
          throw 'Có lỗi trong quá trình cập nhật phim';
        case 7:
          return _context6.abrupt("return", result);
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          throw new Error(_context6.t0);
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 10]]);
  }));
  return function update(_x8) {
    return _ref9.apply(this, arguments);
  };
}();
var deleteOneById = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(columnId) {
    var result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).deleteOne({
            _id: new _mongodb.ObjectId(columnId)
          });
        case 3:
          result = _context7.sent;
          return _context7.abrupt("return", result);
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          throw new Error(_context7.t0);
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function deleteOneById(_x9) {
    return _ref10.apply(this, arguments);
  };
}();
var videoMediaModel = {
  createMovie: createMovie,
  getMovieList: getMovieList,
  findMediaByTmdbId: findMediaByTmdbId,
  findById: findById,
  update: update,
  deleteOneById: deleteOneById,
  //Tv show
  createTvShow: createTvShow,
  getTvShowList: getTvShowList
};
exports.videoMediaModel = videoMediaModel;