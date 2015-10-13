/**
 * iteration
 */
var iterate = (left, right) => (...y) => {
    let leftResult = left.apply(undefined, y);
    return new Promise((resolve, reject) => {
        leftResult.then(preVs => {
            let counter = 0;
            let results = [];
            for (let i = 0; i < preVs.length; i++) {
                let item = preVs[i];
                let v = right.apply(undefined, [item]);
                v.then(result => {
                    results[i] = result;
                    counter++;
                    if (counter >= preVs.length) {
                        resolve(results);
                    }
                }).catch(err => reject(err));
            }
        }).catch(err => reject(err));
    });
}

export default iterate;