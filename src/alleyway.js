/**
 * tunnel for computing
 * TODO default function or function library
 *
 * async 
 *
 *    any function if return promise means async function.
 */

import ast from "expressioner";
import parallel from "./parallel";
import compose from "./compose";
import serial from "./serial";
import high from "./high";
import packer from "./packer"

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
        funMap[name] = packer.pack(method);
    } else {
        throw new TypeError("unexpected type method, expect function. " + name);
    }
}

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

var generateOperationExecutor = (operationMap, funMap, valueMap) => {
    operationMap[","].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return parallel(fun1, fun2);
    }
    operationMap["~"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return serial(fun1, fun2);
    }
    operationMap["!"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun = vs[0];
        return high(fun);
    }
    operationMap["|"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return compose(fun1, fun2);
    }
    operationMap[":"].execute = (left, right) => {
        let vs = getOperateValues([left], funMap, valueMap);
        left = vs[0];
        valueMap[right] = left;
        return left;
    }
}

let operationMap = {
    ",": {
        priority: 10,
        opNum: 2
    },
    "~": {
        priority: 15,
        opNum: 2
    },
    "!": {
        priority: 30,
        opNum: 1
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

    var composeSentences = (str, valueMap) => {
        // get all expression sentences
        let sentences = str.split(";");

        let values = [];
        for (var i = 0; i < sentences.length; i++) {
            let sentence = sentences[i].trim();
            if (sentence) {
                var value = translator(sentences[i]).value;
                if (typeof value === "string") {
                    value = getOperateValues([value], funMap, valueMap)[0];
                }
                values.push(value);
            }
        }

        return (...y) => {
            let result = null;
            for (let i = 0; i < values.length; i++) {
                result = values[i].apply(undefined, y);
            }
            return result;
        }
    }

    var translate = (str) => {
        let valueMap = {};
        generateOperationExecutor(operationMap, funMap, valueMap);
        return composeSentences(str, valueMap);
    }

    return {
        translate
    }
}