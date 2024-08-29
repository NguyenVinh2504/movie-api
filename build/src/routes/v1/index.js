"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _httpStatusCodes = require("http-status-codes");
var _userRoutes = require("./userRoutes.js");
var _authRoutes = require("./authRoutes.js");
var _mediaRoute = require("./media.route.js");
var _favoriteRoutes = require("./favoriteRoutes.js");
var _mediasUploadRoutes = require("./mediasUploadRoutes.js");
var _staticRoutes = require("./static.routes.js");
var _constants = require("../../utils/constants.js");
var Router = _express["default"].Router({
  mergeParams: true
});

// Check api v1
Router.get('/status', function (req, res) {
  res.status(_httpStatusCodes.StatusCodes.OK).json({
    message: 'Apis V1 are ready to use'
  });
});

// User APIs
Router.use('/user', _userRoutes.userRoutes);
Router.use('/favorite', _favoriteRoutes.favoriteRoutes);
Router.use('/auth', _authRoutes.authRoutes);
Router.use('/files', _staticRoutes.staticRoute);
Router.use('/files/video', _express["default"]["static"](_constants.UPLOAD_VIDEO_TEMP_DIR));
Router.use('/medias-upload', _mediasUploadRoutes.mediasUploadRoutes);
Router.use('/:mediaType', _mediaRoute.mediaRoute);
var _default = Router;
exports["default"] = _default;