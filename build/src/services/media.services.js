"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _environment = require("../config/environment");
var _jwt = require("../helpers/jwt.helper");
var _favoriteModel = require("../models/favoriteModel");
var _tmdb = _interopRequireDefault(require("../tmdb/tmdb.api"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var getList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req) {
    var page, _req$params, mediaType, mediaCategory, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          page = req.query.page;
          _req$params = req.params, mediaType = _req$params.mediaType, mediaCategory = _req$params.mediaCategory;
          _context.next = 5;
          return _tmdb["default"].mediaList({
            mediaType: mediaType,
            mediaCategory: mediaCategory,
            page: page
          });
        case 5:
          response = _context.sent;
          return _context.abrupt("return", response);
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function getList(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getTrending = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req) {
    var _req$headers$authoriz, page, _req$params2, mediaType, timeWindow, response, access_token, tokenDecoded, favoriteList, i, j, _response$results$j;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // console.log('trend');
          page = req.query.page;
          _req$params2 = req.params, mediaType = _req$params2.mediaType, timeWindow = _req$params2.timeWindow;
          _context2.next = 5;
          return _tmdb["default"].mediaTrending({
            mediaType: mediaType,
            timeWindow: timeWindow,
            page: page
          });
        case 5:
          response = _context2.sent;
          access_token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', '');
          if (!access_token) {
            _context2.next = 27;
            break;
          }
          tokenDecoded = _jwt.jwtHelper.verifyToken(access_token, _environment.env.ACCESS_TOKEN_SECRET);
          if (!tokenDecoded) {
            _context2.next = 27;
            break;
          }
          _context2.next = 12;
          return _favoriteModel.favoriteModel.findFavorite(tokenDecoded._id);
        case 12:
          favoriteList = _context2.sent;
          i = 0;
        case 14:
          if (!(i < favoriteList.length)) {
            _context2.next = 27;
            break;
          }
          j = 0;
        case 16:
          if (!(j < response.results.length)) {
            _context2.next = 24;
            break;
          }
          if (!(((_response$results$j = response.results[j]) === null || _response$results$j === void 0 ? void 0 : _response$results$j.id) === favoriteList[i].mediaId)) {
            _context2.next = 21;
            break;
          }
          response.results[j].isFavorite = true;
          response.results[j].favoriteId = favoriteList[i]._id;
          return _context2.abrupt("break", 24);
        case 21:
          j++;
          _context2.next = 16;
          break;
        case 24:
          i++;
          _context2.next = 14;
          break;
        case 27:
          return _context2.abrupt("return", response);
        case 30:
          _context2.prev = 30;
          _context2.t0 = _context2["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 33:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 30]]);
  }));
  return function getTrending(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getDiscoverGenres = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req) {
    var _req$query, with_genres, page, mediaType, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // console.log('the loai');
          _req$query = req.query, with_genres = _req$query.with_genres, page = _req$query.page;
          mediaType = req.params.mediaType;
          _context3.next = 5;
          return _tmdb["default"].discoverGenres({
            mediaType: mediaType,
            page: page,
            with_genres: with_genres
          });
        case 5:
          response = _context3.sent;
          return _context3.abrupt("return", response);
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function getDiscoverGenres(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var getGenres = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req) {
    var mediaType, response;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          mediaType = req.params.mediaType;
          _context4.next = 4;
          return _tmdb["default"].mediaGenres({
            mediaType: mediaType
          });
        case 4:
          response = _context4.sent;
          return _context4.abrupt("return", response);
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return function getGenres(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var getDetail = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req) {
    var _req$params3, mediaId, mediaType, append_to_response, response;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          //console.log('detail');
          _req$params3 = req.params, mediaId = _req$params3.mediaId, mediaType = _req$params3.mediaType;
          append_to_response = req.query.append_to_response;
          _context5.next = 5;
          return _tmdb["default"].mediaDetail({
            mediaType: mediaType,
            mediaId: mediaId,
            append_to_response: append_to_response
          });
        case 5:
          response = _context5.sent;
          return _context5.abrupt("return", response);
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function getDetail(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var getDetailSeason = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req) {
    var _req$params4, series_id, season_number, response;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$params4 = req.params, series_id = _req$params4.series_id, season_number = _req$params4.season_number; // console.log(series_id, season_number)
          _context6.next = 4;
          return _tmdb["default"].mediaSeasonDetail({
            series_id: series_id,
            season_number: season_number
          });
        case 4:
          response = _context6.sent;
          return _context6.abrupt("return", response);
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 8]]);
  }));
  return function getDetailSeason(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var search = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req) {
    var _req$query2, query, page, mediaType, response;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$query2 = req.query, query = _req$query2.query, page = _req$query2.page;
          mediaType = req.params.mediaType;
          _context7.next = 5;
          return _tmdb["default"].mediaSearch({
            query: query,
            page: page,
            mediaType: mediaType
          });
        case 5:
          response = _context7.sent;
          return _context7.abrupt("return", response);
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!');
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 9]]);
  }));
  return function search(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
// const search = async (req) => {
//     try {
//       const { mediaType } = req.params
//       const { query, page } = req.query
//       const response = await tmdbApi.mediaSearch({
//         query,
//         page,
//         mediaType: mediaType === 'people' ? 'person' : mediaType
//       })

//       return response
//     } catch {
//       throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
//     }
//   }
var mediaService = {
  getList: getList,
  getTrending: getTrending,
  getDiscoverGenres: getDiscoverGenres,
  getGenres: getGenres,
  getDetail: getDetail,
  getDetailSeason: getDetailSeason,
  search: search
};
exports.mediaService = mediaService;