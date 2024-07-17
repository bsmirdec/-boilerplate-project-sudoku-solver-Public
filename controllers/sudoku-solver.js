class SudokuSolver {
  constructor() {
    this.lettersToNum = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
    };
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    const chars = puzzleString.split("");
    for (let char of chars) {
      if (isNaN(char) && char !== ".") {
        return { error: "Invalid characters in puzzle" };
      }
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzleValues = puzzleString.split("");
    const rowNum = this.lettersToNum[row];
    const rowValues = puzzleValues.slice(rowNum * 9, rowNum * 9 + 9);
    if (rowValues.includes(value.toString())) {
      return false;
    }
    if (!isNaN(rowValues[column - 1])) {
      return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzleValues = puzzleString.split("");
    const rowNum = this.lettersToNum[row];
    const colValues = [];
    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleValues[i * 9 + column - 1]);
    }
    if (colValues.includes(value.toString())) {
      return false;
    }
    if (!isNaN(colValues[rowNum])) {
      return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleValues = puzzleString.split("");
    const rowNum = this.lettersToNum[row];
    const regionRow = Math.floor(rowNum / 3) * 3;
    const regionCol = Math.floor((column - 1) / 3) * 3;
    const regionValues = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        regionValues.push(puzzleValues[(regionRow + i) * 9 + regionCol + j]);
      }
    }

    if (regionValues.includes(value.toString())) {
      return false;
    }
    if (!isNaN(puzzleValues[rowNum * 9 + column - 1])) {
      return false;
    }
    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== true) {
      return this.validate(puzzleString);
    }
  }
}

module.exports = SudokuSolver;
