import assert from "assert";
import alleway from "../index";

describe("base", () => {
    it("0", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            }
        });

        let v = op.translate("f1");
        let res = await v[0](10, 20);
        assert.equal(res, 30);
        done();
    });

    it("|", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            },
            "f2": function(v) {
                return v * 20;
            }
        });

        let v = op.translate("f1|f2");
        let res = await v[0](10, 20);
        assert.equal(res, 600);
        done();
    });

    it(",", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            },
            "f2": function(v) {
                return v * 20;
            },
            "f3": function(v) {
                return v / 2;
            }
        });

        let v = op.translate("f1,f2,f3");
        let res1 = await v[0](10, 20);
        let res2 = await v[1](10);
        let res3 = await v[2](10);
        assert.equal(res1, 30);
        assert.equal(res2, 200);
        assert.equal(res3, 5);
        done();
    });

    it("()", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            },
            "f2": function(a, b) {
                return a - b;
            }
        });

        let v = op.translate("(f1,f2)");
        let res1 = await v[0](5, 4);
        let res2 = await v[1](2, 1);
        assert.equal(res1, 9);
        assert.equal(res2, 1);
        done();
    });

    it("() 2", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            },
            "f2": function(a, b) {
                return a - b;
            },
            "f3": function(v1, v2) {
                return v1 * v2;
            }
        });

        let v = op.translate("(f1,f2)|f3");
        let res1 = await v[0](5, 4);
        let res2 = await v[0](2, 1);
        let res3 = await v[0](6, 3);
        assert.equal(res1, 9);
        assert.equal(res2, 3);
        assert.equal(res3, 27);
        done();
    });

    it(";", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            },
            "f2": function(v) {
                return v * 20;
            },
            "f3": function(a, b) {
                return a - b;
            }
        });

        let v = op.translate("f1|f2;f3");
        let res = await v[0](10, 20);
        assert.equal(res, -10);
        done();
    });

    it("| |", async(done) => {
        let op = alleway({
            "f1": function(a, b) {
                return a + b;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(v) {
                return v - 10;
            }
        });

        let v = op.translate("f1|f2|f3");
        let res = await v[0](1, 2);
        let res2 = await v[0](3, 4);
        assert.equal(res, -4);
        assert.equal(res2, 4);
        done();
    });

    it("(())", async(done) => {
        let op = alleway({
            "f1": function(a) {
                return a + 1;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(v) {
                return v - 10;
            },
            "f4": function(a, b, c) {
                return a + b + c;
            }
        });

        let v = op.translate("((f1, f2) ,f3)|f4");
        let res = await v[0](2);
        assert.equal(res, 3 + 4 + (-8));
        done();
    });

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
        let res = await v[0](2);
        assert.equal(res, 2 + 1 + 2 * 2);
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
        let res = await v[0](2);
        assert.equal(res, 2 + 1 + 2 * 2);
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
        let res = await v[0](2);
        assert.equal(res, 5);
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
        let res = await v[0](2);
        assert.equal(res, 5.25);
        done();
    });
});