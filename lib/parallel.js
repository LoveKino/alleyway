/**
 * after joining get a promise function
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var parallel = function parallel(left, right) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var leftPros = left.apply(undefined, y);
        var rightPros = right.apply(undefined, y);
        var counter = 0;
        var results = [];

        return new Promise(function (resolve, reject) {
            leftPros.then(function (res) {
                counter++;
                results = res.concat(results);
                if (counter === 2) {
                    resolve(results);
                }
            })["catch"](function (err) {
                return reject(err);
            });
            rightPros.then(function (res) {
                counter++;
                results = results.concat(res);
                if (counter === 2) {
                    resolve(results);
                }
            })["catch"](function (err) {
                return reject(err);
            });
        });
    };
};

exports["default"] = parallel;
module.exports = exports["default"];