import assert from "assert";
import alleway from "../index";

describe("high", () => {
    it("base", async(done) => {
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
    it("delay", async(done) => {
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
            "f3": async(c, f1, f2) => {
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