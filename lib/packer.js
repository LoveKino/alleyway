"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var pack = function pack(fun, context) {
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

exports["default"] = {
    pack: pack
};
module.exports = exports["default"];