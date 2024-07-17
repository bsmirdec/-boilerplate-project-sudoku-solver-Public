"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    const coordinateRegex = /[A-I][1-9]/;
    if (!coordinate.match(coordinateRegex)) {
      res.json({ error: "Invalid coordinate" });
    }
    const row = coordinate[0];
    const column = parseInt(coordinate[1]);
    console.log(row, column);
    if (solver.validate(puzzle) !== true) {
      return res.json(solver.validate(puzzle));
    }
    res.json({ success: "OK for now" });
  });

  app.route("/api/solve").post((req, res) => {});
};
