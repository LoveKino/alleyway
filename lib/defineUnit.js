"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defineUnit = function defineUnit(name, method, funMap, operationMap) {
    // check name
    for (var opName in operationMap) {
        if (name.indexOf(opName) !== -1) {
            throw new TypeError("unexpected name, contain special symbol '" + opName + "' in " + name);
        }
    }
    if (typeof method === "function") {
        // convert to promise function, if it's not a promise function
        funMap[name] = promiseFun(method);
    } else {
        throw new TypeError("unexpected type method, expect function. " + name);
    }
};

var promiseFun = function promiseFun(fun, context) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var value = fun.apply(context, y);
        if (!isPromise(value)) {
            return new Promise(function (resolve, reject) {
                resolve([value]);
            });
        } else {
            return new Promise(function (resolve, reject) {
                value.then(function (res) {
                    return resolve([res]);
                })["catch"](function (err) {
                    return reject(err);
                });
            });
        }
        return value;
    };
};

var isPromise = function isPromise(v) {
    return v && typeof v === "object" && typeof v.then === "function";
};

exports["default"] = defineUnit;
module.exports = exports["default"];