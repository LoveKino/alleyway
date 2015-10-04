/**
 * (g1, g2, ..., gn)| f
 * compose like f (g1, g2, ..., gn)
 *
 * t = max {t(g1), t(g2), ..., t(gn)}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _this = this;

var composeList = function composeList(f, gvalues, storeValues, index) {
    return function callee$1$0() {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    return context$2$0.abrupt("return", new Promise(function (resolve, reject) {
                        if (index === 0) {
                            var values = gvalues(y);
                            for (var i = 0; i < values.length; i++) {
                                storeValues[i] = values[i];
                            }
                        } else {
                            var values = storeValues;
                        }
                        var preVs = [],
                            counter = 0;

                        var _loop = function (j) {
                            var itemValue = values[j];
                            itemValue.then(function (res) {
                                preVs[j] = res;
                                counter++;
                                if (counter === values.length) {
                                    var v = f.apply(undefined, preVs);
                                    resolve(v);
                                }
                            })["catch"](function (err) {
                                return reject(err);
                            });
                        };

                        for (var j = 0; j < values.length; j++) {
                            _loop(j);
                        }
                    }));

                case 1:
                case "end":
                    return context$2$0.stop();
            }
        }, null, _this);
    };
};

var getGlistValues = function getGlistValues(glist) {
    return function (y) {
        var values = [];
        for (var j = 0; j < glist.length; j++) {
            var item = glist[j];
            var itemValue = item.apply(undefined, y);
            values.push(itemValue);
        }
        return values;
    };
};

/**
 * flist should share the value of glist
 *
 * (g1, g2, ..., gn) | (f1, f2, ..., fn)
 */
var composeCross = function composeCross(flist, glist) {
    var res = [];
    var gvalues = getGlistValues(glist);
    var storeValues = [];
    for (var i = 0; i < flist.length; i++) {
        var fItem = flist[i];
        res.push(composeList(fItem, gvalues, storeValues, i));
    }
    return res;
};

var promiseFun = function promiseFun(fun, context) {
    return function () {
        for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            y[_key2] = arguments[_key2];
        }

        var value = fun.apply(context, y);
        if (!isPromise(value)) {
            value = new Promise(function (resolve, reject) {
                resolve(value);
            });
        }
        return value;
    };
};

var isPromise = function isPromise(v) {
    return v && typeof v === "object" && typeof v.then === "function";
};

exports["default"] = {
    composeCross: composeCross,
    promiseFun: promiseFun
};
module.exports = exports["default"];