var pack = (fun, context) => (...y) => {
    let value = fun.apply(context, y);
    if (!isPromise(value)) {
        return new Promise((resolve, reject) => {
            resolve([value]);
        });
    } else {
        return new Promise((resolve, reject) => {
            value.then(res => resolve([res])).catch(err => reject(err));
        });
    }
    return value;
}

var isPromise = v => v && typeof v === "object" && typeof v.then === "function";

export default {
    pack
};