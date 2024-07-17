const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");
let solver = new SudokuSolver();

suite("Unit Tests", () => {
  const validString =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const invalidString =
    "1.5..2.84..63.12.7.2..5...?.9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const shortString = "13431...124...";
  suite("string validation tests", () => {
    test("81 valid characters string should be true", () => {
      assert.isTrue(solver.validate(validString));
    });
    test("81 invalid characters string should be falsy", () => {
      assert.deepEqual(solver.validate(invalidString), {
        error: "Invalid characters in puzzle",
      });
    });
    test("short valid characters string should be falsy", () => {
      assert.deepEqual(solver.validate(shortString), {
        error: "Expected puzzle to be 81 characters long",
      });
    });
  });

  suite("check placement tests", () => {
    test("check a valid row placement", () => {
      assert.isTrue(solver.checkRowPlacement(validString, "A", 5, 6));
      assert.isTrue(solver.checkRowPlacement(validString, "H", 5, 4));
    });
    test("check a invalid row placement", () => {
      assert.isFalse(solver.checkRowPlacement(validString, "I", 5, 7));
      assert.isFalse(solver.checkRowPlacement(validString, "B", 6, 1));
    });
    test("check a valid column placement", () => {
      assert.isTrue(solver.checkColPlacement(validString, "A", 5, 7));
      assert.isTrue(solver.checkColPlacement(validString, "E", 9, 2));
    });
    test("check a invalid column placement", () => {
      assert.isFalse(solver.checkColPlacement(validString, "I", 5, 7));
      assert.isFalse(solver.checkColPlacement(validString, "B", 8, 9));
    });
    test("check a valid region placement", () => {
      assert.isTrue(solver.checkRegionPlacement(validString, "A", 5, 7));
      assert.isTrue(solver.checkRegionPlacement(validString, "E", 9, 2));
    });
    test("check a invalid region placement", () => {
      assert.isFalse(solver.checkRegionPlacement(validString, "I", 5, 7));
      assert.isFalse(solver.checkRegionPlacement(validString, "B", 8, 2));
    });
  });

  suite("solver logic tests", () => {
    test("valid puzzle strings pass the solver", () => {});
    test("returns the expected solution for an incomplete puzzle", () => {
      assert.deepEqual(solver.solve(shortString), {
        error: "Expected puzzle to be 81 characters long",
      });
      assert.deepEqual(solver.solve(invalidString), {
        error: "Invalid characters in puzzle",
      });
    });
  });
});
