"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mongoClientInstance = exports.GET_DB = exports.CONNECT_DB = exports.CLOSE_DB = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongodb = require("mongodb");
var _environment = require("./environment.js");
var movieAppDatabaseInstance = null;

//Khởi tạo một đối tượng CLient Instrance để connect tới MongoDB
var mongoClientInstance = new _mongodb.MongoClient(_environment.env.MONGODB_URI, {
  serverApi: {
    version: _mongodb.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
exports.mongoClientInstance = mongoClientInstance;
var CONNECT_DB = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return mongoClientInstance.connect();
        case 2:
          //Kết nối thành công thì lấy ra DataBase theo tên và gán vào biến movieAppDatabaseInstance
          movieAppDatabaseInstance = mongoClientInstance.db(_environment.env.DATABASE_NAME);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function CONNECT_DB() {
    return _ref.apply(this, arguments);
  };
}();

// Đảm bảo chỉ luôn gọi cái getDB này sau khi đã kết nối thành công tới MongoDB
exports.CONNECT_DB = CONNECT_DB;
var GET_DB = function GET_DB() {
  if (!movieAppDatabaseInstance) throw new Error('Hãy kết nối đến cơ sở dữ liệu trước');
  return movieAppDatabaseInstance;
};

//Đóng kêt nối tới Database khi cần
exports.GET_DB = GET_DB;
var CLOSE_DB = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return mongoClientInstance.close();
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function CLOSE_DB() {
    return _ref2.apply(this, arguments);
  };
}();
exports.CLOSE_DB = CLOSE_DB;