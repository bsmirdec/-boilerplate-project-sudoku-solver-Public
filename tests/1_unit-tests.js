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
  test("81 valid characters string should be true", () => {
    assert.isTrue(solver.validate(validString));
  });
  test("81 invalid characters string should be falsy", () => {
    assert.isFalse(solver.validate(invalidString));
  });
  test("short valid characters string should be falsy", () => {
    assert.isFalse(solver.validate(shortString));
  });
});
