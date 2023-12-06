function copy(text) {
  const textarea = document.createElement("textarea"); // Create a temporary textarea element
  textarea.value = text;

  document.body.appendChild(textarea); // Append the textarea to the DOM
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea); // Remove the temporary textarea
}

function getColumnOffset(columnName) {
  console.log(columnName);
  // Match only non-digits. 'A' has ASCII code 65
  return columnName
    .match(/\D/g)
    .reduce((acc, c) => (acc = acc * 26 + c.charCodeAt(0) - 64), 0);
}

function getColumnName(num, row) {
  const result = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  while (num > 0) {
    const remainder = (num - 1) % 26;
    result.unshift(alphabet[remainder]);
    num = Math.floor((num - 1) / 26);
  }

  return result.join("") + row;
}

function revAlpha(alphabet, chars) {
  return alphabet.filter((char) => !chars.includes(char));
}

const sheetLetterColumns = [
  "P2",
  "Q2",
  "R2",
  "S2",
  "T2",
  "U2",
  "V2",
  "W2",
  "X2",
  "Y2",
  "Z2",
  "AA2",
  "AB2",
  "AC2",
  "AD2",
  "AE2",
  "AF2",
  "AG2",
  "AH2",
  "AI2",
];

function getUseMap(charSet, height, width) {
  // Using 'null' to create a new object instead of a new reference
  let result = Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => [])
    );
  const chars = Object.keys(charSet);

  Object.values(charSet).forEach((char, i) => {
    char.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell != "" && !result[rowIndex][cellIndex].includes(chars[i])) {
          result[rowIndex][cellIndex].push(chars[i]);
        }
      });
    });
  });

  return result;
}

let sheetsFormulas = "";

function getSheetsFormulas(columns, useMap, charSet, gapCount) {
  const chars = Object.keys(charSet);

  const result = useMap.map((row) => {
    let newRow = [];

    columns.forEach((column) => {
      let newCell = [];
      row.forEach((cell) => {
        if (cell.length === 0) {
          newCell.push("");
          return;
        }
        if (cell.length > chars.length / 2) {
          newCell.push(
            `=NOT(OR(${revAlpha(chars, cell)
              .map((char) => `${column}="${char}"`)
              .join(", ")}))`
          );
        } else {
          // Increase readability by switching comparison logic
          if (cell.length > 5) {
            newCell.push(
              `=ISNUMBER(MATCH(${column}, {${cell
                .map((char) => `"${char}"`)
                .join(", ")}}, 0))`
            );
          } else {
            newCell.push(
              `=OR(${cell.map((char) => `${column}="${char}"`).join(", ")})`
            );
          }
        }
      });
      newRow.push(newCell.join("\t"));
    });
    // Skip one cell to add a space betweent the chars
    return newRow.join(`\t${"\t".repeat(gapCount)}`);
  });

  sheetsFormulas = result.join("\n");
}

let useMap = getUseMap(CHARSET_7_5, 7, 5);
getSheetsFormulas(sheetLetterColumns, useMap, CHARSET_7_5, 1);

function copySheetsFormulas() {
  copy(sheetsFormulas);
}

function getStartColumn() {
  let startColumn = document.getElementById("input-start-column").value;
  let columnOffset = getColumnOffset(startColumn);
  console.log(columnOffset);
  for (let i = 0; i < 20; i++) {
    console.log(getColumnName(columnOffset + i, 1));
  }
}
