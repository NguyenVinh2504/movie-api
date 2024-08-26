"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediasUploadRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _mediaUpload = require("../../controllers/mediaUpload.controller");
var Router = _express["default"].Router();
Router.post('/upload-image', _mediaUpload.mediaUploadController.uploadImage);
var mediasUploadRoutes = Router;
exports.mediasUploadRoutes = mediasUploadRoutes;