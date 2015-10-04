/**
 * (g1, g2, ..., gn)| f
 * compose like f (g1, g2, ..., gn)
 *
 * t = max {t(g1), t(g2), ..., t(gn)}
 */
var composeList = (f, gvalues, storeValues, index) => async(...y) =>
    new Promise((resolve, reject) => {
        if (index === 0) {
            var values = gvalues(y);
            for (let i = 0; i < values.length; i++) {
                storeValues[i] = values[i];
            }
        } else {
            var values = storeValues;
        }
        let preVs = [],
            counter = 0;
        for (let j = 0; j < values.length; j++) {
            let itemValue = values[j];
            itemValue.then(res => {
                preVs[j] = res;
                counter++;
                if (counter === values.length) {
                    let v = f.apply(undefined, preVs);
                    resolve(v);
                }
            }).catch(err => reject(err));
        }
    });

var getGlistValues = (glist) => (y) => {
    let values = [];
    for (let j = 0; j < glist.length; j++) {
        let item = glist[j];
        var itemValue = item.apply(undefined, y);
        values.push(itemValue);
    }
    return values;
}

/**
 * flist should share the value of glist
 *
 * (g1, g2, ..., gn) | (f1, f2, ..., fn)
 */
var composeCross = (flist, glist) => {
    let res = [];
    let gvalues = getGlistValues(glist);
    let storeValues = [];
    for (let i = 0; i < flist.length; i++) {
        let fItem = flist[i];
        res.push(composeList(fItem, gvalues, storeValues, i));
    }
    return res;
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
    composeCross,
    promiseFun
}