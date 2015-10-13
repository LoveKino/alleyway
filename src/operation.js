import parallel from "./parallel";
import compose from "./compose";
import iterate from "./iterate"
import serial from "./serial";
import high from "./high";
import join from "./join";
import getOperateValues from "./getOperateValues";

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
    "*": {
        priority: 30,
        opNum: 1
    },
    "|": {
        priority: 20,
        opNum: 2
    },
    ">": {
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
    operationMap["*"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun = vs[0];
        return join(fun);
    }
    operationMap["|"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return compose(fun1, fun2);
    }
    operationMap[">"].execute = (...y) => {
        let vs = getOperateValues(y, funMap, valueMap);
        let fun1 = vs[0];
        let fun2 = vs[1];
        return iterate(fun1, fun2);
    }
    operationMap[":"].execute = (left, right) => {
        let vs = getOperateValues([left], funMap, valueMap);
        left = vs[0];
        valueMap[right] = left;
        return left;
    }
}

export default {
    operationMap,
    generateOperationExecutor
}