"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports["default"] = getOperateValues;
module.exports = exports["default"];