import assert from "assert";
import alleway from "../index";

describe("semicolon", () => {
    let counter = 0;
    it(";", async(done) => {
        let op = alleway({
            "f1": function(a) {
                counter++;
                return a + 1;
            },
            "f2": function(v) {
                counter++;
                return v * 2;
            }
        });

        let v = op.translate("f1;f2;f1;f2");
        let res = await v(2);
        assert.equal(counter, 4);
        done();
    });
});