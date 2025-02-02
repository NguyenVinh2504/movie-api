"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _videoController = require("../../controllers/videoController");
var _token = _interopRequireDefault(require("../../middlewares/token.middleware"));
var Router = _express["default"].Router({
  mergeParams: true
});
Router.route('/movie/:mediaId').get(_videoController.videoController.getMovieVideo);
Router.route('/tv/:mediaId/:episodeId/:seasonNumber/:episodeNumber').get(_videoController.videoController.getTvVideo);
var videoRoute = Router;
exports.videoRoute = videoRoute;