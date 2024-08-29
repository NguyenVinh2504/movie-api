"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _environment = require("../config/environment");
var baseUrl = _environment.env.TMDB_BASE_URL;
var key = _environment.env.TMDB_KEY;
var getUrl = function getUrl(endpoint, params) {
  var qs = new URLSearchParams(params);
  return "".concat(baseUrl).concat(endpoint, "?api_key=").concat(key, "&").concat(qs, "&language=en-US");
};
var _default = {
  getUrl: getUrl
};
exports["default"] = _default;