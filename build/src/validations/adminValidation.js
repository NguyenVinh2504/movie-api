"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _joi = _interopRequireDefault(require("joi"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var paginationValidation = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition, value;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          correctCondition = _joi["default"].object({
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
  return function paginationValidation(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var linkSchema = _joi["default"].object({
  label: _joi["default"].string().trim().min(1).required().messages({
    'any.required': 'Trường "label" là bắt buộc cho mỗi link.',
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: _joi["default"].string().uri().required().messages({
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
var createMovie = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
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
          _context2.prev = 1;
          _context2.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
          next();
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _context2.t0.message));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function createMovie(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateMovie = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
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
          _context3.prev = 1;
          _context3.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
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
  return function updateMovie(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

// Sub‑schema cho Episode
var EpisodeSchema = _joi["default"].object({
  episode_number: _joi["default"].number().integer().required(),
  episode_id: _joi["default"].number().integer().positive().required(),
  name: _joi["default"].string().trim().min(1).required(),
  video_links: _joi["default"].array().items(linkSchema).required(),
  subtitle_links: _joi["default"].array().items(linkSchema).required()
});

// Sub‑schema cho Season
var SeasonSchema = _joi["default"].object({
  season_number: _joi["default"].number().integer().positive().required(),
  episodes: _joi["default"].array().items(EpisodeSchema).required()
});
var createTvShow = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          correctCondition = MediaBaseSchema.keys({
            /**
             * Tên (tiêu đề) của phim.
             * Bắt buộc, là chuỗi và không được rỗng sau khi đã cắt khoảng trắng.
             */
            name: _joi["default"].string().trim().min(1).required().messages({
              'any.required': 'name là trường bắt buộc.',
              'string.empty': 'name không được để trống.'
            }),
            seasons: _joi["default"].array().items(SeasonSchema).required().messages({
              'array.base': 'seasons phải là một mảng.'
            })
          });
          _context4.prev = 1;
          _context4.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
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
  return function createTvShow(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
var updateTvShow = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
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
            }),
            seasons: _joi["default"].array().items(SeasonSchema).required().messages({
              'array.base': 'seasons phải là một mảng.'
            })
          });
          _context5.prev = 1;
          _context5.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
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
  return function updateTvShow(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var adminValidation = {
  //Movie
  createMovie: createMovie,
  updateMovie: updateMovie,
  //Tv Show
  createTvShow: createTvShow,
  updateTvShow: updateTvShow,
  paginationValidation: paginationValidation
};
exports.adminValidation = adminValidation;