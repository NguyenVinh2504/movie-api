"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _authValidation = require("../../validations/authValidation");
var _authController = require("../../controllers/authController");
var _token = _interopRequireDefault(require("../../middlewares/token.middleware"));
var Router = _express["default"].Router({
  mergeParams: true
});
Router.route('/signup').post(_authValidation.authValidation.signUp, _authController.authController.signUp);
Router.route('/google-login').post(_authValidation.authValidation.signUp, _authController.authController.loginGoogle);
Router.route('/login').post(_authValidation.authValidation.login, _authController.authController.login);
Router.route('/refresh-token').post(_authController.authController.refreshToken);
Router.route('/logout').post(_token["default"].auth, _authController.authController.logout);
var authRoutes = Router;
exports.authRoutes = authRoutes;