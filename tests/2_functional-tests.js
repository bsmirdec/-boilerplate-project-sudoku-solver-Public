const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("api/check tests", () => {
    const validPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const invalidCharPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..?.926914.37.";
    const invalidShortPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92";
    const validCoordinate = "A7";
    const invalidCoordinate = "L7";
    const validValue = 7;
    const invalidValue = 15;

    test("check puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: validCoordinate,
          value: validValue,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["column", "region"],
          });
          done();
        });
    });
    test("check puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          value: invalidValue,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done();
        });
    });
    test("check puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidCharPuzzle,
          coordinate: validCoordinate,
          value: validValue,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("check puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidShortPuzzle,
          coordinate: validCoordinate,
          value: validValue,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("check puzzle placement with invalid coordinates", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: invalidCoordinate,
          value: validValue,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("check puzzle placement with invalid value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: validCoordinate,
          value: invalidValue,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid value" });
          done();
        });
    });
  });
});
