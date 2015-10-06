/**
 * after joining get a promise function
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var composeJoin = function composeJoin(left, right) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var leftResult = left.apply(undefined, y);
        return new Promise(function (resolve, reject) {
            leftResult.then(function (preVs) {
                var v = right.apply(undefined, preVs);
                v.then(function (result) {
                    resolve(result);
                })["catch"](function (err) {
                    return reject(err);
                });
            })["catch"](function (err) {
                return reject(err);
            });
        });
    };
};

exports["default"] = {
    composeJoin: composeJoin
};
module.exports = exports["default"];