import assert from "assert";
import alleway from "../index";

describe("join", () => {
    it("base0", async(done) => {
        let op = alleway({
            "list": () => [1, 2, 3, 4]
        });
        let v = op.translate("list*");
        var res = await v();
        assert.equal(res[0], 1);
        assert.equal(res[1], 2);
        assert.equal(res[2], 3);
        assert.equal(res[3], 4);
        done();
    });
    it("base1", async(done) => {
        let op = alleway({
            "list": () => 1
        });
        let v = op.translate("list*");
        var res = await v();
        assert.equal(res[0], 1);
        done();
    });
    it("* >", async(done) => {
        let op = alleway({
            "list": () => [1, 2, 3, 4],
            "dou": v => 2 * v
        });
        let v = op.translate("list* > dou");
        var res = await v();
        assert.equal(res[0], 2);
        assert.equal(res[1], 4);
        assert.equal(res[2], 6);
        assert.equal(res[3], 8);
        done();
    });
    it("* > 2", async(done) => {
        let op = alleway({
            "list": () => [1, 2, 3, 4],
            "item": () => 5,
            "dou": v => 2 * v
        });
        let v = op.translate("(list, item)* > dou");
        var res = await v();
        assert.equal(res[0], 2);
        assert.equal(res[1], 4);
        assert.equal(res[2], 6);
        assert.equal(res[3], 8);
        assert.equal(res[4], 10);
        done();
    });
});