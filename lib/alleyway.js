/**
 * tunnel for computing
 * TODO default function or function library
 *
 * async 
 *
 *    any function if return promise means async function.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _expressioner = require("expressioner");

var _expressioner2 = _interopRequireDefault(_expressioner);

var _parallel = require("./parallel");

var _parallel2 = _interopRequireDefault(_parallel);

var _compose = require("./compose");

var _compose2 = _interopRequireDefault(_compose);

var _serial = require("./serial");

var _serial2 = _interopRequireDefault(_serial);

var _high = require("./high");

var _high2 = _interopRequireDefault(_high);

var _packer = require("./packer");

var _packer2 = _interopRequireDefault(_packer);

var defineUnit = function defineUnit(name, method, funMap, operationMap) {
    // check name
    for (var opName in operationMap) {
        if (name.indexOf(opName) !== -1) {
            throw new TypeError("unexpected name, contain special symbol '" + opName + "' in " + name);
        }
    }
    if (typeof method === "function") {
        // convert to promise function, if it's not a promise function
        funMap[name] = _packer2["default"].pack(method);
    } else {
        throw new TypeError("unexpected type method, expect function. " + name);
    }
};

var getValue = function getValue(name, funMap, valueMap) {
    var fun = name;
    if (typeof name === "string") {
        if (valueMap.hasOwnProperty(name)) {
            fun = valueMap[name];
        } else {
            fun = funMap[name];
        }
    }
    if (!fun) throw new Error("missing definition for function " + name);
    return fun;
};

var getOperateValues = function getOperateValues(y, funMap, valueMap) {
    var vs = [];
    for (var i = 0; i < y.length; i++) {
        var _name = y[i];
        var fun = getValue(_name, funMap, valueMap);
        vs.push(fun);
    }
    return vs;
};

var generateOperationExecutor = function generateOperationExecutor(operationMap, funMap, valueMap) {
    operationMap[","].execute = function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var vs = getOperateValues(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _parallel2["default"])(fun1, fun2);
    };
    operationMap["~"].execute = function () {
        for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            y[_key2] = arguments[_key2];
        }

        var vs = getOperateValues(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _serial2["default"])(fun1, fun2);
    };
    operationMap["!"].execute = function () {
        for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            y[_key3] = arguments[_key3];
        }

        var vs = getOperateValues(y, funMap, valueMap);
        var fun = vs[0];
        return (0, _high2["default"])(fun);
    };
    operationMap["|"].execute = function () {
        for (var _len4 = arguments.length, y = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            y[_key4] = arguments[_key4];
        }

        var vs = getOperateValues(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _compose2["default"])(fun1, fun2);
    };
    operationMap[":"].execute = function (left, right) {
        var vs = getOperateValues([left], funMap, valueMap);
        left = vs[0];
        valueMap[right] = left;
        return left;
    };
};

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
    "|": {
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

exports["default"] = function () {
    var setMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var funMap = {};

    // init
    for (var _name2 in setMap) {
        defineUnit(_name2, setMap[_name2], funMap, operationMap);
    }

    var translator = (0, _expressioner2["default"])(operationMap);

    var composeSentences = function composeSentences(str, valueMap) {
        // get all expression sentences
        var sentences = str.split(";");

        var values = [];
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i].trim();
            if (sentence) {
                var value = translator(sentences[i]).value;
                if (typeof value === "string") {
                    value = getOperateValues([value], funMap, valueMap)[0];
                }
                values.push(value);
            }
        }

        return function () {
            for (var _len5 = arguments.length, y = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                y[_key5] = arguments[_key5];
            }

            var result = null;
            for (var _i = 0; _i < values.length; _i++) {
                result = values[_i].apply(undefined, y);
            }
            return result;
        };
    };

    var translate = function translate(str) {
        var valueMap = {};
        generateOperationExecutor(operationMap, funMap, valueMap);
        return composeSentences(str, valueMap);
    };

    return {
        translate: translate
    };
};

module.exports = exports["default"];