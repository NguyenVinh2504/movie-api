"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("../config/mongodb");
var _joiPassword = require("joi-password");
var _userModel = require("./userModel");
var _validators = require("../utils/validators");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } // import { ObjectId } from 'mongodb'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

var joiPassword = _joi["default"].extend(_joiPassword.joiPasswordExtendCore);
var USER_COLLECTION_NAME = 'users';
var REFRESH_TOKEN_COLLECTION_NAME = 'refreshToken';
var ACCESS_TOKEN_COLLECTION_NAME = 'accessToken';
var USER_COLLECTION_SCHEMA = _joi["default"].object({
  name: _joi["default"].string().required().label('name').messages({
    'any.required': '{#label} Chưa nhập tên đăng nhập'
  }),
  slug: _joi["default"].string().min(3).required(),
  // favoriteIds: Joi.array().items(
  //   Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  // ).default([]),
  temporaryAvatar: _joi["default"].string()["default"](null),
  avatar: _joi["default"].string()["default"](null),
  email: _joi["default"].string().email().required('This is required').label('Email').messages({
    'string.email': '{#label} Sai định dạng email',
    'any.required': '{#label} Email chưa nhập'
  }).external( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(value, help) {
      var user;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _userModel.userModel.getEmail(value);
          case 2:
            user = _context.sent;
            if (!user) {
              _context.next = 5;
              break;
            }
            return _context.abrupt("return", help.message('ISEXISTS'));
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()),
  password: joiPassword.string().min(8).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters().required().label('Mật khẩu').messages({
    'any.required': 'Chưa nhập {#label}',
    'string.min': '{#label} chứa ít nhất 8 kí tự',
    'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
    'password.minOfSpecialCharacters': '{#label} nên chứa kí tự đặc biệt',
    'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
    'password.minOfNumeric': '{#label} nên chứa chữ số',
    'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
    'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
  }),
  phone: _joi["default"].number()["default"](null),
  userName: _joi["default"].string(),
  createdAt: _joi["default"].date().timestamp('javascript')["default"](Date.now),
  admin: _joi["default"]["boolean"]()["default"](false),
  _destroy: _joi["default"]["boolean"]()["default"](false)
});
var REFRESH_TOKEN_COLLECTION_SCHEMA = _joi["default"].object({
  userId: _joi["default"].string().allow('').required().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE),
  refreshToken: _joi["default"].string().allow('').required()
});
var ACCESS_TOKEN_COLLECTION_SCHEMA = _joi["default"].object({
  userId: _joi["default"].string().allow('').required().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE),
  accessToken: _joi["default"].string().allow('').required()
});
var signUp = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var validData, user, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return USER_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validData = _context2.sent;
          _context2.prev = 3;
          _context2.next = 6;
          return (0, _mongodb.GET_DB)().collection(USER_COLLECTION_NAME).insertOne(validData);
        case 6:
          user = _context2.sent;
          _context2.next = 9;
          return _userModel.userModel.getIdUser(user.insertedId);
        case 9:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](3);
          throw new Error(_context2.t0);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 13]]);
  }));
  return function signUp(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var addRefreshToken = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var validData, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return REFRESH_TOKEN_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validData = _context3.sent;
          _context3.next = 6;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).insertOne(_objectSpread(_objectSpread({}, validData), {}, {
            createdAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          }));
        case 6:
          user = _context3.sent;
          (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).createIndex({
            createdAt: 1
          }, {
            expireAfterSeconds: 10
          });
          return _context3.abrupt("return", user);
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          throw new Error(_context3.t0);
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 11]]);
  }));
  return function addRefreshToken(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var addAccessToken = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    var validData, user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return ACCESS_TOKEN_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validData = _context4.sent;
          _context4.next = 6;
          return (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).insertOne(_objectSpread(_objectSpread({}, validData), {}, {
            createdAt: new Date(new Date().setMinutes(new Date().getMinutes() + 32))
            // , createdAt: new Date(new Date().setSeconds(new Date().getSeconds()))
          }));
        case 6:
          user = _context4.sent;
          (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).createIndex({
            createdAt: 1
          }, {
            expireAfterSeconds: 10
          });
          return _context4.abrupt("return", user);
        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          throw new Error(_context4.t0);
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 11]]);
  }));
  return function addAccessToken(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var getAccessToken = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
    var user;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).findOne({
            accessToken: data
          });
        case 3:
          user = _context5.sent;
          return _context5.abrupt("return", user);
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
  return function getAccessToken(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteAccessToken = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
    var user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).deleteOne({
            accessToken: data
          });
        case 3:
          user = _context6.sent;
          return _context6.abrupt("return", user);
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          throw new Error(_context6.t0);
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function deleteAccessToken(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
var getRefreshToken = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data) {
    var user;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).findOne({
            refreshToken: data
          });
        case 3:
          user = _context7.sent;
          return _context7.abrupt("return", user);
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          throw new Error(_context7.t0);
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function getRefreshToken(_x8) {
    return _ref7.apply(this, arguments);
  };
}();
var deleteRefreshToken = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data) {
    var user;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).deleteOne({
            refreshToken: data
          });
        case 3:
          user = _context8.sent;
          return _context8.abrupt("return", user);
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          throw new Error(_context8.t0);
        case 10:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function deleteRefreshToken(_x9) {
    return _ref8.apply(this, arguments);
  };
}();
var authModel = {
  USER_COLLECTION_NAME: USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA: USER_COLLECTION_SCHEMA,
  signUp: signUp,
  addAccessToken: addAccessToken,
  getAccessToken: getAccessToken,
  deleteAccessToken: deleteAccessToken,
  addRefreshToken: addRefreshToken,
  deleteRefreshToken: deleteRefreshToken,
  getRefreshToken: getRefreshToken
};
exports.authModel = authModel;