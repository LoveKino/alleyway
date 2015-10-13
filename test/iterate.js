import assert from "assert";
import alleway from "../index";

describe("iterate", () => {
    it("base", async(done) => {
        let op = alleway({
            "add": (a, b) => a + b,
            "dou": v => v * 2
        });
        let v = op.translate("add > dou");
        var res = await v(5, 4);
        assert.equal(res[0], 18);
        done();
    });
    it("blanket", async(done) => {
        let op = alleway({
            "add": (a, b) => a + b,
            "sub": (a, b) => a - b,
            "dou": v => v * 2
        });
        let v = op.translate("(add, sub) > dou");
        var res = await v(5, 4);
        assert.equal(res[0], 18);
        assert.equal(res[1], 2);
        done();
    });
    it("order", async(done) => {
        let op = alleway({
            "add": (a, b) => new Promise((r) => {
                setTimeout(() => {
                    r(a + b);
                }, 10);
            }),
            "sub": (a, b) => new Promise((r) => {
                setTimeout(() => {
                    r(a - b);
                }, 10);
            }),
            "dou": v => v * 2
        });
        let v = op.translate("(add, sub) > dou");
        var res = await v(5, 4);
        assert.equal(res[0], 18);
        assert.equal(res[1], 2);
        done();
    });
});