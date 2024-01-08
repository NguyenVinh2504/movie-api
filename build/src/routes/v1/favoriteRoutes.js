"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.favoriteRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _favoriteController = require("../../controllers/favoriteController");
var _token = _interopRequireDefault(require("../../middlewares/token.middleware"));
var _favoriteValidation = require("../../validations/favoriteValidation");
/* eslint-disable no-console */

var Router = _express["default"].Router({
  mergeParams: true
});
// /user/delete
Router.route('/').post(_token["default"].auth, _favoriteValidation.favoriteValidation.createFavorite, _favoriteController.favoriteController.addFavorite);
Router.route('/:id')["delete"](_token["default"].auth, _favoriteValidation.favoriteValidation.deleteFavorite, _favoriteController.favoriteController.removeFavorite);
var favoriteRoutes = Router;
exports.favoriteRoutes = favoriteRoutes;