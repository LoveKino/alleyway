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

var _packer = require("./packer");

var _packer2 = _interopRequireDefault(_packer);

var _operation = require("./operation");

var _operation2 = _interopRequireDefault(_operation);

var _getOperateValues = require("./getOperateValues");

var _getOperateValues2 = _interopRequireDefault(_getOperateValues);

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

exports["default"] = function () {
    var setMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var funMap = {};
    var operationMap = _operation2["default"].operationMap;

    // init
    for (var _name in setMap) {
        defineUnit(_name, setMap[_name], funMap, operationMap);
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
                    value = (0, _getOperateValues2["default"])([value], funMap, valueMap)[0];
                }
                values.push(value);
            }
        }

        return function () {
            for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
                y[_key] = arguments[_key];
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
        _operation2["default"].generateOperationExecutor(operationMap, funMap, valueMap);
        return composeSentences(str, valueMap);
    };

    return {
        translate: translate
    };
};

module.exports = exports["default"];