import assert from "assert";
import alleway from "../index";

describe("assign", () => {
    it(":", async(done) => {
        let op = alleway({
            "f1": function(a) {
                return a + 1;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(a, b) {
                return a + b;
            }
        });

        let v = op.translate("(f1, f2)|f3 : q");
        let res = await v(2);
        assert.equal(res[0], 2 + 1 + 2 * 2);
        done();
    });

    it(": & ;", async(done) => {
        let op = alleway({
            "f1": function(a) {
                return a + 1;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(a, b) {
                return a + b;
            }
        });

        let v = op.translate("(f1, f2)|f3 : q ; q");
        let res = await v(2);
        assert.equal(res[0], 2 + 1 + 2 * 2);
        done();
    });

    it(": & ; 2", async(done) => {
        let op = alleway({
            "f1": function(a) {
                return a + 1;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(a, b) {
                return a + b;
            },
            "f4": function(a, b) {
                return (a + b) / 2;
            }
        });
        let v = op.translate("(f1, f2)|f3 : q ; (q, f1)| f4");
        let res = await v(2);
        assert.equal(res[0], 5);
        done();
    });

    it(": & ; 3", async(done) => {
        let op = alleway({
            "f1": function(a) {
                return a + 1;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(a, b) {
                return a + b;
            },
            "f4": function(a, b) {
                return (a + b) / 2;
            }
        });

        let v = op.translate("(f1, f2)| (f3, f4) : q ; q| f4");
        let res = await v(2);
        assert.equal(res[0], 5.25);
        done();
    });
});