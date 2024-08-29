"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediasUploadRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _mediaUpload = require("../../controllers/mediaUpload.controller");
var _multerFile = require("../../utils/multerFile");
var _wrapRequestHandler = _interopRequireDefault(require("../../utils/wrapRequestHandler"));
var Router = _express["default"].Router();
Router.post('/upload-image', _multerFile.uploadMulter.array('image'), (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.uploadImage));
Router.post('/upload-video', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.uploadVideo));
Router.post('/upload-video-hls', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.uploadVideoHls));
Router.get('/video-status/:id', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.videoStatus));
var mediasUploadRoutes = Router;
exports.mediasUploadRoutes = mediasUploadRoutes;