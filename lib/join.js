/**
 * [ [a], [b], [c], d ] -> [ a, b, c, d ]
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var join = function join(fun) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var pros = fun.apply(undefined, y);
        return new Promise(function (resolve, reject) {
            pros.then(function (res) {
                var newArr = [];
                for (var i = 0; i < res.length; i++) {
                    var item = res[i];
                    if (!isArray(item)) item = [item];
                    newArr = newArr.concat(item);
                }

                resolve(newArr);
            });
        });
    };
};

var isArray = function isArray(v) {
    return v && typeof v === "object" && typeof v.length === "number";
};

exports["default"] = join;
module.exports = exports["default"];