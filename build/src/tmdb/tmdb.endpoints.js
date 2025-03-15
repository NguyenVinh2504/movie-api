"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _tmdbConfig = _interopRequireDefault(require("./tmdb.config.js"));
var tmdbEndpoints = {
  mediaList: function mediaList(_ref) {
    var mediaType = _ref.mediaType,
      mediaCategory = _ref.mediaCategory,
      page = _ref.page;
    return _tmdbConfig["default"].getUrl("".concat(mediaType, "/").concat(mediaCategory), {
      page: page
    });
  },
  mediaTrending: function mediaTrending(_ref2) {
    var mediaType = _ref2.mediaType,
      timeWindow = _ref2.timeWindow,
      page = _ref2.page;
    return _tmdbConfig["default"].getUrl("trending/".concat(mediaType, "/").concat(timeWindow), {
      page: page
    });
  },
  discoverGenres: function discoverGenres(_ref3) {
    var mediaType = _ref3.mediaType,
      with_genres = _ref3.with_genres,
      page = _ref3.page;
    return _tmdbConfig["default"].getUrl("discover/".concat(mediaType), {
      with_genres: with_genres,
      page: page
    });
  },
  mediaDetail: function mediaDetail(_ref4) {
    var mediaType = _ref4.mediaType,
      mediaId = _ref4.mediaId,
      append_to_response = _ref4.append_to_response;
    return _tmdbConfig["default"].getUrl("".concat(mediaType, "/").concat(mediaId), {
      append_to_response: append_to_response
    });
  },
  mediaSeasonDetail: function mediaSeasonDetail(_ref5) {
    var series_id = _ref5.series_id,
      season_number = _ref5.season_number;
    return _tmdbConfig["default"].getUrl("tv/".concat(series_id, "/season/").concat(season_number));
  },
  mediaGenres: function mediaGenres(_ref6) {
    var mediaType = _ref6.mediaType;
    return _tmdbConfig["default"].getUrl("genre/".concat(mediaType, "/list"));
  },
  mediaCredits: function mediaCredits(_ref7) {
    var mediaType = _ref7.mediaType,
      mediaId = _ref7.mediaId;
    return _tmdbConfig["default"].getUrl("".concat(mediaType, "/").concat(mediaId, "/credits"));
  },
  mediaVideos: function mediaVideos(_ref8) {
    var mediaType = _ref8.mediaType,
      mediaId = _ref8.mediaId;
    return _tmdbConfig["default"].getUrl("".concat(mediaType, "/").concat(mediaId, "/videos"));
  },
  mediaRecommend: function mediaRecommend(_ref9) {
    var mediaType = _ref9.mediaType,
      mediaId = _ref9.mediaId;
    return _tmdbConfig["default"].getUrl("".concat(mediaType, "/").concat(mediaId, "/recommendations"));
  },
  mediaImages: function mediaImages(_ref10) {
    var mediaType = _ref10.mediaType,
      mediaId = _ref10.mediaId;
    return _tmdbConfig["default"].getUrl("".concat(mediaType, "/").concat(mediaId, "/images"));
  },
  mediaSearch: function mediaSearch(_ref11) {
    var mediaType = _ref11.mediaType,
      query = _ref11.query,
      page = _ref11.page;
    return _tmdbConfig["default"].getUrl("search/".concat(mediaType), {
      query: query,
      page: page
    });
  },
  personDetail: function personDetail(_ref12) {
    var personId = _ref12.personId;
    return _tmdbConfig["default"].getUrl("person/".concat(personId));
  },
  personMedias: function personMedias(_ref13) {
    var personId = _ref13.personId;
    return _tmdbConfig["default"].getUrl("person/".concat(personId, "/combined_credits"));
  },
  searchKeyword: function searchKeyword(_ref14) {
    var query = _ref14.query;
    var qs = new URLSearchParams({
      query: query
    });
    return "https://www.themoviedb.org/search/trending?".concat(qs, "&language=en-US");
  }
};
var _default = tmdbEndpoints;
exports["default"] = _default;