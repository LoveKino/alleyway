/**
 * after joining get a promise function
 */
var parallel = (left, right) => (...y) => {
    let leftPros = left.apply(undefined, y);
    let rightPros = right.apply(undefined, y);
    let counter = 0;
    let results = [];

    return new Promise((resolve, reject) => {
        leftPros.then(res => {
            counter++;
            results = res.concat(results);
            if (counter === 2) {
                resolve(results);
            }
        }).catch(err => reject(err));
        rightPros.then(res => {
            counter++;
            results = results.concat(res);
            if (counter === 2) {
                resolve(results);
            }
        }).catch(err => reject(err));
    });
}

export default parallel