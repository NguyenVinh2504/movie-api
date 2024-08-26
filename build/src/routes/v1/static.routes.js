"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.staticRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _mediaUpload = require("../../controllers/mediaUpload.controller");
var Router = _express["default"].Router();
Router.get('/image/:name', _mediaUpload.mediaUploadController.serveImage);
var staticRoute = Router;
exports.staticRoute = staticRoute;