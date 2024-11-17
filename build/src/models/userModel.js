"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
var _favoriteModel = require("./favoriteModel");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var USER_COLLECTION_NAME = 'users';
var getUserName = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).findOne({
            name: data
          });
        case 3:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function getUserName(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getEmail = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).aggregate([{
            $match: {
              email: data,
              _destroy: false
            }
          }, {
            $lookup: {
              from: _favoriteModel.favoriteModel.FAVORITE_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'userId',
              as: 'favorites'
            }
          }]).toArray();
        case 3:
          result = _context2.sent;
          return _context2.abrupt("return", result[0] || null);
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw new Error(_context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function getEmail(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getIdUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).aggregate([{
            $match: {
              _id: new _mongodb.ObjectId(data),
              _destroy: false
            }
          }, {
            $lookup: {
              from: _favoriteModel.favoriteModel.FAVORITE_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'userId',
              as: 'favorites'
            }
          }]).toArray();
        case 3:
          result = _context3.sent;
          return _context3.abrupt("return", result[0] || null);
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
  return function getIdUser(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var getInfo = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).aggregate([{
            $match: {
              _id: new _mongodb.ObjectId(data),
              _destroy: false
            }
          }, {
            $lookup: {
              from: _favoriteModel.favoriteModel.FAVORITE_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'userId',
              as: 'favorites'
            }
          }, {
            $project: {
              _id: 0,
              password: 0
            }
          }]).toArray();
        case 3:
          result = _context4.sent;
          return _context4.abrupt("return", result[0] || null);
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          throw new Error(_context4.t0);
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function getInfo(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

// const pushFavorites = async (favorite) => {
//   try {
//     const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(favorite.userId) }, {
//       $push: { favoriteIds: new ObjectId(favorite._id) }
//     }, { returnDocument: 'after' })
//     return result.value
//   } catch (error) {
//     throw new Error(error)
//   }
// }

var deleteUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
    var result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).updateOne({
            _id: new _mongodb.ObjectId(data)
          }, {
            $set: {
              _destroy: true
            }
          });
        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", result);
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          throw new Error(_context5.t0);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function deleteUser(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var updateProfile = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref6) {
    var id, body, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = _ref6.id, body = _ref6.body;
          _context6.prev = 1;
          _context6.next = 4;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).updateOne({
            _id: new _mongodb.ObjectId(id)
          }, {
            $set: _objectSpread({}, body)
          });
        case 4:
          _context6.next = 6;
          return (0, _mongodb2.GET_DB)().collection(USER_COLLECTION_NAME).findOne({
            _id: new _mongodb.ObjectId(id)
          }, {
            projection: {
              password: 0
            }
          });
        case 6:
          result = _context6.sent;
          return _context6.abrupt("return", result);
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          throw new Error(_context6.t0);
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 10]]);
  }));
  return function updateProfile(_x6) {
    return _ref7.apply(this, arguments);
  };
}();
var userModel = {
  USER_COLLECTION_NAME: USER_COLLECTION_NAME,
  getUserName: getUserName,
  getEmail: getEmail,
  getIdUser: getIdUser,
  // pushFavorites,
  deleteUser: deleteUser,
  updateProfile: updateProfile,
  getInfo: getInfo
};
exports.userModel = userModel;