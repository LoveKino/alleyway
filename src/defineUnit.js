var defineUnit = (name, method, funMap, operationMap) => {
    // check name
    for (let opName in operationMap) {
        if (name.indexOf(opName) !== -1) {
            throw new TypeError("unexpected name, contain special symbol '" +
                opName + "' in " + name);
        }
    }
    if (typeof method === "function") {
        // convert to promise function, if it's not a promise function
        funMap[name] = promiseFun(method);
    } else {
        throw new TypeError("unexpected type method, expect function. " + name);
    }
}

var promiseFun = (fun, context) => (...y) => {
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

export default defineUnit;