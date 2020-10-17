
// example string:
const basicString = "003020600900305001001806400008102900700000008006708200002609500800203009005010300";

/**
 * takes an 81 char input string and converts to cell array
 * @param {str} inputString
 */
const formatStringToCells = function (inputString) {
    const regex = /([A-Za-z])+/;
    // make sure you've got a correct length string
    if (inputString.length === 81) {
        // make sure you've got only numbers present
        if (!inputString.match(regex)) {
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
            console.log("Input has got letters in it! it should only be numbers!");
            return false;
        }
    } else {
        console.log(`Input is not the right length! It's ${inputString.length} not 81`);
        return false;
    }
}

const formatCellsToString = function (inputArray) {
    let outputString = inputArray.join("");
    return outputString;

}


// formatCellsToString(parsed);
// let foo = parsed.join("");
// console.log(foo);

