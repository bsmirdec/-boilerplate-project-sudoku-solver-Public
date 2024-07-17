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
    this.numToLetter = {
      0: "A",
      1: "B",
      2: "C",
      3: "D",
      4: "E",
      5: "F",
      6: "G",
      7: "H",
      8: "I",
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

  getCellIndex(row, column) {
    const rowNum = this.lettersToNum[row];
    const index = rowNum * 9 + column - 1;
    return index;
  }

  getCellCoordinate(index) {
    const rowNum = Math.floor(index / 9);
    const row = this.numToLetter[rowNum];
    const column = (index % 9) + 1;
    return { row: row, column: column };
  }

  getCellRegionValues(puzzleValues, row, column) {
    const rowNum = this.lettersToNum[row];
    const regionRow = Math.floor(rowNum / 3) * 3;
    const regionCol = Math.floor((column - 1) / 3) * 3;
    const regionValues = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        regionValues.push(puzzleValues[(regionRow + i) * 9 + regionCol + j]);
      }
    }
    return regionValues;
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
    const regionValues = this.getCellRegionValues(puzzleValues, row, column);

    if (regionValues.includes(value.toString())) {
      return false;
    }
    if (!isNaN(puzzleValues[rowNum * 9 + column - 1])) {
      return false;
    }
    return true;
  }

  checkPlacement(puzzleString, row, column, value) {
    const conflicts = [];
    if (!this.checkRowPlacement(puzzleString, row, column, value)) {
      conflicts.push("row");
    }
    if (!this.checkColPlacement(puzzleString, row, column, value)) {
      conflicts.push("column");
    }
    if (!this.checkRegionPlacement(puzzleString, row, column, value)) {
      conflicts.push("region");
    }
    if (conflicts.length === 0) {
      return { valid: true };
    } else if (conflicts.length === 1) {
      return { valid: false, conflict: conflicts[0] };
    } else {
      return { valid: false, conflict: conflicts };
    }
  }

  solve(puzzleString) {
    const validationError = this.validate(puzzleString);
    if (validationError !== true) {
      return false;
    }
    const puzzleValues = puzzleString.split("");
    // get first "."
    for (let i = 0; i < puzzleValues.length; i++) {
      if (puzzleValues[i] === ".") {
        const currentIndex = i;
        const { row, column } = this.getCellCoordinate(currentIndex);

        // get the current region values
        const regionValues = this.getCellRegionValues(
          puzzleValues,
          row,
          column
        );

        // get the region missing values
        const missingValues = [];
        for (let j = 1; j < 10; j++) {
          const numString = j.toString();

          if (regionValues.indexOf(numString) === -1) {
            missingValues.push(numString);
          }
        }

        // set a while loop to try each of the missing values
        let count = 0;
        while (count < missingValues.length) {
          // check for the value
          const valueToTry = missingValues[count];
          const placement = this.checkPlacement(
            puzzleString,
            row,
            column,
            valueToTry
          );

          // if value fits, replace the current "." with value to try
          if (placement.valid) {
            puzzleValues[currentIndex] = missingValues[count];
            const newPuzzleString = puzzleValues.join("");
            const solvedPuzzle = this.solve(newPuzzleString);
            if (solvedPuzzle) {
              return solvedPuzzle;
            }
            puzzleValues[currentIndex] = ".";
          }
          count += 1;
        }
        return false;
      }
    }
    return puzzleString;
  }
}

module.exports = SudokuSolver;
