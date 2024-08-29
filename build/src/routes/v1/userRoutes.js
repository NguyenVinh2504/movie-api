"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _userValidation = require("../../validations/userValidation");
var _userController = require("../../controllers/userController");
var _token = _interopRequireDefault(require("../../middlewares/token.middleware"));
var _multerFile = require("../../utils/multerFile");
/* eslint-disable no-console */

var Router = _express["default"].Router({
  mergeParams: true
});
// /user/delete
Router.route('/delete').patch(_token["default"].auth, _userValidation.userValidation.deleteUser, _userController.userController.deleteUser);

// /user/update-password
Router.route('/update-password').patch(_token["default"].auth, _userValidation.userValidation.updatePassword, _userController.userController.updatePassword);
// /user/update-profile
Router.route('/update-profile').post(_token["default"].auth, _multerFile.uploadMulter.single('imageAvatar'), _userValidation.userValidation.updateProfile, _userController.userController.updateProfile);
// /user/info
Router.route('/info').get(_token["default"].auth, _userController.userController.getInfo);
Router.route('/check-email').post(_userValidation.userValidation.sendGmail, _userController.userController.checkEmail);
Router.route('/send-email').post(_userValidation.userValidation.sendGmail, _userController.userController.sendEmail);
Router.route('/forgot-password').post(_userValidation.userValidation.forgotPassword, _userController.userController.forgotPassword);
var userRoutes = Router;
exports.userRoutes = userRoutes;