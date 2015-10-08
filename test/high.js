import assert from "assert";
import alleway from "../index";

describe("high", () => {
    // TODO
    it("base0", async(done) => {
        let op = alleway({
            "f1": (a, b) => a + b
        });
        let v = op.translate("!f1");
        var prev = await v(5, 4);
        var res = await prev[0]();
        assert.equal(res[0], 9);
        done();
    });
    it("base1", async(done) => {
        let op = alleway({
            "f1": (a, b) => a + b,
            "f2": (a, b) => a - b,
            "f3": async(a, b) => {
                let pros1 = a(),
                    pros2 = b();
                let part1 = await pros1;
                let part2 = await pros2;
                return part1 * part2;
            }
        });

        let v = op.translate("(f1!, f2!) | f3");
        var res = await v(5, 4);
        assert.equal(res[0], 9);
        done();
    });
    it("! ()", async(done) => {
        let op = alleway({
            "f1": (a, b) => a + b,
            "f2": (a, b) => a - b
        });

        let v = op.translate("!(f1, f2)");
        var prev = await v(5, 4);
        var res = await prev[0]();
        assert.equal(res[0], 9);
        assert.equal(res[1], 1);
        done();
    });
    it("! |", async(done) => {
        let op = alleway({
            "f1": (a, b) => a + b,
            "f2": (a, b) => a - b,
            "f3": async(v) => {
                let y = v();
                let res = await y;
                return res[0] * res[1];
            }
        });

        let v = op.translate("!(f1, f2)|f3");
        var res = await v(10, 8);
        assert.equal(res[0], 36);
        done();
    });
    it("delay", async(done) => {
        let when = "";
        let op = alleway({
            "f1": (a, b) => {
                when = "f1";
                return a + b;
            },
            "f2": (a, b) => {
                when = "f2";
                return a - b;
            },
            "f3": async(a, b) => {
                if (when === "f1" || when === "f2") {
                    throw new Error("no delay");
                }
                let part1 = await a();
                let part2 = await b();
                return part1 * part2;
            }
        });

        let v = op.translate("(f1!, f2!) | f3");
        var res = await v(5, 4);
        assert.equal(res[0], 9);
        done();
    });
    it("delay2", async(done) => {
        let when = "";
        let op = alleway({
            "f0": (a, b) => {
                return true;
            },
            "f1": (a, b) => {
                return a + b;
            },
            "f2": (a, b) => {
                throw new Error("should not be calculated!");
            },
            "f3": (c, f1, f2) => {
                if (c) {
                    return f1();
                } else {
                    return f2();
                }
            }
        });

        let v = op.translate("(f0, !f1, !f2) | f3");
        var res = await v(5, 4);
        assert.equal(res[0], 9);
        done();
    });
});