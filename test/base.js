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
        let res = await v(10, 20);
        assert.equal(res[0], 30);
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
        let res = await v(10, 20);
        assert.equal(res[0], 600);
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
        let res1 = await v(10, 20);
        let res2 = await v(10);
        let res3 = await v(10);
        assert.equal(res1[0], 30);
        assert.equal(res2[1], 200);
        assert.equal(res3[2], 5);
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
        let res1 = await v(5, 4);
        let res2 = await v(2, 1);
        assert.equal(res1[0], 9);
        assert.equal(res2[1], 1);
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
        let res1 = await v(5, 4);
        let res2 = await v(2, 1);
        let res3 = await v(6, 3);
        assert.equal(res1[0], 9);
        assert.equal(res2[0], 3);
        assert.equal(res3[0], 27);
        done();
    });

    it("() 3 calculation times", async(done) => {
        let counter = 0;
        let op = alleway({
            "f1": function(a, b) {
                counter++;
                return a + b;
            },
            "f2": function(v) {
                return v * 2;
            },
            "f3": function(v) {
                return v - 10;
            }
        });

        let v = op.translate("f1|(f2, f3)");
        let res1 = await v(5, 4);
        let res2 = await v(2, 1);
        assert.equal(res1[0], 18);
        assert.equal(res2[1], -7);
        assert.equal(counter, 2)
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
        let res = await v(10, 20);
        assert.equal(res[0], -10);
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
        let res = await v(1, 2);
        let res2 = await v(3, 4);
        assert.equal(res[0], -4);
        assert.equal(res2[0], 4);
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
        let res = await v(2);
        assert.equal(res[0], 3 + 4 + (-8));
        done();
    });

    it("( | )| ()", async(done) => {
        let op = alleway({
            "f1": function(a) {
                return a * 2;
            },
            "f2": function(v) {
                return v / 2;
            },
            "f3": function(v) {
                return v + 1.5;
            },
            "f4": function(a, b) {
                return a * b;
            },
            "f5": function(a, b) {
                return a - b;
            }
        });

        let v = op.translate("(f1, f2 | f3) | (f4, f5)");
        let res = await v(3);
        assert.equal(res[0], 18);
        assert.equal(res[1], 3);
        done();
    });
});