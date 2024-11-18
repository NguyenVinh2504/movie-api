"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _userModel = require("../models/userModel");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _hashPassword = _interopRequireDefault(require("../utils/hashPassword"));
var _validationsPassword = _interopRequireDefault(require("../utils/validationsPassword"));
var _firebase = require("../config/firebase");
var _storage = require("firebase/storage");
var _uuid = require("uuid");
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _environment = require("../config/environment");
var _otpGenerator = _interopRequireDefault(require("otp-generator"));
var _otpService = require("./otpService");
var _otpModel = require("../models/otpModel");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } /* eslint-disable no-unused-vars */ /* eslint-disable no-useless-catch */
var deleteUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req) {
    var user, validations;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _userModel.userModel.getIdUser(req.user._id);
        case 3:
          user = _context.sent;
          if (user) {
            _context.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không có người dùng này');
        case 6:
          _context.next = 8;
          return (0, _validationsPassword["default"])({
            id: user._id,
            password: req.body.password
          });
        case 8:
          validations = _context.sent;
          if (validations) {
            _context.next = 11;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'PASSWORD',
            message: 'Mật khẩu không chính xác'
          });
        case 11:
          if (req.user.admin) {
            _context.next = 15;
            break;
          }
          _context.next = 14;
          return _userModel.userModel.deleteUser(req.user._id);
        case 14:
          return _context.abrupt("return", _context.sent);
        case 15:
          if (!req.user.admin) {
            _context.next = 19;
            break;
          }
          _context.next = 18;
          return _userModel.userModel.deleteUser(req.body.userId);
        case 18:
          return _context.abrupt("return", _context.sent);
        case 19:
          _context.next = 24;
          break;
        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          throw _context.t0;
        case 24:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 21]]);
  }));
  return function deleteUser(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updatePassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req) {
    var user, validations, hashed;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _userModel.userModel.getIdUser(req.user._id);
        case 3:
          user = _context2.sent;
          if (user) {
            _context2.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không có người dùng này');
        case 6:
          _context2.next = 8;
          return (0, _validationsPassword["default"])({
            id: user._id,
            password: req.body.password
          });
        case 8:
          validations = _context2.sent;
          if (validations) {
            _context2.next = 11;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'PASSWORD',
            message: 'Mật khẩu không chính xác'
          });
        case 11:
          _context2.next = 13;
          return (0, _hashPassword["default"])(req.body.newPassword);
        case 13:
          hashed = _context2.sent;
          _context2.next = 16;
          return _userModel.userModel.updateProfile({
            id: user._id,
            body: {
              password: hashed
            }
          });
        case 16:
          return _context2.abrupt("return", 'Đã cập nhật mật khẩu');
        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;
        case 22:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 19]]);
  }));
  return function updatePassword(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var updateProfile = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req) {
    var user, body, file, tasks, imageDel, deleteTask, imageRef, metaData, uploadTask, results, updateBody, uploadResult, newUser;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _userModel.userModel.getIdUser(req.user._id);
        case 3:
          user = _context4.sent;
          body = req.body, file = req.file;
          if (user) {
            _context4.next = 7;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không có người dùng này');
        case 7:
          tasks = [];
          if (body.avatar) {
            imageDel = (0, _storage.ref)(_firebase.storage, body.avatar); // const err = await deleteObject(imageDel)
            deleteTask = (0, _storage.deleteObject)(imageDel).then(function (data) {})["catch"](function (error) {});
            tasks.push(deleteTask);
            body.avatar = null;
          }
          if (!req.file) {
            _context4.next = 16;
            break;
          }
          // Tạo ref cho một file up lên firebase
          imageRef = (0, _storage.ref)(_firebase.storage, "images/".concat((0, _uuid.v4)()));
          metaData = {
            contentType: file.mimetype
          };
          _context4.next = 14;
          return (0, _storage.uploadBytes)(imageRef, file.buffer, metaData).then( /*#__PURE__*/function () {
            var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(res) {
              var url;
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _storage.getDownloadURL)(res.ref);
                  case 2:
                    url = _context3.sent;
                    return _context3.abrupt("return", {
                      avatar: url,
                      temporaryAvatar: null
                    });
                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x4) {
              return _ref4.apply(this, arguments);
            };
          }())["catch"](function (error) {
            throw error;
          });
        case 14:
          uploadTask = _context4.sent;
          tasks.push(uploadTask);
        case 16:
          _context4.next = 18;
          return Promise.all(tasks);
        case 18:
          results = _context4.sent;
          // Cập nhật profile
          updateBody = body;
          if (results.length > 0) {
            uploadResult = results.find(function (result) {
              return result && result.avatar;
            }); // Tìm kết quả từ upload ảnh
            if (uploadResult) {
              updateBody = _objectSpread(_objectSpread({}, body), uploadResult);
            }
          }
          _context4.next = 23;
          return _userModel.userModel.updateProfile({
            id: user._id,
            body: updateBody
          });
        case 23:
          newUser = _context4.sent;
          return _context4.abrupt("return", newUser);
        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](0);
          throw _context4.t0;
        case 30:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 27]]);
  }));
  return function updateProfile(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var getInfo = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id) {
    var user;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _userModel.userModel.getInfo(id);
        case 3:
          user = _context5.sent;
          if (user) {
            _context5.next = 6;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không có người dùng này');
        case 6:
          return _context5.abrupt("return", _objectSpread({
            id: id
          }, user));
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
  return function getInfo(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var checkEmail = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req) {
    var email, user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          email = req.body.email;
          _context6.next = 4;
          return _userModel.userModel.getEmail(email);
        case 4:
          user = _context6.sent;
          if (user) {
            _context6.next = 7;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
            name: 'EMAIL',
            message: 'Không có email này'
          });
        case 7:
          return _context6.abrupt("return", {
            message: 'Valid Email'
          });
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          throw _context6.t0;
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 10]]);
  }));
  return function checkEmail(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var sendEmail = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req) {
    var email, otpHolder, OTP, transporter;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          email = req.body.email;
          _context7.next = 4;
          return _otpModel.otpModel.findOtp(email);
        case 4:
          otpHolder = _context7.sent;
          if (!otpHolder) {
            _context7.next = 8;
            break;
          }
          _context7.next = 8;
          return _otpModel.otpModel.deleteOtp(email);
        case 8:
          OTP = _otpGenerator["default"].generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
          });
          _context7.next = 11;
          return _otpService.otpService.otpCreate({
            email: email,
            otp: OTP
          });
        case 11:
          transporter = _nodemailer["default"].createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            // `true` for port 465, `false` for all other ports
            auth: {
              user: _environment.env.EMAIL_NAME,
              pass: _environment.env.EMAIL_PASS
            }
          }); // send mail with defined transport object
          _context7.next = 14;
          return transporter.sendMail({
            from: 'Viejoy <viejoy2023@gmail.com>',
            // sender address
            to: email,
            // list of receivers
            subject: 'Khôi phục mật khẩu',
            // Subject line
            text: "OTP: ".concat(OTP) // plain text body
          });
        case 14:
          _context7.next = 19;
          break;
        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](0);
          throw _context7.t0;
        case 19:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 16]]);
  }));
  return function sendEmail(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
var forgotPassword = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req) {
    var _req$body, email, otp, newPassword, otpHolder, lastOtp, isValid, user, hashed;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body = req.body, email = _req$body.email, otp = _req$body.otp, newPassword = _req$body.newPassword;
          otp.toString();
          _context8.next = 5;
          return _otpModel.otpModel.findOtp(email);
        case 5:
          otpHolder = _context8.sent;
          if (otpHolder.length) {
            _context8.next = 8;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Expired Otp');
        case 8:
          lastOtp = otpHolder[otpHolder.length - 1];
          _context8.next = 11;
          return _otpService.otpService.otpVerify({
            otp: otp,
            hashOtp: lastOtp.otp
          });
        case 11:
          isValid = _context8.sent;
          if (isValid) {
            _context8.next = 14;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Invalid Otp');
        case 14:
          _context8.next = 16;
          return _userModel.userModel.getEmail(email);
        case 16:
          user = _context8.sent;
          if (user) {
            _context8.next = 19;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Không có người dùng này');
        case 19:
          if (!(isValid && user)) {
            _context8.next = 28;
            break;
          }
          _context8.next = 22;
          return (0, _hashPassword["default"])(newPassword);
        case 22:
          hashed = _context8.sent;
          _context8.next = 25;
          return _userModel.userModel.updateProfile({
            id: user._id,
            body: {
              password: hashed
            }
          });
        case 25:
          _context8.next = 27;
          return _otpModel.otpModel.deleteOtp(email);
        case 27:
          return _context8.abrupt("return", {
            message: 'thay doi mat khau thanh cong'
          });
        case 28:
          _context8.next = 33;
          break;
        case 30:
          _context8.prev = 30;
          _context8.t0 = _context8["catch"](0);
          throw _context8.t0;
        case 33:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 30]]);
  }));
  return function forgotPassword(_x8) {
    return _ref8.apply(this, arguments);
  };
}();
var userService = {
  deleteUser: deleteUser,
  updatePassword: updatePassword,
  updateProfile: updateProfile,
  getInfo: getInfo,
  checkEmail: checkEmail,
  sendEmail: sendEmail,
  forgotPassword: forgotPassword
};
exports.userService = userService;