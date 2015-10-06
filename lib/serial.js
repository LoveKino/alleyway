/**
 * after joining get a promise function
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var serial = function serial(left, right) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var leftPros = left.apply(undefined, y);
        var results = [];

        return new Promise(function (resolve, reject) {
            leftPros.then(function (leftRes) {
                results = leftRes.concat(results);
                var rightPros = right.apply(undefined, y);
                rightPros.then(function (rightRes) {
                    results = results.concat(rightRes);
                    resolve(results);
                })["catch"](function (err) {
                    return reject(err);
                });
            })["catch"](function (err) {
                return reject(err);
            });
        });
    };
};

exports["default"] = serial;
module.exports = exports["default"];