import assert from "assert";
import alleway from "../index";

describe("serial", () => {
    it("base", async(done) => {
        let tmp = "";
        let op = alleway({
            "f1": (a, b) => new Promise(r => setTimeout(() => {
                tmp = "f1"
                r(a + b);
            }, 100)),
            "f2": (a, b) => new Promise(r => setTimeout(() => {
                if (tmp !== "f1") {
                    assert.equal(true, false);
                }
                tmp = "f2";
                r(a - b);
            }, 10)),
            "f3": (a, b) => new Promise(r => setTimeout(() => {
                if (tmp !== "f2") {
                    assert.equal(true, false);
                }
                tmp = "f2";
                r(a * b);
            }, 10))
        });

        let v = op.translate("f1~f2~f3");
        let res = await v(10, 20);
        assert.equal(res[0], 30);
        assert.equal(res[1], -10);
        assert.equal(res[2], 200);
        done();
    });

    it("~ ,", async(done) => {
        let tmp = "";
        let op = alleway({
            "f1": (a, b) => new Promise(r => setTimeout(() => {
                if (tmp !== "f3") {
                    assert.equal(true, false);
                }
                tmp = "f1";
                r(a + b);
            }, 100)),
            "f2": (a, b) => new Promise(r => setTimeout(() => {
                if (tmp !== "f1") {
                    assert.equal(true, false);
                }
                tmp = "f2";
                r(a - b);
            }, 100)),
            "f3": (a, b) => new Promise(r => setTimeout(() => {
                tmp = "f3";
                r(a * b);
            }, 10))
        });

        let v = op.translate("f1~f2,f3");
        let res = await v(10, 20);
        assert.equal(res[0], 30);
        assert.equal(res[1], -10);
        assert.equal(res[2], 200);
        done();
    });

    it("~ |", async(done) => {
        let tmp = "";
        let op = alleway({
            "f1": (a, b) => new Promise(r => setTimeout(() => {
                r(a + b);
            }, 100)),
            "f2": (a, b) => new Promise(r => setTimeout(() => {
                r(a - b);
            }, 100)),
            "f3": (v) => new Promise(r => setTimeout(() => {
                r(v * 2);
            }, 10))
        });

        let v = op.translate("f1~f2|f3");
        let res = await v(10, 20);
        assert.equal(res[0], 30);
        assert.equal(res[1], -20);
        done();
    });
});