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
var _generateKey5 = _interopRequireDefault(require("../utils/generateKey"));
var _axios = _interopRequireDefault(require("axios"));
var _constants = require("../utils/constants");
var _excluded = ["confirmPassword"];
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
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
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
            _context.next = 34;
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
          _generateKey = (0, _generateKey5["default"])(), publicKey = _generateKey.publicKey, privateKey = _generateKey.privateKey; // Thêm vào db để lưu privateKey và publicKey
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
            tokenLife: _constants.timeExpired
          });
          _refreshToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.privateKey,
            tokenLife: '365d'
          });
          _context.t0 = Promise;
          _context.next = 24;
          return _authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: _refreshToken
          });
        case 24:
          _context.t1 = _context.sent;
          _context.next = 27;
          return _authModel.authModel.addAccessToken({
            userId: user._id.toString(),
            accessToken: accessToken
          });
        case 27:
          _context.t2 = _context.sent;
          _context.t3 = [_context.t1, _context.t2];
          _context.next = 31;
          return _context.t0.all.call(_context.t0, _context.t3);
        case 31:
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
        case 34:
          _context.next = 39;
          break;
        case 36:
          _context.prev = 36;
          _context.t4 = _context["catch"](0);
          throw _context.t4;
        case 39:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 36]]);
  }));
  return function signUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// const loginGoogle = async (req, res) => {
//   try {
//     const checkEmail = await userModel.getEmail(req.body.email)
//     // if (checkEmail) throw new ApiError(StatusCodes.BAD_GATEWAY, 'Email đã được sử dụng. Vui lòng đăng nhập với mật khẩu hoặc sử dụng email khác')
//     if (checkEmail) {
//       const accessToken = jwtHelper.generateToken({ user: checkEmail, tokenSecret: env.ACCESS_TOKEN_SECRET, tokenLife: timeExpired })
//       const refreshToken = jwtHelper.generateToken({ user: checkEmail, tokenSecret: env.REFRESH_TOKEN_SECRET, tokenLife: '365d' })
//       await authModel.addRefreshToken({ userId: checkEmail._id.toString(), refreshToken })
//       await authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
//       res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         path: '/',
//         expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//         sameSite: 'Lax'
//       })
//       return {
//         accessToken,
//         refreshToken,
//         ...checkEmail
//       }
//     } else {
//       // Mã hóa mật khẩu từ phía người dùng nhập vào
//       const hashed = await hashPassword(req.body.password)
//       // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
//       const { name, confirmPassword, avatar, ...option } = req.body
//       // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
//       const newUser = {
//         name,
//         temporaryAvatar: avatar,
//         ...option,
//         password: hashed,
//         slug: slugify(name),
//         userName: `@${formatUserName(name)}`
//       }

//       // Truyền dữ liệu đã xử lí vào model
//       const user = await authModel.signUp(newUser)
//       // Tạo accessToken
//       const accessToken = jwtHelper.generateToken({ user, tokenSecret: env.ACCESS_TOKEN_SECRET, tokenLife: timeExpired })
//       const refreshToken = jwtHelper.generateToken({ user, tokenSecret: env.REFRESH_TOKEN_SECRET, tokenLife: '365d' })
//       await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
//       await authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
//       res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         path: '/',
//         // maxAge: 31557600000,
//         expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//         sameSite: 'Lax'
//       })
//       user.password = undefined
//       return {
//         accessToken,
//         refreshToken,
//         ...user
//       }
//     }
//   } catch (error) {
//     throw error
//   }
// }

var getOauthGoogleToken = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(code) {
    var body, _yield$axios$post, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          body = {
            code: code,
            client_id: _environment.env.CLIENT_ID_GOOGLE,
            redirect_uri: _environment.env.REDIRECT_URI,
            client_secret: _environment.env.CLIENT_SECRET,
            grant_type: 'authorization_code'
          };
          _context2.next = 3;
          return _axios["default"].post('https://oauth2.googleapis.com/token', body, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        case 3:
          _yield$axios$post = _context2.sent;
          data = _yield$axios$post.data;
          return _context2.abrupt("return", data);
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getOauthGoogleToken(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var getGoogleUserInfo = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(access_token, id_token) {
    var _yield$axios$get, data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _axios["default"].get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: "Bearer ".concat(id_token)
            },
            params: {
              access_token: access_token,
              alt: 'json'
            }
          });
        case 2:
          _yield$axios$get = _context3.sent;
          data = _yield$axios$get.data;
          return _context3.abrupt("return", data);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getGoogleUserInfo(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var loginGoogle = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(code, res) {
    var _yield$getOauthGoogle, id_token, access_token, userInfo, checkEmail, keyStore, _generateKey2, publicKey, privateKey, accessToken, _refreshToken2, name, picture, email, sub, hashed, newUser, user, _generateKey3, _publicKey, _privateKey, _keyStore, _accessToken, _refreshToken3;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return getOauthGoogleToken(code);
        case 2:
          _yield$getOauthGoogle = _context4.sent;
          id_token = _yield$getOauthGoogle.id_token;
          access_token = _yield$getOauthGoogle.access_token;
          _context4.next = 7;
          return getGoogleUserInfo(access_token, id_token);
        case 7:
          userInfo = _context4.sent;
          if (userInfo.email_verified) {
            _context4.next = 10;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Email not verified');
        case 10:
          _context4.next = 12;
          return _userModel.userModel.getEmail(userInfo.email);
        case 12:
          checkEmail = _context4.sent;
          if (!checkEmail) {
            _context4.next = 30;
            break;
          }
          _context4.next = 16;
          return _authModel.authModel.getKeyToken(checkEmail._id.toString());
        case 16:
          keyStore = _context4.sent;
          if (keyStore) {
            _context4.next = 21;
            break;
          }
          _generateKey2 = (0, _generateKey5["default"])(), publicKey = _generateKey2.publicKey, privateKey = _generateKey2.privateKey;
          _context4.next = 21;
          return _authModel.authModel.createKeyToken({
            userId: checkEmail._id.toString(),
            privateKey: privateKey,
            publicKey: publicKey
          });
        case 21:
          _context4.next = 23;
          return _authModel.authModel.getKeyToken(checkEmail._id.toString());
        case 23:
          keyStore = _context4.sent;
          accessToken = _jwt.jwtHelper.generateToken({
            user: checkEmail,
            tokenSecret: keyStore.publicKey,
            tokenLife: _constants.timeExpired
          });
          _refreshToken2 = _jwt.jwtHelper.generateToken({
            user: checkEmail,
            tokenSecret: keyStore.privateKey,
            tokenLife: '365d'
          });
          _context4.next = 28;
          return Promise.all([_authModel.authModel.addRefreshToken({
            userId: checkEmail._id.toString(),
            refreshToken: _refreshToken2
          }), _authModel.authModel.addAccessToken({
            userId: checkEmail._id.toString(),
            accessToken: accessToken
          })]);
        case 28:
          res.cookie('refreshToken', _refreshToken2, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 31557600000,
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          return _context4.abrupt("return", _objectSpread(_objectSpread({}, checkEmail), {}, {
            password: undefined,
            accessToken: accessToken,
            refreshToken: _refreshToken2
          }));
        case 30:
          name = userInfo.name, picture = userInfo.picture, email = userInfo.email, sub = userInfo.sub; // Mã hóa mật khẩu từ phía người dùng nhập vào
          _context4.next = 33;
          return (0, _hashPassword["default"])(sub);
        case 33:
          hashed = _context4.sent;
          // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
          // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
          newUser = {
            password: hashed,
            slug: (0, _formatters.slugify)(name),
            userName: "@".concat((0, _formatters.formatUserName)(name)),
            temporaryAvatar: picture,
            email: email,
            name: name
          }; // Truyền dữ liệu đã xử lí vào model
          _context4.next = 37;
          return _authModel.authModel.signUp(newUser);
        case 37:
          user = _context4.sent;
          if (!user) {
            _context4.next = 50;
            break;
          }
          // Tạo privateKey và publicKey mới cho user
          _generateKey3 = (0, _generateKey5["default"])(), _publicKey = _generateKey3.publicKey, _privateKey = _generateKey3.privateKey; // Thêm vào db để lưu privateKey và publicKey
          _context4.next = 42;
          return _authModel.authModel.createKeyToken({
            userId: user._id.toString(),
            privateKey: _privateKey,
            publicKey: _publicKey
          });
        case 42:
          _keyStore = _context4.sent;
          // Tạo accessToken và refreshToken bằng privateKey và publicKey
          _accessToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: _keyStore.publicKey,
            tokenLife: _constants.timeExpired
          });
          _refreshToken3 = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: _keyStore.privateKey,
            tokenLife: '365d'
          });
          _context4.next = 47;
          return Promise.all([
          // Thêm accessToken và refreshToke vào db
          _authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: _refreshToken3
          }), _authModel.authModel.addAccessToken({
            userId: user._id.toString(),
            accessToken: _accessToken
          })]);
        case 47:
          res.cookie('refreshToken', _refreshToken3, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 31557600000,
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          user.password = undefined;
          return _context4.abrupt("return", _objectSpread({
            accessToken: _accessToken,
            refreshToken: _refreshToken3
          }, user));
        case 50:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function loginGoogle(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var user, validations, keyStore, _generateKey4, publicKey, privateKey, accessToken, _refreshToken4;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _userModel.userModel.getEmail(req.body.email);
        case 3:
          user = _context5.sent;
          if (user) {
            _context5.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'EMAIL',
            message: 'Không tìm thấy email'
          });
        case 6:
          _context5.next = 8;
          return (0, _validationsPassword["default"])({
            id: user._id,
            password: req.body.password
          });
        case 8:
          validations = _context5.sent;
          if (validations) {
            _context5.next = 11;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'PASSWORD',
            message: 'Mật khẩu không chính xác'
          });
        case 11:
          user.password = undefined;
          if (!(user && validations)) {
            _context5.next = 29;
            break;
          }
          _context5.next = 15;
          return _authModel.authModel.getKeyToken(user._id.toString());
        case 15:
          keyStore = _context5.sent;
          if (keyStore) {
            _context5.next = 20;
            break;
          }
          _generateKey4 = (0, _generateKey5["default"])(), publicKey = _generateKey4.publicKey, privateKey = _generateKey4.privateKey;
          _context5.next = 20;
          return _authModel.authModel.createKeyToken({
            userId: user._id.toString(),
            privateKey: privateKey,
            publicKey: publicKey
          });
        case 20:
          _context5.next = 22;
          return _authModel.authModel.getKeyToken(user._id.toString());
        case 22:
          keyStore = _context5.sent;
          accessToken = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.publicKey,
            tokenLife: _constants.timeExpired
          });
          _refreshToken4 = _jwt.jwtHelper.generateToken({
            user: user,
            tokenSecret: keyStore.privateKey,
            tokenLife: '365d'
          });
          _context5.next = 27;
          return Promise.all([_authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: _refreshToken4
          }), _authModel.authModel.addAccessToken({
            userId: user._id.toString(),
            accessToken: accessToken
          })]);
        case 27:
          res.cookie('refreshToken', _refreshToken4, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 31557600000,
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          return _context5.abrupt("return", _objectSpread(_objectSpread({}, user), {}, {
            accessToken: accessToken,
            refreshToken: _refreshToken4
          }));
        case 29:
          _context5.next = 34;
          break;
        case 31:
          _context5.prev = 31;
          _context5.t0 = _context5["catch"](0);
          throw _context5.t0;
        case 34:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 31]]);
  }));
  return function login(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
var refreshToken = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$headers$authoriz, decoded, keyStore, _refreshToken5, access_token, checkToken, user, newAccessToken, newRefreshToken;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          // const refreshToken = req.cookies.refreshToken
          decoded = req.decoded;
          keyStore = req.keyStore;
          _refreshToken5 = req.refreshToken;
          access_token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', ''); // refreshToken gửi lên đã được sử dụng để refreshToken chưa
          if (!('refreshTokensUsed' in keyStore && Array.isArray(keyStore.refreshTokensUsed) && keyStore.refreshTokensUsed.includes(_refreshToken5))) {
            _context6.next = 7;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Có gì đó không ổn. Đăng nhập lại!');
        case 7:
          _context6.next = 9;
          return _authModel.authModel.getRefreshToken(_refreshToken5);
        case 9:
          checkToken = _context6.sent;
          if (checkToken) {
            _context6.next = 12;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy Refresh Token');
        case 12:
          _context6.next = 14;
          return _userModel.userModel.getInfo(decoded._id);
        case 14:
          user = _context6.sent;
          if (user) {
            _context6.next = 17;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Không tìm thấy user');
        case 17:
          _context6.next = 19;
          return Promise.all([
          // Xóa refreshToken và accessToken cũ
          _authModel.authModel.deleteRefreshToken(_refreshToken5), _authModel.authModel.deleteAccessToken(access_token)]);
        case 19:
          // // Xóa refreshToken và accessToken cũ
          // await authModel.deleteRefreshToken(refreshToken)
          // await authModel.deleteAccessToken(access_token)
          // Tạo accessToken và refreshToken bằng privateKey và publicKey của user trong db
          newAccessToken = _jwt.jwtHelper.generateToken({
            user: decoded,
            tokenSecret: keyStore.publicKey,
            tokenLife: _constants.timeExpired
          });
          newRefreshToken = _jwt.jwtHelper.generateToken({
            user: decoded,
            tokenSecret: keyStore.privateKey,
            exp: decoded.exp
          });
          _context6.next = 23;
          return Promise.all([_authModel.authModel.addRefreshToken({
            userId: decoded._id,
            refreshToken: newRefreshToken
          }), _authModel.authModel.addAccessToken({
            userId: decoded._id,
            accessToken: newAccessToken
          }), _authModel.authModel.updateKeyToken({
            userId: decoded._id,
            refreshToken: _refreshToken5
          })]);
        case 23:
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sameSite: 'Lax'
          });
          return _context6.abrupt("return", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          });
        case 27:
          _context6.prev = 27;
          _context6.t0 = _context6["catch"](0);
          throw _context6.t0;
        case 30:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 27]]);
  }));
  return function refreshToken(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();
var logout = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var _req$headers$authoriz2, access_token;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          // Xóa refreshToken ở cookie
          res.clearCookie('refreshToken');
          // await authModel.deleteRefreshToken(req.body.refreshToken)
          access_token = (_req$headers$authoriz2 = req.headers['authorization']) === null || _req$headers$authoriz2 === void 0 ? void 0 : _req$headers$authoriz2.replace('Bearer ', '');
          _context7.next = 5;
          return Promise.all([
          // Xóa refreshToken ở db
          _authModel.authModel.deleteRefreshToken(req.cookies.refreshToken),
          // Xóa accessToken ở db
          _authModel.authModel.deleteAccessToken(access_token)]);
        case 5:
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          throw _context7.t0;
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function logout(_x12, _x13) {
    return _ref7.apply(this, arguments);
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