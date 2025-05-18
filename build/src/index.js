"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _cors2 = require("./config/cors.js");
var _asyncExitHook = _interopRequireDefault(require("async-exit-hook"));
var _mongodb = require("./config/mongodb.js");
var _index = _interopRequireDefault(require("./routes/v1/index.js"));
var _environment = require("./config/environment.js");
var _errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware.js");
var _httpStatusCodes = require("http-status-codes");
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _file = require("./utils/file.js");
var _http = require("http");
var _socket = require("socket.io");
var _constants = require("./utils/constants.js");
var _axios = _interopRequireDefault(require("axios"));
/* eslint-disable no-console */

var START_SERVER = function START_SERVER() {
  var app = (0, _express["default"])();
  var httpServer = (0, _http.createServer)(app);
  var io = new _socket.Server(httpServer, {
    cors: {
      origin: _constants.WHITELIST_DOMAINS,
      credentials: true
    }
  });
  io.on('connection', function (socket) {
    console.log('Socket connected with user have id: ', socket.id);

    // Lắng nghe sự kiện khi client gửi lên server
    socket.on('addComment', function (newComment) {
      io.to("".concat(newComment.movieId, "-").concat(newComment.movieType)).emit('newComment', newComment);
    });
    // // Lắng nghe sự kiện người dùng tham gia room movie
    socket.on('joinMovieRoom', function (idRoom) {
      socket.join(idRoom); // Tham gia room tương ứng với movieId

      console.log("User with socket id ".concat(socket.id, " joined room ").concat(idRoom));
    });
    socket.on('leaveMovieRoom', function (idRoom) {
      socket.leave(idRoom);
      console.log("User with socket id ".concat(socket.id, " leaved room ").concat(idRoom));
    });
    socket.on('disconnect', function () {
      console.log('Socket disconnected with user have id: ', socket.id);
    });
  });
  //Tạo folder upload
  (0, _file.initFolder)();
  app.use(function (req, res, next) {
    req.io = io;
    next();
  });

  // Bat req cookie
  app.use((0, _cookieParser["default"])());

  // Xử lý cors
  app.use((0, _cors["default"])(_cors2.corsOptions));

  // Bật req.body json data
  app.use(_express["default"].json());

  // Use APIS V1
  app.use('/api/v1', _index["default"]);
  app.use(_express["default"].urlencoded({
    extended: false
  }));

  // Not found API
  app.use('/', function (req, res) {
    res.status(_httpStatusCodes.StatusCodes.NOT_FOUND).json({
      status: _httpStatusCodes.StatusCodes.NOT_FOUND,
      message: 'Not Found'
    });
  });

  //Middleware xử lý lỗi tập trung
  app.use(_errorHandlingMiddleware.errorHandlingMiddleware);
  if (_environment.env.BUILD_MODE === 'production') {
    setInterval(function () {
      _axios["default"].get(_environment.env.BASE_URL).then(function () {
        // console.log('Server is awake')
      })["catch"](function () {
        // console.log(error)
      });
    }, 1000 * 60 * 1);
  }
  if (_environment.env.BUILD_MODE === 'production') {
    httpServer.listen(process.env.PORT, function () {
      // eslint-disable-next-line no-console
      console.log("3.Hello production ".concat(_environment.env.AUTHOR, ", Back-end Server \u0111ang ch\u1EA1y th\xE0nh c\xF4ng t\u1EA1i Port: ").concat(process.env.PORT));
    });
  } else {
    httpServer.listen(_environment.env.LOCAL_DEV_APP_PORT, _environment.env.LOCAL_DEV_APP_HOST, function () {
      // eslint-disable-next-line no-console
      console.log("3.Hello ".concat(_environment.env.AUTHOR, ", Back-end Server \u0111ang ch\u1EA1y th\xE0nh c\xF4ng t\u1EA1i Host: http://").concat(_environment.env.LOCAL_DEV_APP_HOST, ":").concat(_environment.env.LOCAL_DEV_APP_PORT, "/"));
    });
  }

  //thực hiện các tác vụ clean up trước khi dừng server
  (0, _asyncExitHook["default"])(function () {
    console.log('4.Đang ngắt kết nối....');
    (0, _mongodb.CLOSE_DB)();
    console.log('4.Đã ngắt kết nối');
  });
};
console.log('1.Đang kết.....');
// Chỉ khi kết nối database thành công mới start server
(0, _mongodb.CONNECT_DB)().then(function () {
  return console.log('2.Kết nối cloud thành công');
}).then(function () {
  return START_SERVER();
})["catch"](function (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(0);
});