/**
 * after joining get a promise function
 */
var high = (fun) => (...y) => {
    return new Promise((resolve, reject) => {
        let closure = () => {
            let funPros = fun.apply(undefined, y);
            return funPros;
        }
        resolve([closure]);
    });
}

export default high;