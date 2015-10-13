/**
 * iteration
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var iterate = function iterate(left, right) {
    return function () {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var leftResult = left.apply(undefined, y);
        return new Promise(function (resolve, reject) {
            leftResult.then(function (preVs) {
                var counter = 0;
                var results = [];

                var _loop = function (i) {
                    var item = preVs[i];
                    var v = right.apply(undefined, [item]);
                    v.then(function (result) {
                        results[i] = result;
                        counter++;
                        if (counter >= preVs.length) {
                            resolve(results);
                        }
                    })["catch"](function (err) {
                        return reject(err);
                    });
                };

                for (var i = 0; i < preVs.length; i++) {
                    _loop(i);
                }
            })["catch"](function (err) {
                return reject(err);
            });
        });
    };
};

exports["default"] = iterate;
module.exports = exports["default"];