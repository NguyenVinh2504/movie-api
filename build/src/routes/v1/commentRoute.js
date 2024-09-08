"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _commentController = require("../../controllers/commentController");
var _token = _interopRequireDefault(require("../../middlewares/token.middleware"));
var _wrapRequestHandler = _interopRequireDefault(require("../../utils/wrapRequestHandler"));
var _commentValidation = require("../../validations/commentValidation");
/* eslint-disable no-console */

var Router = _express["default"].Router({
  mergeParams: true
});
// /user/delete
Router.route('/add-comment').post(_token["default"].auth, _commentValidation.commentValidation.addComment, (0, _wrapRequestHandler["default"])(_commentController.commentController.addComment));
Router.route('/get-comment/:movieType/:movieId').get(_commentValidation.commentValidation.paginationValidation, (0, _wrapRequestHandler["default"])(_commentController.commentController.getCommentsByMovieId));
var commentRoutes = Router;
exports.commentRoutes = commentRoutes;