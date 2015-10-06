/**
 * after joining get a promise function
 */
var compose = (left, right) => (...y) => {
    let leftResult = left.apply(undefined, y);
    return new Promise((resolve, reject) => {
        leftResult.then(preVs => {
            let v = right.apply(undefined, preVs);
            v.then(result => {
                resolve(result);
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

export default compose;