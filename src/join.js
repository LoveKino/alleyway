/**
 * [ [a], [b], [c], d ] -> [ a, b, c, d ]
 */
var join = (fun) => (...y) => {
    let pros = fun.apply(undefined, y);
    return new Promise((resolve, reject) => {
        pros.then(res => {
            let newArr = [];
            for (let i = 0; i < res.length; i++) {
                let item = res[i];
                if (!isArray(item)) item = [item];
                newArr = newArr.concat(item);
            }

            resolve(newArr);
        });
    });
}

var isArray = v => v && typeof v === "object" && typeof v.length === "number";

export default join;