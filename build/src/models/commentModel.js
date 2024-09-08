"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
var _validators = require("../utils/validators");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var COMMENTS_COLLECTION_NAME = 'comments';
var COMMENTS_COLLECTION_SCHEMA = _joi["default"].object({
  movieId: _joi["default"].string().required(),
  movieType: _joi["default"].string().valid('movie', 'tv').required(),
  userId: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required(),
  content: _joi["default"].string().min(1).max(400).required(),
  createAt: _joi["default"].date().iso()["default"](function () {
    return new Date();
  })
});
var lookup = {
  from: 'users',
  // Collection "users" mà bạn muốn join
  localField: 'userId',
  // Trường trong "comments" tương ứng với user
  foreignField: '_id',
  // Trường trong "users" là _id
  as: 'user' // Tên trường mới chứa thông tin user
};

var unwind = '$user';
var project = {
  _id: 1,
  // Hiển thị _id của comment
  content: 1,
  // Hiển thị nội dung comment
  movieId: 1,
  // Hiển thị movieId
  movieType: 1,
  // Hiển thị movieType
  createAt: 1,
  // Hiện thị thời gian tạo comment
  'user.name': 1,
  // Hiển thị tên người dùng
  'user.avatar': 1,
  // Hiển thị avatar người dùng
  'user.temporaryAvatar': 1 // Hiển thị avatar người dùng
};

var createComment = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var validData, newValidData, db, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return COMMENTS_COLLECTION_SCHEMA.validateAsync(data);
        case 2:
          validData = _context.sent;
          newValidData = _objectSpread(_objectSpread({}, validData), {}, {
            userId: new _mongodb.ObjectId(validData.userId)
          });
          _context.next = 6;
          return (0, _mongodb2.GET_DB)().collection(COMMENTS_COLLECTION_NAME).insertOne(newValidData);
        case 6:
          db = _context.sent;
          _context.next = 9;
          return (0, _mongodb2.GET_DB)().collection(COMMENTS_COLLECTION_NAME).aggregate([{
            $match: {
              _id: new _mongodb.ObjectId(db.insertedId)
            }
          }, {
            $lookup: lookup
          }, {
            $unwind: unwind // Đưa các trường trong "user" ra ngoài tạo thành 1 object thay vì lưu trong mảng với phần tử là object
          }, {
            $project: project
          }]).next();
        case 9:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createComment(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getCommentsByMovieId = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var movieId, movieType, page, limit, skip, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          movieId = _ref2.movieId, movieType = _ref2.movieType, page = _ref2.page, limit = _ref2.limit;
          if (!(typeof movieId !== 'string' || typeof movieType !== 'string')) {
            _context2.next = 3;
            break;
          }
          throw new Error('movieId, movieType phải là string');
        case 3:
          skip = (page - 1) * limit;
          _context2.next = 6;
          return (0, _mongodb2.GET_DB)().collection(COMMENTS_COLLECTION_NAME).aggregate([{
            $match: {
              movieId: movieId,
              movieType: movieType
            }
          }, {
            $lookup: lookup
          }, {
            $unwind: unwind // Đưa các trường trong "user" ra ngoài tạo thành 1 object thay vì lưu trong mảng với phần tử là object
          }, {
            $sort: {
              createAt: -1
            }
          }, {
            $project: project
          }]).skip(skip).limit(limit).toArray();
        case 6:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getCommentsByMovieId(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var countDocument = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _mongodb2.GET_DB)().collection(COMMENTS_COLLECTION_NAME).countDocuments(data);
        case 2:
          return _context3.abrupt("return", _context3.sent);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function countDocument(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
var commentModel = {
  COMMENTS_COLLECTION_NAME: COMMENTS_COLLECTION_NAME,
  COMMENTS_COLLECTION_SCHEMA: COMMENTS_COLLECTION_SCHEMA,
  createComment: createComment,
  getCommentsByMovieId: getCommentsByMovieId,
  countDocument: countDocument
};
exports.commentModel = commentModel;