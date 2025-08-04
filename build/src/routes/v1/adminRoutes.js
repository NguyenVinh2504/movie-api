"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _adminController = require("../../controllers/adminController");
var _adminValidation = require("../../validations/adminValidation");
var _token = _interopRequireDefault(require("../../middlewares/token.middleware"));
var _isAdmin = require("../../middlewares/isAdmin");
var Router = _express["default"].Router({
  mergeParams: true
});

/* --- Movie Routes --- */
Router.route('/movies').post(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.createMovie, _adminController.adminController.createMovie) // POST: Đăng một movie mới
.get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.getMediaList, _adminController.adminController.getMovieList); // GET: Lấy danh sách các movie

Router.route('/movies/:mediaId').get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateMediaAction, _adminController.adminController.getMediaById) // GET: Lấy thông tin movie theo ID
.put(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateMediaAction, _adminValidation.adminValidation.updateMovie, _adminController.adminController.updateMovie) // PUT: Cập nhật thông tin movie theo ID
["delete"](_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateMediaAction, _adminController.adminController.deleteMedia); // DELETE: Xóa movie theo ID

/* --- TvShow Routes --- */
Router.route('/tv-shows').post(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.createTvShow, _adminController.adminController.createTvShow) // POST: Đăng một tv show mới
.get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.getMediaList, _adminController.adminController.getTvShowList); // GET: Lấy danh sách các tv show

Router.route('/tv-shows/:mediaId').get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateMediaAction, _adminController.adminController.getMediaById) // GET: Lấy thông tin tv show theo ID
.put(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateMediaAction, _adminValidation.adminValidation.updateTvShow, _adminController.adminController.updateTvShow) // PUT: Cập nhật thông tin tv show theo ID
["delete"](_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateMediaAction, _adminController.adminController.deleteMedia); // DELETE: Xóa tv show theo ID

/* --- Episode Routes --- */
Router.route('/tv-shows/:tvShowId/episodes').post(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.addEpisode, _adminController.adminController.addEpisode).get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.getEpisodeList, _adminController.adminController.getEpisodeList);
Router.route('/tv-shows/:tvShowId/episodes/lookup').get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.getEpisodeDetailsByTmdbId, _adminController.adminController.getEpisodeDetailsByTmdbId);
Router.route('/tv-shows/:tvShowId/episodes/:episodeId').get(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateEpisodeAction,
// Middleware validate mới
_adminController.adminController.getEpisodeDetails // Controller mới
).put(_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateEpisodeAction, _adminValidation.adminValidation.updateEpisode, _adminController.adminController.updateEpisode)["delete"](_token["default"].auth, _isAdmin.isAdmin, _adminValidation.adminValidation.validateEpisodeAction,
// Middleware validate mới
_adminController.adminController.deleteEpisode // Controller mới
);

var adminRoute = Router;
exports.adminRoute = adminRoute;