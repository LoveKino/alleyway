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

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _expressioner = require("expressioner");

var _expressioner2 = _interopRequireDefault(_expressioner);

var _compose = require("./compose");

var defineUnit = function defineUnit(name, method, funMap, operationMap) {
    // check name
    for (var opName in operationMap) {
        if (name.indexOf(opName) !== -1) {
            throw new TypeError("unexpected name, contain special symbol '" + opName + "' in " + name);
        }
    }
    if (typeof method === "function") {
        // convert to promise function, if it's not a promise function
        funMap[name] = (0, _compose.promiseFun)(method);
    } else {
        throw new TypeError("unexpected type method, expect function. " + name);
    }
};

var arraylike = function arraylike(v) {
    return v && typeof v === "object" && typeof v.length === "number";
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
        if (!arraylike(fun)) fun = [fun];
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
        return fun1.concat(fun2);
    };
    operationMap["|"].execute = function () {
        for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            y[_key2] = arguments[_key2];
        }

        var vs = getOperateValues(y, funMap, valueMap);
        var fun1 = vs[0];
        var fun2 = vs[1];
        return (0, _compose.composeCross)(fun2, fun1);
    };
    operationMap[":"].execute = function (left, right) {
        var vs = getOperateValues([left], funMap, valueMap);
        left = vs[0];
        valueMap[right] = left;
        return left;
    };
};

var handleSingle = function handleSingle(value, funMap, valueMap) {
    if (typeof value === "string") {
        value = getOperateValues([value], funMap, valueMap)[0];
        for (var i = 0; i < value.length; i++) {
            value[i] = (0, _compose.promiseFun)(value[i]);
        }
    }
    return value;
};

var joinFuns = function joinFuns(values) {
    return function () {
        for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            y[_key3] = arguments[_key3];
        }

        var results = [];
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            var res = value.apply(undefined, y);
            results.push(res);
        }
        return results;
    };
};

var operationMap = {
    ",": {
        priority: 10,
        opNum: 2
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

    var translate = function translate(str) {
        var valueMap = {};
        generateOperationExecutor(operationMap, funMap, valueMap);

        // get all expression sentences
        var sentences = str.split(";");

        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i].trim();
            if (sentence) {
                var value = translator(sentences[i]).value;
            }
        }

        // special case.
        value = handleSingle(value, funMap, valueMap);

        return joinFuns(value);
    };

    var execute = function execute(str, y) {
        var fun, res;
        return regeneratorRuntime.async(function execute$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    fun = translate(str);
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(fun.apply(undefined, y));

                case 3:
                    res = context$2$0.sent;
                    return context$2$0.abrupt("return", res);

                case 5:
                case "end":
                    return context$2$0.stop();
            }
        }, null, _this);
    };

    return {
        translate: translate,
        execute: execute
    };
};

module.exports = exports["default"];