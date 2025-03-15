"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _media = require("../services/media.services");
var getList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var mediaList;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _media.mediaService.getList(req);
        case 3:
          mediaList = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaList);
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          next(_context.t0);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function getList(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getTrending = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var mediaList;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _media.mediaService.getTrending(req);
        case 3:
          mediaList = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaList);
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function getTrending(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getDiscoverGenres = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var mediaList;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _media.mediaService.getDiscoverGenres(req);
        case 3:
          mediaList = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaList);
          _context3.next = 10;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function getDiscoverGenres(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getGenres = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var mediaGenres;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _media.mediaService.getGenres(req);
        case 3:
          mediaGenres = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaGenres);
          _context4.next = 10;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          next(_context4.t0);
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function getGenres(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
var getDetail = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var mediaDetail;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _media.mediaService.getDetail(req);
        case 3:
          mediaDetail = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaDetail);
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function getDetail(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var getDetailSeason = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var mediaDetailSeason;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _media.mediaService.getDetailSeason(req);
        case 3:
          mediaDetailSeason = _context6.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaDetailSeason);
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          next(_context6.t0);
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function getDetailSeason(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();
var search = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var mediaSearch;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _media.mediaService.search(req);
        case 3:
          mediaSearch = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaSearch);
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          next(_context7.t0);
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function search(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();
var searchKeyword = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var mediaDetailSeason;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return _media.mediaService.searchKeyword(req);
        case 3:
          mediaDetailSeason = _context8.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json(mediaDetailSeason);
          _context8.next = 10;
          break;
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          next(_context8.t0);
        case 10:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function searchKeyword(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();
var mediaController = {
  getList: getList,
  getTrending: getTrending,
  getDiscoverGenres: getDiscoverGenres,
  getGenres: getGenres,
  getDetail: getDetail,
  getDetailSeason: getDetailSeason,
  search: search,
  searchKeyword: searchKeyword
};
exports.mediaController = mediaController;