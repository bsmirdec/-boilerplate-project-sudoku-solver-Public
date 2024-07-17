const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  const validPuzzle =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const validSolution =
    "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
  const invalidCharPuzzle =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..?.926914.37.";
  const invalidShortPuzzle =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92";
  const unsolvablePuzzle =
    "1.5..2.84..66.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  suite("/api/check tests", () => {
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
    test("check puzzle placement with one conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: validCoordinate,
          value: 3,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: false,
            conflict: "column",
          });
          done();
        });
    });
    test("check puzzle placement with multiple conflicts", (done) => {
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
    test("check puzzle placement with all conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: validCoordinate,
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["row", "column", "region"],
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
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
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
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
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
          assert.deepEqual(res.body, { error: "Invalid coordinate" });
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

  suite("/api/solve tests", () => {
    test("puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(res.body.solution, validSolution);
          done();
        });
    });
    test("puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field missing" });
          done();
        });
    });
    test("puzzle with invalid characters puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidCharPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });
    test("puzzle with incorrect length puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidShortPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });
    test("puzzle that cannot be solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: unsolvablePuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
  });
});
