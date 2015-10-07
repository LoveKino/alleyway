/**
 * after joining get a promise function
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var high = function high(fun) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        return new Promise(function (resolve, reject) {
            var closure = function closure() {
                var funPros = fun.apply(undefined, y);
                return funPros;
            };
            resolve([closure]);
        });
    };
};

exports["default"] = high;
module.exports = exports["default"];