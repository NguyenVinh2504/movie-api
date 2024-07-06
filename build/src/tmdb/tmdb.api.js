"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axiosClient = _interopRequireDefault(require("../axios/axios.client.js"));
var _tmdbEndpoints = _interopRequireDefault(require("./tmdb.endpoints.js"));
var tmdbApi = {
  mediaList: function () {
    var _mediaList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
      var mediaType, mediaCategory, page;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            mediaType = _ref.mediaType, mediaCategory = _ref.mediaCategory, page = _ref.page;
            _context.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaList({
              mediaType: mediaType,
              mediaCategory: mediaCategory,
              page: page
            }));
          case 3:
            return _context.abrupt("return", _context.sent);
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function mediaList(_x) {
      return _mediaList.apply(this, arguments);
    }
    return mediaList;
  }(),
  mediaTrending: function () {
    var _mediaTrending = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
      var mediaType, timeWindow, page;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            mediaType = _ref2.mediaType, timeWindow = _ref2.timeWindow, page = _ref2.page;
            _context2.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaTrending({
              mediaType: mediaType,
              timeWindow: timeWindow,
              page: page
            }));
          case 3:
            return _context2.abrupt("return", _context2.sent);
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function mediaTrending(_x2) {
      return _mediaTrending.apply(this, arguments);
    }
    return mediaTrending;
  }(),
  discoverGenres: function () {
    var _discoverGenres = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
      var mediaType, with_genres, page;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            mediaType = _ref3.mediaType, with_genres = _ref3.with_genres, page = _ref3.page;
            _context3.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].discoverGenres({
              mediaType: mediaType,
              with_genres: with_genres,
              page: page
            }));
          case 3:
            return _context3.abrupt("return", _context3.sent);
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    function discoverGenres(_x3) {
      return _discoverGenres.apply(this, arguments);
    }
    return discoverGenres;
  }(),
  mediaDetail: function () {
    var _mediaDetail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref4) {
      var mediaType, mediaId, append_to_response;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            mediaType = _ref4.mediaType, mediaId = _ref4.mediaId, append_to_response = _ref4.append_to_response;
            _context4.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaDetail({
              mediaType: mediaType,
              mediaId: mediaId,
              append_to_response: append_to_response
            }));
          case 3:
            return _context4.abrupt("return", _context4.sent);
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    function mediaDetail(_x4) {
      return _mediaDetail.apply(this, arguments);
    }
    return mediaDetail;
  }(),
  mediaSeasonDetail: function () {
    var _mediaSeasonDetail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref5) {
      var series_id, season_number;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            series_id = _ref5.series_id, season_number = _ref5.season_number;
            _context5.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaSeasonDetail({
              series_id: series_id,
              season_number: season_number
            }));
          case 3:
            return _context5.abrupt("return", _context5.sent);
          case 4:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    function mediaSeasonDetail(_x5) {
      return _mediaSeasonDetail.apply(this, arguments);
    }
    return mediaSeasonDetail;
  }(),
  mediaGenres: function () {
    var _mediaGenres = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref6) {
      var mediaType;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            mediaType = _ref6.mediaType;
            _context6.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaGenres({
              mediaType: mediaType
            }));
          case 3:
            return _context6.abrupt("return", _context6.sent);
          case 4:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    function mediaGenres(_x6) {
      return _mediaGenres.apply(this, arguments);
    }
    return mediaGenres;
  }(),
  mediaCredits: function () {
    var _mediaCredits = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref7) {
      var mediaType, mediaId;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            mediaType = _ref7.mediaType, mediaId = _ref7.mediaId;
            _context7.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaCredits({
              mediaType: mediaType,
              mediaId: mediaId
            }));
          case 3:
            return _context7.abrupt("return", _context7.sent);
          case 4:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    function mediaCredits(_x7) {
      return _mediaCredits.apply(this, arguments);
    }
    return mediaCredits;
  }(),
  mediaVideos: function () {
    var _mediaVideos = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref8) {
      var mediaType, mediaId;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            mediaType = _ref8.mediaType, mediaId = _ref8.mediaId;
            _context8.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaVideos({
              mediaType: mediaType,
              mediaId: mediaId
            }));
          case 3:
            return _context8.abrupt("return", _context8.sent);
          case 4:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    function mediaVideos(_x8) {
      return _mediaVideos.apply(this, arguments);
    }
    return mediaVideos;
  }(),
  mediaImages: function () {
    var _mediaImages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_ref9) {
      var mediaType, mediaId;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            mediaType = _ref9.mediaType, mediaId = _ref9.mediaId;
            _context9.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaImages({
              mediaType: mediaType,
              mediaId: mediaId
            }));
          case 3:
            return _context9.abrupt("return", _context9.sent);
          case 4:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    function mediaImages(_x9) {
      return _mediaImages.apply(this, arguments);
    }
    return mediaImages;
  }(),
  mediaRecommend: function () {
    var _mediaRecommend = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_ref10) {
      var mediaType, mediaId;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            mediaType = _ref10.mediaType, mediaId = _ref10.mediaId;
            _context10.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaRecommend({
              mediaType: mediaType,
              mediaId: mediaId
            }));
          case 3:
            return _context10.abrupt("return", _context10.sent);
          case 4:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    function mediaRecommend(_x10) {
      return _mediaRecommend.apply(this, arguments);
    }
    return mediaRecommend;
  }(),
  mediaSearch: function mediaSearch(_ref11) {
    var mediaType = _ref11.mediaType,
      query = _ref11.query,
      page = _ref11.page;
    return _axiosClient["default"].get(_tmdbEndpoints["default"].mediaSearch({
      mediaType: mediaType,
      query: query,
      page: page
    }));
  },
  personDetail: function () {
    var _personDetail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(_ref12) {
      var personId;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            personId = _ref12.personId;
            _context11.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].personDetail({
              personId: personId
            }));
          case 3:
            return _context11.abrupt("return", _context11.sent);
          case 4:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    }));
    function personDetail(_x11) {
      return _personDetail.apply(this, arguments);
    }
    return personDetail;
  }(),
  personMedias: function () {
    var _personMedias = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(_ref13) {
      var personId;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            personId = _ref13.personId;
            _context12.next = 3;
            return _axiosClient["default"].get(_tmdbEndpoints["default"].personMedias({
              personId: personId
            }));
          case 3:
            return _context12.abrupt("return", _context12.sent);
          case 4:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));
    function personMedias(_x12) {
      return _personMedias.apply(this, arguments);
    }
    return personMedias;
  }()
};
var _default = tmdbApi;
exports["default"] = _default;