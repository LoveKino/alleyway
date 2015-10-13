/**
 * tunnel for computing
 * TODO default function or function library
 *
 * async 
 *
 *    any function if return promise means async function.
 */

import ast from "expressioner";
import packer from "./packer"
import operation from "./operation";
import getOperateValues from "./getOperateValues";

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

export default (setMap = {}) => {
    let funMap = {};
    let operationMap = operation.operationMap;

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
        operation.generateOperationExecutor(operationMap, funMap, valueMap);
        return composeSentences(str, valueMap);
    }

    return {
        translate
    }
}