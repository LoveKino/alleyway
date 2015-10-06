/**
 * after joining get a promise function
 */
var serial = (left, right) => (...y) => {
    let leftPros = left.apply(undefined, y);
    let results = [];

    return new Promise((resolve, reject) => {
        leftPros.then(leftRes => {
            results = leftRes.concat(results);
            let rightPros = right.apply(undefined, y);
            rightPros.then(rightRes => {
                results = results.concat(rightRes);
                resolve(results);
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

export default serial;