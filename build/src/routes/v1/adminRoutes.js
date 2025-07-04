"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _adminController = require("../../controllers/adminController");
var _adminValidation = require("../../validations/adminValidation");
var Router = _express["default"].Router({
  mergeParams: true
});

/* --- Movie Routes --- */
Router.route('/movies').post(_adminValidation.adminValidation.createMovie, _adminController.adminController.createMovie) // POST: Đăng một movie mới
.get(_adminValidation.adminValidation.paginationValidation, _adminController.adminController.getMovieList); // GET: Lấy danh sách các movie

Router.route('/movies/:mediaId').get(_adminController.adminController.getMediaById) // GET: Lấy thông tin movie theo ID
.put(_adminValidation.adminValidation.updateMovie, _adminController.adminController.updateMovie) // PUT: Cập nhật thông tin movie theo ID
["delete"](_adminController.adminController.deleteMedia); // DELETE: Xóa movie theo ID

/* --- TvShow Routes --- */
Router.route('/tv-shows').post(_adminValidation.adminValidation.createTvShow, _adminController.adminController.createTvShow) // POST: Đăng một tv show mới
.get(_adminValidation.adminValidation.paginationValidation, _adminController.adminController.getTvShowList); // GET: Lấy danh sách các tv show

Router.route('/tv-shows/:mediaId').get(_adminController.adminController.getMediaById) // GET: Lấy thông tin tv show theo ID
.put(_adminValidation.adminValidation.updateTvShow, _adminController.adminController.updateTvShow) // PUT: Cập nhật thông tin tv show theo ID
["delete"](_adminController.adminController.deleteMedia); // DELETE: Xóa tv show theo ID

var adminRoute = Router;
exports.adminRoute = adminRoute;