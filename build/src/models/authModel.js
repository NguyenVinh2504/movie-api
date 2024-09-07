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
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

var joiPassword = _joi["default"].extend(_joiPassword.joiPasswordExtendCore);
var USER_COLLECTION_NAME = 'users';
var REFRESH_TOKEN_COLLECTION_NAME = 'refreshToken';
var PUBLIC_KEY_COLLECTION_NAME = 'publicKey';
var ACCESS_TOKEN_COLLECTION_NAME = 'accessToken';
var USER_COLLECTION_SCHEMA = _joi["default"].object({
  name: _joi["default"].string().required().label('name').messages({
    'any.required': '{#label} Chưa nhập tên đăng nhập'
  }),
  slug: _joi["default"].string().required(),
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
  createdAt: _joi["default"].date().iso()["default"](function () {
    return new Date();
  }),
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
var PUBLIC_KEY_COLLECTION_SCHEMA = _joi["default"].object({
  userId: _joi["default"].string().allow('').required().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE),
  privateKey: _joi["default"].string(),
  publicKey: _joi["default"].string(),
  refreshTokensUsed: _joi["default"].array()["default"]([])
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
var createKeyToken = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
    var userId, privateKey, publicKey, validData, filter, update, option, tokens;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          userId = _ref3.userId, privateKey = _ref3.privateKey, publicKey = _ref3.publicKey;
          _context3.next = 3;
          return PUBLIC_KEY_COLLECTION_SCHEMA.validateAsync({
            userId: userId,
            privateKey: privateKey,
            publicKey: publicKey
          }, {
            abortEarly: false
          });
        case 3:
          validData = _context3.sent;
          _context3.prev = 4;
          filter = {
            userId: validData.userId
          };
          update = {
            $set: {
              privateKey: validData.privateKey,
              publicKey: validData.publicKey
            }
          };
          option = {
            upsert: true,
            "new": true,
            returnDocument: 'after'
          };
          _context3.next = 10;
          return (0, _mongodb.GET_DB)().collection(PUBLIC_KEY_COLLECTION_NAME).findOneAndUpdate(filter, update, option);
        case 10:
          tokens = _context3.sent;
          return _context3.abrupt("return", tokens);
        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](4);
          throw new Error(_context3.t0);
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[4, 14]]);
  }));
  return function createKeyToken(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var getKeyToken = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(userId) {
    var user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _mongodb.GET_DB)().collection(PUBLIC_KEY_COLLECTION_NAME).findOne({
            userId: userId
          });
        case 3:
          user = _context4.sent;
          return _context4.abrupt("return", user);
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
  return function getKeyToken(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var updateKeyToken = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref6) {
    var userId, refreshToken, user;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          userId = _ref6.userId, refreshToken = _ref6.refreshToken;
          _context5.prev = 1;
          _context5.next = 4;
          return (0, _mongodb.GET_DB)().collection(PUBLIC_KEY_COLLECTION_NAME).updateOne({
            userId: userId
          }, {
            $addToSet: {
              refreshTokensUsed: refreshToken
            }
          });
        case 4:
          user = _context5.sent;
          return _context5.abrupt("return", user);
        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](1);
          throw new Error(_context5.t0);
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 8]]);
  }));
  return function updateKeyToken(_x6) {
    return _ref7.apply(this, arguments);
  };
}();
var deleteKeyToken = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(userId) {
    var user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return (0, _mongodb.GET_DB)().collection(PUBLIC_KEY_COLLECTION_NAME).deleteOne({
            userId: userId
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
  return function deleteKeyToken(_x7) {
    return _ref8.apply(this, arguments);
  };
}();
var addRefreshToken = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data) {
    var validData, user;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return REFRESH_TOKEN_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validData = _context7.sent;
          _context7.next = 6;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).insertOne(_objectSpread(_objectSpread({}, validData), {}, {
            createdAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          }));
        case 6:
          user = _context7.sent;
          (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).createIndex({
            createdAt: 1
          }, {
            expireAfterSeconds: 10
          });
          return _context7.abrupt("return", user);
        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          throw new Error(_context7.t0);
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 11]]);
  }));
  return function addRefreshToken(_x8) {
    return _ref9.apply(this, arguments);
  };
}();
var findByRefreshTokensUsed = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(refreshToken) {
    var user;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).findOne({
            refreshTokensUsed: refreshToken
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
  return function findByRefreshTokensUsed(_x9) {
    return _ref10.apply(this, arguments);
  };
}();
var addAccessToken = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(data) {
    var validData, user;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return ACCESS_TOKEN_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validData = _context9.sent;
          _context9.next = 6;
          return (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).insertOne(_objectSpread(_objectSpread({}, validData), {}, {
            createdAt: new Date(new Date().setHours(new Date().getHours() + 1.5))
          }));
        case 6:
          user = _context9.sent;
          (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).createIndex({
            createdAt: 1
          }, {
            expireAfterSeconds: 10
          });
          return _context9.abrupt("return", user);
        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          throw new Error(_context9.t0);
        case 14:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 11]]);
  }));
  return function addAccessToken(_x10) {
    return _ref11.apply(this, arguments);
  };
}();
var getAccessToken = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(data) {
    var user;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).findOne({
            accessToken: data
          });
        case 3:
          user = _context10.sent;
          return _context10.abrupt("return", user);
        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);
          throw new Error(_context10.t0);
        case 10:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 7]]);
  }));
  return function getAccessToken(_x11) {
    return _ref12.apply(this, arguments);
  };
}();
var deleteAccessToken = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(data) {
    var user;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return (0, _mongodb.GET_DB)().collection(ACCESS_TOKEN_COLLECTION_NAME).deleteOne({
            accessToken: data
          });
        case 3:
          user = _context11.sent;
          return _context11.abrupt("return", user);
        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          throw new Error(_context11.t0);
        case 10:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 7]]);
  }));
  return function deleteAccessToken(_x12) {
    return _ref13.apply(this, arguments);
  };
}();
var getRefreshToken = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(data) {
    var user;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).findOne({
            refreshToken: data
          });
        case 3:
          user = _context12.sent;
          return _context12.abrupt("return", user);
        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          throw new Error(_context12.t0);
        case 10:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 7]]);
  }));
  return function getRefreshToken(_x13) {
    return _ref14.apply(this, arguments);
  };
}();
var deleteRefreshToken = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(data) {
    var user;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return (0, _mongodb.GET_DB)().collection(REFRESH_TOKEN_COLLECTION_NAME).deleteOne({
            refreshToken: data
          });
        case 3:
          user = _context13.sent;
          return _context13.abrupt("return", user);
        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13["catch"](0);
          throw new Error(_context13.t0);
        case 10:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 7]]);
  }));
  return function deleteRefreshToken(_x14) {
    return _ref15.apply(this, arguments);
  };
}();
var authModel = {
  USER_COLLECTION_NAME: USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA: USER_COLLECTION_SCHEMA,
  signUp: signUp,
  getKeyToken: getKeyToken,
  createKeyToken: createKeyToken,
  updateKeyToken: updateKeyToken,
  deleteKeyToken: deleteKeyToken,
  addAccessToken: addAccessToken,
  getAccessToken: getAccessToken,
  deleteAccessToken: deleteAccessToken,
  addRefreshToken: addRefreshToken,
  findByRefreshTokensUsed: findByRefreshTokensUsed,
  deleteRefreshToken: deleteRefreshToken,
  getRefreshToken: getRefreshToken
};
exports.authModel = authModel;