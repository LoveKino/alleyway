import assert from "assert";
import alleway from "../index";

describe("async", () => {
    it("0", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return new Promise(r => {
                    setTimeout(() => r(a + b), 100);
                })
            }
        });

        let v = op.translate("f1");
        let res = await v(10, 20)[0];
        assert.equal(res, 30);
        done();
    });

    it("normal", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return new Promise(r => {
                    setTimeout(() => r(a + b), 100);
                })
            },
            "f2": function(v) {
                return new Promise(r => {
                    setTimeout(() => r(v * 2), 10);
                })
            }
        });
        let v = op.translate("f1|f2");
        let res = await v(10, 20)[0];
        assert.equal(res, 60);
        done();
    });

    it("reject", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return new Promise((r, reject) => {
                    reject("error happened!");
                })
            },
            "f2": function(v) {
                return new Promise(r => {
                    setTimeout(() => r(v * 2), 10);
                })
            }
        });

        let v = op.translate("f1|f2");
        try {
            let res = await v(10, 20)[0];
        } catch (err) {
            assert.equal(err.toString(), "error happened!");
            done();
        }
    });
});