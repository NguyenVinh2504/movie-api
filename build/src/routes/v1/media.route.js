"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _media = require("../../controllers/media.controller");
var Router = _express["default"].Router({
  mergeParams: true
});

// Router.get('/genres', mediaController.getGenres)

// Router.get('/detail/:mediaId', mediaController.getDetail)

Router.route('/trending/:timeWindow').get(_media.mediaController.getTrending);
// discover/:mediaType
Router.route('/discover').get(_media.mediaController.getDiscoverGenres);
Router.route('/detail/:mediaId').get(_media.mediaController.getDetail);
Router.route('/search').get(_media.mediaController.search);
Router.route('/:mediaCategory').get(_media.mediaController.getList);
Router.route('/:series_id/season/:season_number').get(_media.mediaController.getDetailSeason);
var mediaRoute = Router;
exports.mediaRoute = mediaRoute;