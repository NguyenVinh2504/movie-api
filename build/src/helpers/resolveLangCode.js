"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _langs = _interopRequireDefault(require("langs"));
function resolveLangCode(label) {
  // Tìm theo tên bản địa (local/native name) hoặc tên tiếng Anh (name)
  var lang = _langs["default"].where('local', label) || _langs["default"].where('name', label);

  // Nếu vẫn không tìm thấy, bạn có thể mặc định hoặc trả về null để xử lý sau
  return lang ? lang['1'] : null; // ['1'] là ISO 639-1
}
var _default = resolveLangCode;
exports["default"] = _default;