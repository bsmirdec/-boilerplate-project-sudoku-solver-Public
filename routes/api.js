"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();

module.exports = function (app) {
  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Verify missing fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    // Verify puzzle
    const puzzleValidationError = solver.validate(puzzle);
    if (puzzleValidationError !== true) {
      return res.json(puzzleValidationError);
    }

    // Verify coordinate
    const coordinateRegex = /^[A-I][1-9]$/;
    if (!coordinate.match(coordinateRegex)) {
      return res.json({ error: "Invalid coordinate" });
    }
    const row = coordinate.charAt(0);
    const column = parseInt(coordinate.charAt(1), 10);

    // Verify value
    if (isNaN(value) || value < 1 || value > 9) {
      return res.json({ error: "Invalid value" });
    }

    // Verify placement
    const valueIndex = solver.getCellIndex(row, column);
    if (puzzle[valueIndex] === value) {
      return res.json({ valid: true });
    } else {
      const result = solver.checkPlacement(puzzle, row, column, value);
      return res.json(result);
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    // check for puzzle
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    // puzzle string validation
    const validationError = solver.validate(puzzle);
    if (validationError !== true) {
      return res.json(validationError);
    }

    // solve puzzle
    const solution = solver.solve(puzzle);
    if (solution) {
      return res.json({ solution: solution });
    }

    return res.json({ error: "Puzzle cannot be solved" });
  });
};
