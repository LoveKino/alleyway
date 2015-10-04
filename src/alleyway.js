/**
 * tunnel for computing
 * TODO default function or function library
 *
 * async 
 *
 *    any function if return promise means async function.
 */

import ast from "expressioner";

import {
    composeCross, promiseFun
}
from "./compose";


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

var arraylike = v => v && typeof v === "object" && typeof v.length === "number";

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
        if (!arraylike(fun))
            fun = [fun];
        vs.push(fun);
    }
    return vs;
}

var generateOperationExecutor = (operationMap, funMap, valueMap) => {
    operationMap[","].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return fun1.concat(fun2);
    }
    operationMap["|"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return composeCross(fun2, fun1);
    }
    operationMap[":"].execute = (left, right) => {
        let vs = getOperateValues([left], funMap, valueMap);
        left = vs[0];
        valueMap[right] = left;
        return left;
    }
}

var handleSingle = (value, funMap, valueMap) => {
    if (typeof value === "string") {
        value = getOperateValues([value], funMap, valueMap)[0];
        for (var i = 0; i < value.length; i++) {
            value[i] = promiseFun(value[i]);
        }
    }
    return value;
}

var joinFuns = (values) => (...y) => {
    let results = [];
    for (let i = 0; i < values.length; i++) {
        let value = values[i];
        let res = value.apply(undefined, y);
        results.push(res);
    }
    return results;
}

let operationMap = {
    ",": {
        priority: 10,
        opNum: 2
    },
    "|": {
        priority: 20,
        opNum: 2
    },
    ":": {
        priority: 20,
        opNum: 2
    },
    "(": {
        type: "start"
    },
    ")": {
        type: "close",
        match: "("
    }
};

export default (setMap = {}) => {
    let funMap = {};

    // init
    for (let name in setMap) {
        defineUnit(name, setMap[name], funMap, operationMap);
    }

    var translator = ast(operationMap);

    var translate = (str) => {
        let valueMap = {};
        generateOperationExecutor(operationMap, funMap, valueMap);

        // get all expression sentences
        let sentences = str.split(";");

        for (var i = 0; i < sentences.length; i++) {
            let sentence = sentences[i].trim();
            if (sentence) {
                var value = translator(sentences[i]).value;
            }
        }

        // special case.
        value = handleSingle(value, funMap, valueMap);

        return joinFuns(value);
    }

    var execute = async(str, y) => {
        let fun = translate(str);
        let res = await fun.apply(undefined, y);
        return res;
    }

    return {
        translate,
        execute
    }
}