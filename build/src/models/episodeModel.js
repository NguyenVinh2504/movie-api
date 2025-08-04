"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.episodeModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongodb = require("../config/mongodb");
var _joi = _interopRequireDefault(require("joi"));
var _validators = require("../utils/validators");
var _videoMeidaModel = require("./videoMeidaModel");
var _mongodb2 = require("mongodb");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var EpisodeSchema = _joi["default"].object({
  tv_show_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).required().messages({
    'string.pattern.base': _validators.OBJECT_ID_RULE_MESSAGE,
    'any.required': 'tvShowId là trường bắt buộc.'
  }),
  season_number: _joi["default"].number().integer().min(1).required(),
  episode_number: _joi["default"].number().integer().required(),
  episode_id: _joi["default"].number().integer().positive().required(),
  name: _joi["default"].string().trim().min(1).required(),
  video_links: _joi["default"].array().items(_videoMeidaModel.videoLinkSchema).required(),
  subtitle_links: _joi["default"].array().items(_videoMeidaModel.subtitleLinkSchema).required()
});
var EPISODE_COLLECTION_NAME = 'episodes';

// Hàm tạo episode mới
var create = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(episodeData) {
    var options,
      session,
      validatedData,
      now,
      newEpisodeToAdd,
      episodeCollection,
      insertResult,
      createdEpisode,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          session = options.session; // Lấy session từ options
          _context.next = 4;
          return EpisodeSchema.validateAsync(episodeData, {
            abortEarly: false,
            stripUnknown: true
          });
        case 4:
          validatedData = _context.sent;
          now = new Date();
          newEpisodeToAdd = _objectSpread(_objectSpread({}, validatedData), {}, {
            tv_show_id: new _mongodb2.ObjectId(validatedData.tv_show_id),
            createdAt: now,
            updatedAt: now
          });
          episodeCollection = (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME);
          _context.next = 10;
          return episodeCollection.insertOne(newEpisodeToAdd, {
            session: session
          });
        case 10:
          insertResult = _context.sent;
          _context.next = 13;
          return episodeCollection.findOne({
            _id: insertResult.insertedId
          }, {
            session: session
          });
        case 13:
          createdEpisode = _context.sent;
          return _context.abrupt("return", createdEpisode);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function create(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Hàm tìm một episode theo điều kiện
var findOne = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(condition) {
    var options,
      session,
      _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
          session = options.session; // Lấy session từ options
          _context2.next = 4;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).findOne(condition, {
            session: session
          });
        case 4:
          return _context2.abrupt("return", _context2.sent);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function findOne(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Hàm chạy aggregation trên collection episodes
var aggregate = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(pipeline) {
    var options,
      session,
      _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
          session = options.session; // Lấy session từ options
          _context3.next = 4;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).aggregate(pipeline, {
            session: session
          }).toArray();
        case 4:
          return _context3.abrupt("return", _context3.sent);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function aggregate(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var findByTvShow = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(tvShowId, _ref4) {
    var page,
      pageSize,
      options,
      session,
      _results$,
      _results$2,
      skip,
      episodeCollection,
      pipeline,
      results,
      _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          page = _ref4.page, pageSize = _ref4.pageSize;
          options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
          session = options.session;
          _context4.prev = 3;
          skip = (page - 1) * pageSize;
          episodeCollection = (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME);
          pipeline = [
          // Giai đoạn 1: Lọc ra các tập phim của TV show cần tìm
          {
            $match: {
              tv_show_id: new _mongodb2.ObjectId(tvShowId)
            }
          },
          // Giai đoạn 2: Sắp xếp theo thứ tự mùa và tập
          {
            $sort: {
              season_number: 1,
              episode_number: 1
            }
          },
          // Giai đoạn 3 (MỚI): Thêm các trường đếm số lượng link
          {
            $addFields: {
              videoLinkCount: {
                $size: {
                  $ifNull: ['$video_links', []]
                }
              },
              subtitleLinkCount: {
                $size: {
                  $ifNull: ['$subtitle_links', []]
                }
              }
            }
          },
          // Giai đoạn 4 (MỚI): Chỉ lấy các trường cần thiết (loại bỏ các mảng lớn)
          {
            $project: {
              // Bỏ các trường không cần thiết để giảm dung lượng
              video_links: 0,
              subtitle_links: 0,
              updatedAt: 0
            }
          },
          // Giai đoạn 5: Dùng $facet để phân trang và lấy tổng số lượng
          {
            $facet: {
              data: [{
                $skip: skip
              }, {
                $limit: pageSize
              }],
              pagination: [{
                $count: 'totalItems'
              }]
            }
          }];
          _context4.next = 9;
          return episodeCollection.aggregate(pipeline, {
            session: session
          }).toArray();
        case 9:
          results = _context4.sent;
          return _context4.abrupt("return", {
            data: ((_results$ = results[0]) === null || _results$ === void 0 ? void 0 : _results$.data) || [],
            pagination: {
              totalItems: ((_results$2 = results[0]) === null || _results$2 === void 0 || (_results$2 = _results$2.pagination[0]) === null || _results$2 === void 0 ? void 0 : _results$2.totalItems) || 0
            }
          });
        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](3);
          throw new Error(_context4.t0);
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[3, 13]]);
  }));
  return function findByTvShow(_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}();
var findByTmdbId = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref6) {
    var tvShowId, episodeTmdbId;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          tvShowId = _ref6.tvShowId, episodeTmdbId = _ref6.episodeTmdbId;
          _context5.next = 3;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).findOne({
            tv_show_id: new _mongodb2.ObjectId(tvShowId),
            episode_id: +episodeTmdbId
          });
        case 3:
          return _context5.abrupt("return", _context5.sent);
        case 4:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function findByTmdbId(_x6) {
    return _ref7.apply(this, arguments);
  };
}();
var update = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(episodeId, updateData) {
    var options,
      session,
      result,
      _args6 = arguments;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          options = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
          session = options.session;
          _context6.prev = 2;
          _context6.next = 5;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).findOneAndUpdate({
            _id: new _mongodb2.ObjectId(episodeId)
          }, {
            $set: _objectSpread(_objectSpread({}, updateData), {}, {
              updatedAt: new Date()
            })
          }, {
            returnDocument: 'after',
            session: session
          } // Trả về document sau khi cập nhật
          );
        case 5:
          result = _context6.sent;
          return _context6.abrupt("return", result);
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](2);
          throw new Error(_context6.t0);
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[2, 9]]);
  }));
  return function update(_x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}();
var deleteOneById = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(episodeId) {
    var options,
      session,
      result,
      _args7 = arguments;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
          session = options.session; // Lấy session từ options
          _context7.prev = 2;
          _context7.next = 5;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).deleteOne({
            _id: new _mongodb2.ObjectId(episodeId)
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
    return _ref9.apply(this, arguments);
  };
}();
var deleteManyByTvShowId = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(tvShowId) {
    var options,
      session,
      result,
      _args8 = arguments;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          options = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
          session = options.session;
          _context8.prev = 2;
          _context8.next = 5;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).deleteMany({
            tv_show_id: new _mongodb2.ObjectId(tvShowId)
          }, {
            session: session
          });
        case 5:
          result = _context8.sent;
          return _context8.abrupt("return", result);
        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](2);
          throw new Error(_context8.t0);
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[2, 9]]);
  }));
  return function deleteManyByTvShowId(_x10) {
    return _ref10.apply(this, arguments);
  };
}();
var getEpisodeForUser = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_ref11) {
    var tmdbId, seasonNumber, episodeNumber, episodeId, pipeline, result;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          tmdbId = _ref11.tmdbId, seasonNumber = _ref11.seasonNumber, episodeNumber = _ref11.episodeNumber, episodeId = _ref11.episodeId;
          _context9.prev = 1;
          pipeline = [
          // === Giai đoạn 1: Match để tìm các tập phim ứng viên ===
          // Tìm tất cả các tập có season và episode number trùng khớp.
          // Bước này giúp thu hẹp phạm vi tìm kiếm một cách hiệu quả.
          {
            $match: {
              season_number: +seasonNumber,
              episode_number: +episodeNumber,
              episode_id: +episodeId
            }
          },
          // === Giai đoạn 2: Join với collection 'media' (TV Show cha) ===
          // Đây là trái tim của việc join dữ liệu.
          {
            $lookup: {
              from: _videoMeidaModel.videoMediaModel.MEDIA_COLLECTION_NAME,
              // Collection cần join vào
              localField: 'tv_show_id',
              // Trường của collection 'episodes' hiện tại
              foreignField: '_id',
              // Trường của collection 'media' để đối chiếu
              as: 'tvShowInfo' // Tên của mảng mới chứa kết quả join
            }
          },
          // === Giai đoạn 3: "Mở" mảng kết quả join ===
          // Vì mỗi episode chỉ thuộc về 1 TV Show, mảng tvShowInfo sẽ chỉ có 1 phần tử.
          // $unwind sẽ biến mảng đó thành một object để dễ truy cập.
          {
            $unwind: '$tvShowInfo'
          },
          // === Giai đoạn 4: Lọc kết quả sau khi join ===
          // Bây giờ chúng ta có thể lọc dựa trên thông tin của TV Show cha.
          {
            $match: {
              'tvShowInfo.tmdb_id': +tmdbId,
              'tvShowInfo.status': 'published'
            }
          },
          // === Giai đoạn 5: Định hình lại cấu trúc dữ liệu trả về ===
          // Chọn và đổi tên các trường để tạo ra một object "phẳng" và sạch đẹp.
          {
            $project: {
              _id: 0,
              poster_path: '$tvShowInfo.poster_path',
              season_number: '$season_number',
              episode_id: '$episode_id',
              episode_number: '$episode_number',
              name: '$name',
              tv_show: '$tvShowInfo',
              video_links: '$video_links',
              subtitle_links: '$subtitle_links'
            }
          }];
          _context9.next = 5;
          return (0, _mongodb.GET_DB)().collection(EPISODE_COLLECTION_NAME).aggregate(pipeline).toArray();
        case 5:
          result = _context9.sent;
          return _context9.abrupt("return", result[0] || null);
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](1);
          throw new Error(_context9.t0.message || 'Failed to fetch episode');
        case 12:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 9]]);
  }));
  return function getEpisodeForUser(_x11) {
    return _ref12.apply(this, arguments);
  };
}();
var episodeModel = {
  create: create,
  findOne: findOne,
  aggregate: aggregate,
  findByTvShow: findByTvShow,
  findByTmdbId: findByTmdbId,
  deleteOneById: deleteOneById,
  deleteManyByTvShowId: deleteManyByTvShowId,
  update: update,
  getEpisodeForUser: getEpisodeForUser
};
exports.episodeModel = episodeModel;