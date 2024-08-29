"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
var MEDIA_COLLECTION_NAME = 'videoStatus';
var MEDIA_COLLECTION_SCHEMA = _joi["default"].object({
  name: _joi["default"].string().optional(),
  status: _joi["default"].string().valid('pending', 'processing', 'success', 'failed').required(),
  message: _joi["default"].string().optional()["default"](''),
  updated_at: _joi["default"].date().optional()["default"](function () {
    return new Date();
  })
});
var createVideoStatus = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var validData, media, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return MEDIA_COLLECTION_SCHEMA.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validData = _context.sent;
          _context.next = 5;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).insertOne(validData);
        case 5:
          media = _context.sent;
          _context.next = 8;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOne({
            _id: new _mongodb.ObjectId(media.insertedId)
          });
        case 8:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createVideoStatus(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updateVideoStatus = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var name, status, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          name = _ref2.name, status = _ref2.status;
          _context2.next = 3;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).updateOne({
            name: name
          }, {
            $set: {
              status: status
            },
            $currentDate: {
              updated_at: true
            }
          });
        case 3:
          _context2.next = 5;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOne({
            name: name
          });
        case 5:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateVideoStatus(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var getVideoStatus = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(name) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _mongodb2.GET_DB)().collection(MEDIA_COLLECTION_NAME).findOne({
            name: name
          });
        case 2:
          result = _context3.sent;
          return _context3.abrupt("return", result);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getVideoStatus(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
var mediaModel = {
  MEDIA_COLLECTION_NAME: MEDIA_COLLECTION_NAME,
  MEDIA_COLLECTION_SCHEMA: MEDIA_COLLECTION_SCHEMA,
  createVideoStatus: createVideoStatus,
  updateVideoStatus: updateVideoStatus,
  getVideoStatus: getVideoStatus
};
exports.mediaModel = mediaModel;