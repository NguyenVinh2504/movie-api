"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tvShowIdSchema = exports.paginationSchema = exports.adminValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _joi = _interopRequireDefault(require("joi"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _validators = require("../utils/validators");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var mediaActionSchema = _joi["default"].object({
  mediaId: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).required().messages({
    'any.required': 'mediaId là trường bắt buộc.',
    'string.pattern.base': _validators.OBJECT_ID_RULE_MESSAGE
  })
});
var tvShowIdSchema = _joi["default"].object({
  tvShowId: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).required().messages({
    'any.required': 'tvShowId là trường bắt buộc.',
    'string.pattern.base': _validators.OBJECT_ID_RULE_MESSAGE
  })
});
exports.tvShowIdSchema = tvShowIdSchema;
var episodeActionSchema = tvShowIdSchema.concat(_joi["default"].object({
  episodeId: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).required().messages({
    'any.required': 'episodeId là trường bắt buộc.',
    'string.pattern.base': _validators.OBJECT_ID_RULE_MESSAGE
  })
}));
var paginationSchema = _joi["default"].object({
  page: _joi["default"].number().integer().min(1)["default"](1).messages({
    'number.base': '"page" phải là số',
    'number.min': '"page" phải lớn hơn hoặc bằng 1',
    'number.integer': '"page" phải là số nguyên'
  }),
  pageSize: _joi["default"].number().integer().min(1)["default"](10).messages({
    'number.base': '"pageSize" phải là số',
    'number.min': '"pageSize" phải lớn hơn hoặc bằng 1',
    'number.integer': '"pageSize" phải là số nguyên'
  })
});
exports.paginationSchema = paginationSchema;
var getMediaList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition, value;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          correctCondition = paginationSchema;
          _context.prev = 1;
          _context.next = 4;
          return correctCondition.validateAsync(req.query, {
            abortEarly: false
          });
        case 4:
          value = _context.sent;
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          req.query = value;
          next();
          _context.next = 12;
          break;
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context.t0.message));
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 9]]);
  }));
  return function getMediaList(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var linkSchema = _joi["default"].object({
  label: _joi["default"].string().trim().min(1).required().messages({
    'any.required': 'Trường "label" là bắt buộc cho mỗi link.',
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: _joi["default"].string().trim().uri().required().messages({
    'any.required': 'Trường "url" là bắt buộc cho mỗi link.',
    'string.uri': 'Trường "url" phải là một đường dẫn URL hợp lệ.'
  })
});
var MediaBaseSchema = _joi["default"].object({
  // --- Các trường bắt buộc ---
  /**
   * ID của phim từ The Movie Database (TMDB).
   * Bắt buộc, phải là số nguyên dương.
   */
  tmdb_id: _joi["default"].number().integer().positive().required().messages({
    'any.required': 'tmdb_id là trường bắt buộc.',
    'number.base': 'tmdb_id phải là một số.',
    'number.integer': 'tmdb_id phải là số nguyên.',
    'number.positive': 'tmdb_id phải là số nguyên dương.'
  }),
  // --- Các trường tùy chọn ---
  /**
   * Đường dẫn đến ảnh poster.
   * Không bắt buộc, nhưng nếu có phải là một chuỗi.
   * Cho phép giá trị là null hoặc chuỗi rỗng.
   */
  poster_path: _joi["default"].string().uri({
    allowRelative: true
  }).optional().allow(null, '').messages({
    'string.uri': 'Poster_path phải là một đường dẫn URI hợp lệ.'
  }),
  /**
   * Trạng thái của phim.
   * Bắt buộc, và chỉ chấp nhận một trong hai giá trị: 'published' hoặc 'draft'.
   */
  status: _joi["default"].string().valid('published', 'draft').required().messages({
    'any.required': 'status là trường bắt buộc.',
    'any.only': 'status chỉ có thể là "published" hoặc "draft".'
  })
});
var validateMediaAction = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return mediaActionSchema.validateAsync(req.params, {
            abortEarly: false
          });
        case 3:
          next();
          _context2.next = 9;
          break;
        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context2.t0.message));
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return function validateMediaAction(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var createMovie = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          correctCondition = MediaBaseSchema.keys({
            // --- Các trường bắt buộc ---
            /**
             * Tên (tiêu đề) của phim.
             * Bắt buộc, là chuỗi và không được rỗng sau khi đã cắt khoảng trắng.
             */
            title: _joi["default"].string().trim().min(1).required().messages({
              'any.required': 'title là trường bắt buộc.',
              'string.empty': 'title không được để trống.'
            }),
            /**
             * Mảng chứa các link video.
             * Phải là một mảng và mỗi phần tử phải tuân thủ linkSchema.
             */
            video_links: _joi["default"].array().items(linkSchema).required().messages({
              'array.base': 'video_links phải là một mảng.'
            }),
            /**
             * Mảng chứa các link phụ đề.
             * Phải là một mảng và mỗi phần tử phải tuân thủ linkSchema.
             */
            subtitle_links: _joi["default"].array().items(linkSchema).required().messages({
              'array.base': 'subtitle_links phải là một mảng.'
            })
          });
          _context3.prev = 1;
          _context3.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context3.next = 10;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context3.t0.message));
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 7]]);
  }));
  return function createMovie(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var updateMovie = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          correctCondition = _joi["default"].object({
            status: _joi["default"].string().valid('published', 'draft').required(),
            video_links: _joi["default"].array().items(linkSchema).required(),
            subtitle_links: _joi["default"].array().items(linkSchema).required(),
            poster_path: _joi["default"].string().uri({
              allowRelative: true
            }).required().allow(null, '').messages({
              'string.uri': 'Poster_path phải là một đường dẫn URI hợp lệ.'
            }),
            title: _joi["default"].string().trim().min(1).required().messages({
              'any.required': 'title là trường bắt buộc.',
              'string.empty': 'title không được để trống.'
            })
          });
          _context4.prev = 1;
          _context4.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context4.next = 10;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context4.t0.message));
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return function updateMovie(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

// Sub‑schema cho Episode
// const EpisodeSchema = Joi.object({
//   episode_number: Joi.number().integer().positive().required(),
//   episode_id: Joi.number().integer().positive().required(),
//   name: Joi.string().trim().min(1).required(),
//   video_links: Joi.array().items(linkSchema).required(),
//   subtitle_links: Joi.array().items(linkSchema).required()
// })

// Sub‑schema cho Season
// const SeasonSchema = Joi.object({
//   season_number: Joi.number().integer().positive().required(),
//   episodes: Joi.array().items(EpisodeSchema).required()
// })

var createTvShow = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          correctCondition = MediaBaseSchema.keys({
            /**
             * Tên (tiêu đề) của phim.
             * Bắt buộc, là chuỗi và không được rỗng sau khi đã cắt khoảng trắng.
             */
            name: _joi["default"].string().trim().min(1).required().messages({
              'any.required': 'name là trường bắt buộc.',
              'string.empty': 'name không được để trống.'
            })
            // seasons: Joi.array().items(SeasonSchema).required().messages({
            //   'array.base': 'seasons phải là một mảng.'
            // })
          });
          _context5.prev = 1;
          _context5.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context5.t0.message));
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return function createTvShow(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var updateTvShow = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          correctCondition = _joi["default"].object({
            status: _joi["default"].string().valid('published', 'draft').required(),
            poster_path: _joi["default"].string().uri({
              allowRelative: true
            }).required().allow(null, '').messages({
              'string.uri': 'Poster_path phải là một đường dẫn URI hợp lệ.'
            }),
            name: _joi["default"].string().trim().min(1).required().messages({
              'any.required': 'name là trường bắt buộc.',
              'string.empty': 'name không được để trống.'
            })
          });
          _context6.prev = 1;
          _context6.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context6.t0.message));
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 7]]);
  }));
  return function updateTvShow(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();
var addEpisode = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var episodeSchema;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          episodeSchema = _joi["default"].object({
            season_number: _joi["default"].number().integer().positive().required(),
            episode_number: _joi["default"].number().integer().positive().required(),
            episode_id: _joi["default"].number().integer().positive().required(),
            name: _joi["default"].string().trim().min(1).required(),
            video_links: _joi["default"].array().items(linkSchema).required(),
            subtitle_links: _joi["default"].array().items(linkSchema).required()
          }).concat(tvShowIdSchema);
          _context7.prev = 1;
          _context7.next = 4;
          return episodeSchema.validateAsync(_objectSpread(_objectSpread({}, req.params), req.body), {
            abortEarly: false
          });
        case 4:
          next();
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context7.t0.message));
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 7]]);
  }));
  return function addEpisode(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();
var getEpisodeList = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var finalSchema, validatedData;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          finalSchema = tvShowIdSchema.concat(paginationSchema);
          _context8.prev = 1;
          _context8.next = 4;
          return finalSchema.validateAsync(_objectSpread(_objectSpread({}, req.params), req.query), {
            abortEarly: false,
            allowUnknown: true
          });
        case 4:
          validatedData = _context8.sent;
          // Gán lại dữ liệu đã được validate và có giá trị default
          req.query.page = validatedData.page;
          req.query.pageSize = validatedData.pageSize;
          next();
          _context8.next = 13;
          break;
        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context8.t0.message));
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[1, 10]]);
  }));
  return function getEpisodeList(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();
var validateEpisodeAction = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return episodeActionSchema.validateAsync(req.params, {
            abortEarly: false
          });
        case 3:
          next();
          _context9.next = 9;
          break;
        case 6:
          _context9.prev = 6;
          _context9.t0 = _context9["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context9.t0.message));
        case 9:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 6]]);
  }));
  return function validateEpisodeAction(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();
var updateEpisode = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          // Schema bây giờ giống hệt với schema khi tạo mới
          correctCondition = _joi["default"].object({
            name: _joi["default"].string().trim().min(1).required(),
            season_number: _joi["default"].number().integer().positive().required(),
            episode_number: _joi["default"].number().integer().required(),
            // Chấp nhận cả số 0
            episode_id: _joi["default"].number().integer().positive().required(),
            video_links: _joi["default"].array().items(linkSchema).required(),
            subtitle_links: _joi["default"].array().items(linkSchema).required()
          });
          _context10.prev = 1;
          _context10.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context10.next = 10;
          break;
        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context10.t0.message));
        case 10:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[1, 7]]);
  }));
  return function updateEpisode(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();
var getEpisodeDetailsByTmdbId = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var schema;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          schema = _joi["default"].object({
            episodeTmdbId: _joi["default"].number().integer().positive().required()
          }).concat(tvShowIdSchema);
          _context11.prev = 1;
          _context11.next = 4;
          return schema.validateAsync(_objectSpread(_objectSpread({}, req.params), req.query), {
            abortEarly: false
          });
        case 4:
          next();
          _context11.next = 10;
          break;
        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context11.t0.message));
        case 10:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[1, 7]]);
  }));
  return function getEpisodeDetailsByTmdbId(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();
var adminValidation = {
  getMediaList: getMediaList,
  validateMediaAction: validateMediaAction,
  //Movie
  createMovie: createMovie,
  updateMovie: updateMovie,
  //Tv Show
  createTvShow: createTvShow,
  updateTvShow: updateTvShow,
  //Episode
  addEpisode: addEpisode,
  getEpisodeList: getEpisodeList,
  validateEpisodeAction: validateEpisodeAction,
  updateEpisode: updateEpisode,
  getEpisodeDetailsByTmdbId: getEpisodeDetailsByTmdbId
};
exports.adminValidation = adminValidation;