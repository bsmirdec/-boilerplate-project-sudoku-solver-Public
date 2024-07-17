class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    const chars = puzzleString.split("");
    for (let char of chars) {
      if (isNaN(char) && char !== ".") {
        return false;
      }
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
