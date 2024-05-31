"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _userModel = require("../models/userModel");
var _formatters = require("../utils/formatters");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _environment = require("../config/environment");
var _hashPassword = _interopRequireDefault(require("../utils/hashPassword"));
var _validationsPassword = _interopRequireDefault(require("../utils/validationsPassword"));
var _jwt = require("../helpers/jwt.helper");
var _authModel = require("../models/authModel");
var _token = _interopRequireDefault(require("../middlewares/token.middleware"));
var _generateKey3 = _interopRequireDefault(require("../utils/generateKey"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _findKeyTokenById = _interopRequireDefault(require("../utils/findKeyTokenById"));
var _excluded = ["confirmPassword"],
  _excluded2 = ["name", "confirmPassword", "avatar"];
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var signUp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var checkEmail, hashed, _req$body, confirmPassword, option, newUser, user, _generateKey, publicKey, privateKey, keyStore, accessToken, _refreshToken;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _userModel.userModel.getEmail(req.body.email);
        case 3:
          checkEmail = _context.sent;
          if (!checkEmail) {
            _context.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, {
            name: 'EMAIL',
            message: 'Email đã được đăng ký'
          });
        case 6:
          _context.next = 8;
          return (0, _hashPassword["default"])(req.body.password);
        case 8:
          hashed = _context.sent;
          // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
          _req$body = req.body, confirmPassword = _req$body.confirmPassword, option = (0, _objectWithoutProperties2["default"])(_req$body, _excluded); // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
          newUser = _objectSpread(_objectSpread({}, option), {}, {
            password: hashed,
            slug: (0, _formatters.slugify)(req.body.name),
            userName: "@".concat((0, _formatters.formatUserName)(req.body.name)),
            temporaryAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=".concat((0, _formatters.formatUserName)(req.body.name))
          }); // Truyền dữ liệu đã xử lí vào model
          _context.next = 13;
          return _authModel.authModel.signUp(newUser);
        case 13:
          user = _context.sent;
          if (!user) {
            _context.next = 28;
            break;
          }
          // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          //   modulusLength: 4096,
          //   publicKeyEncoding: {
          //     type: 'pkcs1',
          //     format: 'pem'
          //   },
          //   privateKeyEncoding: {
          //     type: 'pkcs1',
          //     format: 'pem'
          //   }
          // })
          // Tạo privateKey và publicKey mới cho user
          _generateKey = (0, _generateKey3["default"])(), publicKey = _generateKey.publicKey, privateKey = _generateKey.privateKey; // Thêm vào db để lưu privateKey và publicKey
          _context.next = 18;
          return _authModel.authModel.createKeyToken({
            userId: user._id.toString(),
            privateKey: privateKey,
            publicKey: publicKey
          });
        case 18:
          keyStore = _context.sent;
          // Tạo accessToken và refreshToken bằng privateKey và publicKey
          accessToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.publicKey,
            tokenLife: '10s'
          });
          _refreshToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.privateKey,
            tokenLife: '365d'
          }); // Thêm accessToken và refreshToke vào db
          _context.next = 23;
          return _authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: _refreshToken
          });
        case 23:
          _context.next = 25;
          return _authModel.authModel.addAccessToken({
            userId: user._id.toString(),
            accessToken: accessToken
          });
        case 25:
          res.cookie('refreshToken', _refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 31557600000,
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          user.password = undefined;
          return _context.abrupt("return", _objectSpread({
            accessToken: accessToken,
            refreshToken: _refreshToken
          }, user));
        case 28:
          _context.next = 33;
          break;
        case 30:
          _context.prev = 30;
          _context.t0 = _context["catch"](0);
          throw _context.t0;
        case 33:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 30]]);
  }));
  return function signUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var loginGoogle = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var checkEmail, accessToken, _refreshToken2, hashed, _req$body2, name, confirmPassword, avatar, option, newUser, user, _accessToken, _refreshToken3;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _userModel.userModel.getEmail(req.body.email);
        case 3:
          checkEmail = _context2.sent;
          if (!checkEmail) {
            _context2.next = 15;
            break;
          }
          accessToken = _jwt.jwtHelper.generateToken({
            user: checkEmail,
            tokenSecret: _environment.env.ACCESS_TOKEN_SECRET,
            tokenLife: '10s'
          });
          _refreshToken2 = _jwt.jwtHelper.generateToken({
            user: checkEmail,
            tokenSecret: _environment.env.REFRESH_TOKEN_SECRET,
            tokenLife: '365d'
          });
          _context2.next = 9;
          return _authModel.authModel.addRefreshToken({
            userId: checkEmail._id.toString(),
            refreshToken: _refreshToken2
          });
        case 9:
          _context2.next = 11;
          return _authModel.authModel.addAccessToken({
            userId: checkEmail._id.toString(),
            accessToken: accessToken
          });
        case 11:
          res.cookie('refreshToken', _refreshToken2, {
            httpOnly: true,
            secure: true,
            path: '/',
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          return _context2.abrupt("return", _objectSpread({
            accessToken: accessToken,
            refreshToken: _refreshToken2
          }, checkEmail));
        case 15:
          _context2.next = 17;
          return (0, _hashPassword["default"])(req.body.password);
        case 17:
          hashed = _context2.sent;
          // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
          _req$body2 = req.body, name = _req$body2.name, confirmPassword = _req$body2.confirmPassword, avatar = _req$body2.avatar, option = (0, _objectWithoutProperties2["default"])(_req$body2, _excluded2); // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
          newUser = _objectSpread(_objectSpread({
            name: name,
            temporaryAvatar: avatar
          }, option), {}, {
            password: hashed,
            slug: (0, _formatters.slugify)(name),
            userName: "@".concat((0, _formatters.formatUserName)(name))
          }); // Truyền dữ liệu đã xử lí vào model
          _context2.next = 22;
          return _authModel.authModel.signUp(newUser);
        case 22:
          user = _context2.sent;
          // Tạo accessToken
          _accessToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: _environment.env.ACCESS_TOKEN_SECRET,
            tokenLife: '10s'
          });
          _refreshToken3 = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: _environment.env.REFRESH_TOKEN_SECRET,
            tokenLife: '365d'
          });
          _context2.next = 27;
          return _authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: _refreshToken3
          });
        case 27:
          _context2.next = 29;
          return _authModel.authModel.addAccessToken({
            userId: checkEmail._id.toString(),
            accessToken: _accessToken
          });
        case 29:
          res.cookie('refreshToken', _refreshToken3, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 31557600000,
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          user.password = undefined;
          return _context2.abrupt("return", _objectSpread({
            accessToken: _accessToken,
            refreshToken: _refreshToken3
          }, user));
        case 32:
          _context2.next = 37;
          break;
        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;
        case 37:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 34]]);
  }));
  return function loginGoogle(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var user, validations, keyStore, _generateKey2, publicKey, privateKey, accessToken, _refreshToken4;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _userModel.userModel.getEmail(req.body.email);
        case 3:
          user = _context3.sent;
          if (user) {
            _context3.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, {
            name: 'EMAIL',
            message: 'Không tìm thấy email'
          });
        case 6:
          _context3.next = 8;
          return (0, _validationsPassword["default"])({
            id: user._id,
            password: req.body.password
          });
        case 8:
          validations = _context3.sent;
          if (validations) {
            _context3.next = 11;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, {
            name: 'PASSWORD',
            message: 'Mật khẩu không chính xác'
          });
        case 11:
          user.password = undefined;
          if (!(user && validations)) {
            _context3.next = 31;
            break;
          }
          _context3.next = 15;
          return _authModel.authModel.getKeyToken(user._id.toString());
        case 15:
          keyStore = _context3.sent;
          if (keyStore) {
            _context3.next = 20;
            break;
          }
          _generateKey2 = (0, _generateKey3["default"])(), publicKey = _generateKey2.publicKey, privateKey = _generateKey2.privateKey;
          _context3.next = 20;
          return _authModel.authModel.createKeyToken({
            userId: user._id.toString(),
            privateKey: privateKey,
            publicKey: publicKey
          });
        case 20:
          _context3.next = 22;
          return _authModel.authModel.getKeyToken(user._id.toString());
        case 22:
          keyStore = _context3.sent;
          accessToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.publicKey,
            tokenLife: '10s'
          });
          _refreshToken4 = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.privateKey,
            tokenLife: '365d'
          });
          _context3.next = 27;
          return _authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: _refreshToken4
          });
        case 27:
          _context3.next = 29;
          return _authModel.authModel.addAccessToken({
            userId: user._id.toString(),
            accessToken: accessToken
          });
        case 29:
          res.cookie('refreshToken', _refreshToken4, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 31557600000,
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          return _context3.abrupt("return", _objectSpread(_objectSpread({}, user), {}, {
            accessToken: accessToken,
            refreshToken: _refreshToken4
          }));
        case 31:
          _context3.next = 36;
          break;
        case 33:
          _context3.prev = 33;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;
        case 36:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 33]]);
  }));
  return function login(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var refreshToken = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$headers$authoriz, _keyStore$refreshToke, decoded, keyStore, _refreshToken5, access_token, checkToken, user, newAccessToken, newRefreshToken;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // const refreshToken = req.cookies.refreshToken
          decoded = req.decoded;
          keyStore = req.keyStore;
          _refreshToken5 = req.refreshToken;
          access_token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', ''); // refreshToken gửi lên đã được sử dụng để refreshToken chưa
          if (!((_keyStore$refreshToke = keyStore.refreshTokensUsed) !== null && _keyStore$refreshToke !== void 0 && _keyStore$refreshToke.includes(_refreshToken5))) {
            _context4.next = 7;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Có gì đó không ổn. Đăng nhập lại!');
        case 7:
          _context4.next = 9;
          return _authModel.authModel.getRefreshToken(_refreshToken5);
        case 9:
          checkToken = _context4.sent;
          if (checkToken) {
            _context4.next = 12;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy Refresh Token');
        case 12:
          _context4.next = 14;
          return _userModel.userModel.getInfo(decoded._id);
        case 14:
          user = _context4.sent;
          if (user) {
            _context4.next = 17;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy user');
        case 17:
          _context4.next = 19;
          return _authModel.authModel.deleteRefreshToken(_refreshToken5);
        case 19:
          _context4.next = 21;
          return _authModel.authModel.deleteAccessToken(access_token);
        case 21:
          // Tạo accessToken và refreshToken bằng privateKey và publicKey của user trong db
          newAccessToken = _jwt.jwtHelper.generateToken({
            user: decoded,
            tokenSecret: keyStore.publicKey,
            tokenLife: '10s'
          });
          newRefreshToken = _jwt.jwtHelper.generateToken({
            user: decoded,
            tokenSecret: keyStore.privateKey,
            exp: decoded.exp
          });
          _context4.next = 25;
          return _authModel.authModel.addRefreshToken({
            userId: decoded._id,
            refreshToken: newRefreshToken
          });
        case 25:
          _context4.next = 27;
          return _authModel.authModel.addAccessToken({
            userId: decoded._id,
            accessToken: newAccessToken
          });
        case 27:
          _context4.next = 29;
          return _authModel.authModel.updateKeyToken({
            userId: decoded._id,
            refreshToken: _refreshToken5
          });
        case 29:
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          return _context4.abrupt("return", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          });
        case 33:
          _context4.prev = 33;
          _context4.t0 = _context4["catch"](0);
          throw _context4.t0;
        case 36:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 33]]);
  }));
  return function refreshToken(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var logout = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$headers$authoriz2, access_token;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          // Xóa refreshToken ở cookie
          res.clearCookie('refreshToken');
          // Xóa refreshToken ở db
          _context5.next = 4;
          return _authModel.authModel.deleteRefreshToken(req.cookies.refreshToken);
        case 4:
          // await authModel.deleteRefreshToken(req.body.refreshToken)
          access_token = (_req$headers$authoriz2 = req.headers['authorization']) === null || _req$headers$authoriz2 === void 0 ? void 0 : _req$headers$authoriz2.replace('Bearer ', ''); // Xóa accessToken ở db
          _context5.next = 7;
          return _authModel.authModel.deleteAccessToken(access_token);
        case 7:
          _context5.next = 12;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          throw _context5.t0;
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function logout(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var authService = {
  signUp: signUp,
  loginGoogle: loginGoogle,
  login: login,
  refreshToken: refreshToken,
  logout: logout
};
exports.authService = authService;