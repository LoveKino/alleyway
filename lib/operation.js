"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _parallel = require("./parallel");

var _parallel2 = _interopRequireDefault(_parallel);

var _compose = require("./compose");

var _compose2 = _interopRequireDefault(_compose);

var _iterate = require("./iterate");

var _iterate2 = _interopRequireDefault(_iterate);

var _serial = require("./serial");

var _serial2 = _interopRequireDefault(_serial);

var _high = require("./high");

var _high2 = _interopRequireDefault(_high);

var _join = require("./join");

var _join2 = _interopRequireDefault(_join);

var _getOperateValues = require("./getOperateValues");

var _getOperateValues2 = _interopRequireDefault(_getOperateValues);

var operationMap = {
    ",": {
        priority: 10,
        opNum: 2
    },
    "~": {
        priority: 15,
        opNum: 2
    },
    "!": {
        priority: 30,
        opNum: 1
    },
    "*": {
        priority: 30,
        opNum: 1
    },
    "|": {
        priority: 20,
        opNum: 2
    },
    ">": {
        priority: 20,
        opNum: 2
    },
    ":": {
        priority: 20,
        opNum: 2
    },
    "(": {
        type: "start"
    },
    ")": {
        type: "close",
        match: "("
    }
};

var generateOperationExecutor = function generateOperationExecutor(operationMap, funMap, valueMap) {
    operationMap[","].execute = function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var vs = (0, _getOperateValues2["default"])(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _parallel2["default"])(fun1, fun2);
    };
    operationMap["~"].execute = function () {
        for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            y[_key2] = arguments[_key2];
        }

        var vs = (0, _getOperateValues2["default"])(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _serial2["default"])(fun1, fun2);
    };
    operationMap["!"].execute = function () {
        for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            y[_key3] = arguments[_key3];
        }

        var vs = (0, _getOperateValues2["default"])(y, funMap, valueMap);
        var fun = vs[0];
        return (0, _high2["default"])(fun);
    };
    operationMap["*"].execute = function () {
        for (var _len4 = arguments.length, y = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            y[_key4] = arguments[_key4];
        }

        var vs = (0, _getOperateValues2["default"])(y, funMap, valueMap);
        var fun = vs[0];
        return (0, _join2["default"])(fun);
    };
    operationMap["|"].execute = function () {
        for (var _len5 = arguments.length, y = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            y[_key5] = arguments[_key5];
        }

        var vs = (0, _getOperateValues2["default"])(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _compose2["default"])(fun1, fun2);
    };
    operationMap[">"].execute = function () {
        for (var _len6 = arguments.length, y = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            y[_key6] = arguments[_key6];
        }

        var vs = (0, _getOperateValues2["default"])(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _iterate2["default"])(fun1, fun2);
    };
    operationMap[":"].execute = function (left, right) {
        var vs = (0, _getOperateValues2["default"])([left], funMap, valueMap);
        left = vs[0];
        valueMap[right] = left;
        return left;
    };
};

exports["default"] = {
    operationMap: operationMap,
    generateOperationExecutor: generateOperationExecutor
};
module.exports = exports["default"];