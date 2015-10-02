/**
 * compose like f (g1, g2, ..., gn)
 */
var composeList = (f, glist) => async(...y) => {
    let preVs = [],
        counter = 0;
    for (let j = 0; j < glist.length; j++) {
        let item = glist[j];
        let itemValue = item.apply(undefined, y);
        let res = await itemValue;
        preVs[j] = res;
        counter++;
        if (counter === glist.length) {
            let v = f.apply(undefined, preVs);
            return v;
        }
    }
}

var promiseFun = (fun, context) => (...y) => {
    let value = fun.apply(context, y);
    if (!isPromise(value)) {
        value = new Promise((resolve, reject) => {
            resolve(value);
        });
    }
    return value;
}


var isPromise = v => v && typeof v === "object" && typeof v.then === "function";

export default {
    composeList,
    promiseFun
}