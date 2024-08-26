"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandlingMiddleware = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _httpStatusCodes = require("http-status-codes");
var _environment = require("../config/environment");
/* eslint-disable no-unused-vars */

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
var errorHandlingMiddleware = function errorHandlingMiddleware(err, req, res, next) {
  // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = _httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  var responseError = {
    statusCode: err.statusCode,
    data: (0, _typeof2["default"])(err.error) === 'object' ? err.error : {
      message: err.error || err.message
    } || _httpStatusCodes.StatusCodes[err.statusCode],
    // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack
  };
  // console.error(responseError)

  // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi. (Muốn hiểu rõ hơn hãy xem video 55 trong bộ MERN Stack trên kênh Youtube: https://www.youtube.com/@trungquandev)
  if (_environment.env.BUILD_MODE !== 'dev') delete responseError.stack;

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
  // ...
  // console.error(responseError)

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError);
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;