/**
 * compose like f (g1, g2, ..., gn)
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _this = this;

var composeList = function composeList(f, glist) {
    return function callee$1$0() {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        var preVs, counter, j, item, itemValue, res, v;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    preVs = [], counter = 0;
                    j = 0;

                case 2:
                    if (!(j < glist.length)) {
                        context$2$0.next = 16;
                        break;
                    }

                    item = glist[j];
                    itemValue = item.apply(undefined, y);
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(itemValue);

                case 7:
                    res = context$2$0.sent;

                    preVs[j] = res;
                    counter++;

                    if (!(counter === glist.length)) {
                        context$2$0.next = 13;
                        break;
                    }

                    v = f.apply(undefined, preVs);
                    return context$2$0.abrupt("return", v);

                case 13:
                    j++;
                    context$2$0.next = 2;
                    break;

                case 16:
                case "end":
                    return context$2$0.stop();
            }
        }, null, _this);
    };
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
    composeList: composeList,
    promiseFun: promiseFun
};
module.exports = exports["default"];