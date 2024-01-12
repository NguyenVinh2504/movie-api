"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.favoriteModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
var _validators = require("../utils/validators");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var FAVORITE_COLLECTION_NAME = 'favorites';
var FAVORITE_COLLECTION_SCHEMA = _joi["default"].object({
  userId: _joi["default"].string().allow('').required().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE),
  media_type: _joi["default"].string().allow('').valid('tv', 'movie').required(),
  mediaId: _joi["default"].number().allow('').required(),
  title: _joi["default"].string().allow('').required(),
  poster_path: _joi["default"].string().allow('').required(),
  vote_average: _joi["default"].number().allow('').required(),
  release_date: _joi["default"].string().allow('').required()
});
var addFavorite = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var validData, newFavoriteToAdd, favoriteItem, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return FAVORITE_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validData = _context.sent;
          newFavoriteToAdd = _objectSpread(_objectSpread({}, validData), {}, {
            userId: new _mongodb.ObjectId(validData.userId)
          });
          _context.prev = 4;
          _context.next = 7;
          return (0, _mongodb2.GET_DB)().collection(FAVORITE_COLLECTION_NAME).insertOne(newFavoriteToAdd);
        case 7:
          favoriteItem = _context.sent;
          _context.next = 10;
          return (0, _mongodb2.GET_DB)().collection(FAVORITE_COLLECTION_NAME).findOne({
            _id: new _mongodb.ObjectId(favoriteItem.insertedId)
          });
        case 10:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](4);
          throw new Error(_context.t0);
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 14]]);
  }));
  return function addFavorite(_x) {
    return _ref.apply(this, arguments);
  };
}();
var deleteOneById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var idUser, favoriteId, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          idUser = _ref2.idUser, favoriteId = _ref2.favoriteId;
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _mongodb2.GET_DB)().collection(FAVORITE_COLLECTION_NAME).deleteOne({
            _id: new _mongodb.ObjectId(favoriteId)
          });
        case 4:
          _context2.next = 6;
          return findFavorite(idUser);
        case 6:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](1);
          throw new Error(_context2.t0);
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 10]]);
  }));
  return function deleteOneById(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var findFavorite = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(idUser) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _mongodb2.GET_DB)().collection(FAVORITE_COLLECTION_NAME).find({
            userId: new _mongodb.ObjectId(idUser)
          }).toArray();
        case 3:
          result = _context3.sent;
          return _context3.abrupt("return", result);
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw new Error(_context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function findFavorite(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
var favoriteModel = {
  FAVORITE_COLLECTION_NAME: FAVORITE_COLLECTION_NAME,
  FAVORITE_COLLECTION_SCHEMA: FAVORITE_COLLECTION_SCHEMA,
  addFavorite: addFavorite,
  deleteOneById: deleteOneById,
  findFavorite: findFavorite
};
exports.favoriteModel = favoriteModel;