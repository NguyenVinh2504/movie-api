"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authService = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
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
var _generateKey2 = _interopRequireDefault(require("../utils/generateKey"));
var _axios = _interopRequireDefault(require("axios"));
var _constants = require("../utils/constants");
var _excluded = ["password", "name", "confirmPassword"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } /* eslint-disable no-unused-vars */ /* eslint-disable no-useless-catch */
var signUp = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var newUserPayload, user, _yield$issueTokensAnd, accessToken, _refreshToken;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return validateEmailIsAvailable(req.body.email);
        case 3:
          _context.next = 5;
          return prepareNewUserData(req.body);
        case 5:
          newUserPayload = _context.sent;
          _context.next = 8;
          return _authModel.authModel.signUp(newUserPayload);
        case 8:
          user = _context.sent;
          if (!user) {
            _context.next = 16;
            break;
          }
          _context.next = 12;
          return issueTokensAndSetCookie(user, res);
        case 12:
          _yield$issueTokensAnd = _context.sent;
          accessToken = _yield$issueTokensAnd.accessToken;
          _refreshToken = _yield$issueTokensAnd.refreshToken;
          return _context.abrupt("return", _objectSpread(_objectSpread({
            accessToken: accessToken,
            refreshToken: _refreshToken
          }, user), {}, {
            password: undefined
          }));
        case 16:
          _context.next = 21;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          throw _context.t0;
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 18]]);
  }));
  return function signUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
function validateEmailIsAvailable(_x3) {
  return _validateEmailIsAvailable.apply(this, arguments);
}
function _validateEmailIsAvailable() {
  _validateEmailIsAvailable = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(email) {
    var existingUser;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _userModel.userModel.getEmail(email);
        case 2:
          existingUser = _context8.sent;
          if (!existingUser) {
            _context8.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'EMAIL',
            message: 'Email đã được đăng ký'
          });
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _validateEmailIsAvailable.apply(this, arguments);
}
function prepareNewUserData(_x4) {
  return _prepareNewUserData.apply(this, arguments);
} // const loginGoogle = async (req, res) => {
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
function _prepareNewUserData() {
  _prepareNewUserData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(body) {
    var password, name, confirmPassword, otherData, hashedPassword, formattedUserName;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          password = body.password, name = body.name, confirmPassword = body.confirmPassword, otherData = (0, _objectWithoutProperties2["default"])(body, _excluded); // Mã hóa mật khẩu từ phía người dùng nhập vào
          _context9.next = 3;
          return (0, _hashPassword["default"])(password);
        case 3:
          hashedPassword = _context9.sent;
          formattedUserName = (0, _formatters.formatUserName)(name); // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
          return _context9.abrupt("return", _objectSpread(_objectSpread({}, otherData), {}, {
            name: name,
            password: hashedPassword,
            slug: (0, _formatters.slugify)(name),
            userName: "@".concat(formattedUserName),
            temporaryAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=".concat(formattedUserName)
          }));
        case 6:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _prepareNewUserData.apply(this, arguments);
}
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
  return function getOauthGoogleToken(_x5) {
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
  return function getGoogleUserInfo(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
var loginGoogle = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(code, res) {
    var _yield$getOauthGoogle, id_token, access_token, userInfo, user;
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
          user = null;
          _context4.prev = 11;
          _context4.next = 14;
          return validateUserExists(userInfo.email);
        case 14:
          user = _context4.sent;
          _context4.next = 20;
          break;
        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](11);
          user = null;
        case 20:
          if (!user) {
            _context4.next = 26;
            break;
          }
          _context4.next = 23;
          return handleExistingUserLogin(user, res);
        case 23:
          return _context4.abrupt("return", _context4.sent);
        case 26:
          _context4.next = 28;
          return handleNewUserSignUp(userInfo, res);
        case 28:
          return _context4.abrupt("return", _context4.sent);
        case 29:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[11, 17]]);
  }));
  return function loginGoogle(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var user, validations, _yield$issueTokensAnd2, accessToken, _refreshToken2;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return validateUserExists(req.body.email);
        case 3:
          user = _context5.sent;
          _context5.next = 6;
          return verifyUserPasswords(user, req.body.password);
        case 6:
          validations = _context5.sent;
          user.password = undefined;
          if (!(user && validations)) {
            _context5.next = 15;
            break;
          }
          _context5.next = 11;
          return issueTokensAndSetCookie(user, res);
        case 11:
          _yield$issueTokensAnd2 = _context5.sent;
          accessToken = _yield$issueTokensAnd2.accessToken;
          _refreshToken2 = _yield$issueTokensAnd2.refreshToken;
          return _context5.abrupt("return", _objectSpread(_objectSpread({}, user), {}, {
            accessToken: accessToken,
            refreshToken: _refreshToken2
          }));
        case 15:
          _context5.next = 20;
          break;
        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](0);
          throw _context5.t0;
        case 20:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 17]]);
  }));
  return function login(_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();
function validateUserExists(_x12) {
  return _validateUserExists.apply(this, arguments);
}
function _validateUserExists() {
  _validateUserExists = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(email) {
    var user;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return _userModel.userModel.getEmail(email);
        case 2:
          user = _context10.sent;
          if (user) {
            _context10.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'EMAIL',
            message: 'Không tìm thấy email'
          });
        case 5:
          return _context10.abrupt("return", user);
        case 6:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _validateUserExists.apply(this, arguments);
}
function verifyUserPasswords(_x13, _x14) {
  return _verifyUserPasswords.apply(this, arguments);
}
function _verifyUserPasswords() {
  _verifyUserPasswords = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(user, password) {
    var validations;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return (0, _validationsPassword["default"])({
            id: user._id,
            password: password
          });
        case 2:
          validations = _context11.sent;
          if (validations) {
            _context11.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'PASSWORD',
            message: 'Mật khẩu không chính xác'
          });
        case 5:
          return _context11.abrupt("return", validations);
        case 6:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _verifyUserPasswords.apply(this, arguments);
}
function ensureUserKeyStore(_x15) {
  return _ensureUserKeyStore.apply(this, arguments);
}
function _ensureUserKeyStore() {
  _ensureUserKeyStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(user) {
    var keyStore, _generateKey, publicKey, privateKey;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return _authModel.authModel.getKeyToken(user._id.toString());
        case 2:
          keyStore = _context12.sent;
          if (keyStore) {
            _context12.next = 8;
            break;
          }
          _generateKey = (0, _generateKey2["default"])(), publicKey = _generateKey.publicKey, privateKey = _generateKey.privateKey;
          _context12.next = 7;
          return _authModel.authModel.createKeyToken({
            userId: user._id.toString(),
            privateKey: privateKey,
            publicKey: publicKey
          });
        case 7:
          keyStore = _context12.sent;
        case 8:
          return _context12.abrupt("return", keyStore);
        case 9:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return _ensureUserKeyStore.apply(this, arguments);
}
function generateTokenPair(user, keyStore) {
  // Get privateKey và publicKey trong db để tạo token
  var accessToken = _jwt.jwtHelper.generateToken({
    user: user,
    tokenSecret: keyStore.publicKey,
    tokenLife: _constants.timeExpired
  });
  var refreshToken = _jwt.jwtHelper.generateToken({
    user: user,
    tokenSecret: keyStore.privateKey,
    tokenLife: '365d'
  });
  return {
    accessToken: accessToken,
    refreshToken: refreshToken
  };
}
function saveUserTokens(_x16) {
  return _saveUserTokens.apply(this, arguments);
}
function _saveUserTokens() {
  _saveUserTokens = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(_ref6) {
    var user, accessToken, refreshToken;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          user = _ref6.user, accessToken = _ref6.accessToken, refreshToken = _ref6.refreshToken;
          _context13.next = 3;
          return Promise.all([_authModel.authModel.addRefreshToken({
            userId: user._id.toString(),
            refreshToken: refreshToken
          }), _authModel.authModel.addAccessToken({
            userId: user._id.toString(),
            accessToken: accessToken
          })]);
        case 3:
          return _context13.abrupt("return", _context13.sent);
        case 4:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return _saveUserTokens.apply(this, arguments);
}
function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    // maxAge: 31557600000,
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    sameSite: 'Lax'
  });
}
function handleExistingUserLogin(_x17, _x18) {
  return _handleExistingUserLogin.apply(this, arguments);
}
function _handleExistingUserLogin() {
  _handleExistingUserLogin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(user, res) {
    var _yield$issueTokensAnd3, accessToken, refreshToken;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return issueTokensAndSetCookie(user, res);
        case 2:
          _yield$issueTokensAnd3 = _context14.sent;
          accessToken = _yield$issueTokensAnd3.accessToken;
          refreshToken = _yield$issueTokensAnd3.refreshToken;
          return _context14.abrupt("return", _objectSpread(_objectSpread({}, user), {}, {
            password: undefined,
            accessToken: accessToken,
            refreshToken: refreshToken
          }));
        case 6:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return _handleExistingUserLogin.apply(this, arguments);
}
function handleNewUserSignUp(_x19, _x20) {
  return _handleNewUserSignUp.apply(this, arguments);
}
function _handleNewUserSignUp() {
  _handleNewUserSignUp = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(userInfo, res) {
    var newUser, _yield$issueTokensAnd4, accessToken, refreshToken;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return createNewUserFromGoogle(userInfo);
        case 2:
          newUser = _context15.sent;
          _context15.next = 5;
          return issueTokensAndSetCookie(newUser, res);
        case 5:
          _yield$issueTokensAnd4 = _context15.sent;
          accessToken = _yield$issueTokensAnd4.accessToken;
          refreshToken = _yield$issueTokensAnd4.refreshToken;
          return _context15.abrupt("return", _objectSpread(_objectSpread({}, newUser), {}, {
            password: undefined,
            accessToken: accessToken,
            refreshToken: refreshToken
          }));
        case 9:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return _handleNewUserSignUp.apply(this, arguments);
}
function createNewUserFromGoogle(_x21) {
  return _createNewUserFromGoogle.apply(this, arguments);
}
function _createNewUserFromGoogle() {
  _createNewUserFromGoogle = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(userInfo) {
    var name, picture, email, sub, hashedPassword, newUserPayload;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          name = userInfo.name, picture = userInfo.picture, email = userInfo.email, sub = userInfo.sub;
          _context16.next = 3;
          return (0, _hashPassword["default"])(sub);
        case 3:
          hashedPassword = _context16.sent;
          // Dùng sub (Google ID) làm mật khẩu ban đầu
          newUserPayload = {
            password: hashedPassword,
            slug: (0, _formatters.slugify)(name),
            userName: "@".concat((0, _formatters.formatUserName)(name)),
            temporaryAvatar: picture,
            email: email,
            name: name
          };
          _context16.next = 7;
          return _authModel.authModel.signUp(newUserPayload);
        case 7:
          return _context16.abrupt("return", _context16.sent);
        case 8:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return _createNewUserFromGoogle.apply(this, arguments);
}
function issueTokensAndSetCookie(_x22, _x23) {
  return _issueTokensAndSetCookie.apply(this, arguments);
}
function _issueTokensAndSetCookie() {
  _issueTokensAndSetCookie = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(user, res) {
    var keyStore, _generateTokenPair, accessToken, refreshToken;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return ensureUserKeyStore(user);
        case 2:
          keyStore = _context17.sent;
          // Tạo token bằng privateKey và publicKey từ keyStore
          _generateTokenPair = generateTokenPair(user, keyStore), accessToken = _generateTokenPair.accessToken, refreshToken = _generateTokenPair.refreshToken; // Lưu accessToken và refreshToken user vào db
          _context17.next = 6;
          return saveUserTokens({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
          });
        case 6:
          setRefreshTokenCookie(res, refreshToken);
          return _context17.abrupt("return", {
            accessToken: accessToken,
            refreshToken: refreshToken
          });
        case 8:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return _issueTokensAndSetCookie.apply(this, arguments);
}
var refreshToken = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$headers$authoriz, decoded, keyStore, _refreshToken3, access_token, checkToken, user, newAccessToken, newRefreshToken;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          // const refreshToken = req.cookies.refreshToken
          decoded = req.decoded;
          keyStore = req.keyStore;
          _refreshToken3 = req.refreshToken;
          access_token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', ''); // refreshToken gửi lên đã được sử dụng để refreshToken chưa
          if (!('refreshTokensUsed' in keyStore && Array.isArray(keyStore.refreshTokensUsed) && keyStore.refreshTokensUsed.includes(_refreshToken3))) {
            _context6.next = 7;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Có gì đó không ổn. Đăng nhập lại!');
        case 7:
          _context6.next = 9;
          return _authModel.authModel.getRefreshToken(_refreshToken3);
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
          _authModel.authModel.deleteRefreshToken(_refreshToken3), _authModel.authModel.deleteAccessToken(access_token)]);
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
            refreshToken: _refreshToken3
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
  return function refreshToken(_x24, _x25) {
    return _ref7.apply(this, arguments);
  };
}();
var logout = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
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
  return function logout(_x26, _x27) {
    return _ref8.apply(this, arguments);
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