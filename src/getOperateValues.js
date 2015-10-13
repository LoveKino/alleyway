var getValue = (name, funMap, valueMap) => {
    let fun = name;
    if (typeof name === "string") {
        if (valueMap.hasOwnProperty(name)) {
            fun = valueMap[name];
        } else {
            fun = funMap[name];
        }
    }
    if (!fun) throw new Error("missing definition for function " + name);
    return fun;
}

var getOperateValues = (y, funMap, valueMap) => {
    let vs = [];
    for (let i = 0; i < y.length; i++) {
        let name = y[i];
        let fun = getValue(name, funMap, valueMap);
        vs.push(fun);
    }
    return vs;
}

export default getOperateValues;