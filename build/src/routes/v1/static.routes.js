"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.staticRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _mediaUpload = require("../../controllers/mediaUpload.controller");
var _wrapRequestHandler = _interopRequireDefault(require("../../utils/wrapRequestHandler"));
var Router = _express["default"].Router();
Router.get('/image/:name', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.serveImage));
Router.get('/video-stream/:name', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.serveVideoStream));
Router.get('/video-hls/:id/master.m3u8', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.serveM3u8));
Router.get('/video-hls/:id/:v/:segment', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.serveSegment));
Router.get('/subtitle/:id/:name', (0, _wrapRequestHandler["default"])(_mediaUpload.mediaUploadController.serveSubtitle));
var staticRoute = Router;
exports.staticRoute = staticRoute;