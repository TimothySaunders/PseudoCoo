
// example string:
const basicString = "003020600900305001001806400008102900700000008006708200002609500800203009005010300";

/**
 * takes an 81 char input string and converts to cell array
 * @param {str} inputString
 */
const formatStringToCells = function (inputString) {
    if (inputString.length === 81) {
        let chunks = inputString.split("");
        let output = [];
        for (let chunk of chunks) {
            let outputString = "";
            // if it's a 0 or . it's user (e)ditable
            if (chunk === "0" || chunk === ".") {
                outputString += chunk + "|e|#";
            } else {
                // it's part of the original grid, make it (n)ot editable
                outputString += chunk + "|n|#";
            }
            output.push(outputString);
        }

        return output;
    } else {
        console.log(`Input is not the right length! It's ${inputString.length} not 81`);
        return false;
    }
}

const formatCellsToString = function (inputArray) {
    let outputString = inputArray.join("");
    return outputString;

}

let parsed = formatStringToCells(basicString);

formatCellsToString(parsed);
let foo = parsed.join("");
// console.log(foo);

