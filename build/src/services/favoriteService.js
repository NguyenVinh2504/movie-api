"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.favoriteService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _favoriteModel = require("../models/favoriteModel");
var _userModel = require("../models/userModel");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } /* eslint-disable no-unused-vars */ /* eslint-disable no-useless-catch */
var addFavorite = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req) {
    var dataReq, newFavorite, userId, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataReq = _objectSpread({
            userId: req.user._id
          }, req.body);
          _context.next = 4;
          return _favoriteModel.favoriteModel.addFavorite(dataReq);
        case 4:
          newFavorite = _context.sent;
          // console.log(addFavorite);
          userId = addFavorite.userId;
          _context.next = 8;
          return _userModel.userModel.getInfo(userId);
        case 8:
          user = _context.sent;
          return _context.abrupt("return", {
            favorites: [newFavorite]
          });
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          throw _context.t0;
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 12]]);
  }));
  return function addFavorite(_x) {
    return _ref.apply(this, arguments);
  };
}();
var removeFavorite = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var req, favoriteId, idUser, retult;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          req = _ref2.req, favoriteId = _ref2.favoriteId;
          _context2.prev = 1;
          idUser = req.user._id;
          _context2.next = 5;
          return _favoriteModel.favoriteModel.deleteOneById({
            idUser: idUser,
            favoriteId: favoriteId
          });
        case 5:
          retult = _context2.sent;
          return _context2.abrupt("return", retult);
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          throw _context2.t0;
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 9]]);
  }));
  return function removeFavorite(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var favoriteService = {
  addFavorite: addFavorite,
  removeFavorite: removeFavorite
};
exports.favoriteService = favoriteService;