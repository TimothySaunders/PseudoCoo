
// example string:
const basicString = "003020600900305001001806400008102900700000008006708200002609500800203009005010300";
const formatString = "0|e|512#0|e|12#3|n|#0|e|#2|n|#0|e|#6|n|#0|e|#0|e|#9|n|#0|e|#0|e|#3|n|#0|e|#5|n|#0|e|#0|e|#1|n|#0|e|#0|e|#1|n|#8|n|#0|e|#6|n|#4|n|#0|e|#0|e|#0|e|#0|e|#8|n|#1|n|#0|e|#2|n|#9|n|#0|e|#0|e|#7|n|#0|e|#0|e|#0|e|#0|e|#0|e|#0|e|#0|e|#8|n|#0|e|#0|e|#6|n|#7|n|#0|e|#8|n|#2|n|#0|e|#0|e|#0|e|#0|e|#2|n|#6|n|#0|e|#9|n|#5|n|#0|e|#0|e|#8|n|#0|e|#0|e|#2|n|#0|e|#3|n|#0|e|#0|e|#9|n|#0|e|#0|e|#5|n|#0|e|#1|n|#0|e|#3|n|#0|e|#0|e|#";

/**
 * takes an 81 char input string and converts to cell array
 * @param {str} inputString
 */
const formatRawStringToCells = function (inputString) {
    // make sure you've got a correct length string
    if (inputString.length === 81) {
        // make sure you've got only numbers present
        const regex = /([a-z])+/gi;
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

/**
 * takes the output from formatRawStringToCells and converts to a string
 * @param {array} inputArray 
 */
const formatCellsToString = function (inputArray) {
    let outputString = inputArray.join("");
    return outputString;
}

/**
 * takes a formatted input string from formatCellsToString and returns an array of cell objects
 * @param {string} parsedInputString 
 */
const getObjectsFromSavedString = function (parsedInputString) {
    const split = parsedInputString.split("#");
    const cellObjects = [];
    split.pop(); //removes the last element - it was blank. length now 81
    split.forEach(cell => {
        let cellObj = {};
        let pieces = cell.split("|");
        cellObj.value = pieces[0];
        cellObj.editable = pieces[1] === "e" ? true : false;
        cellObj.notes = pieces[2].split("");
        cellObjects.push(cellObj);
    });
    console.log(cellObjects);
    return cellObjects;
}

/**
 * takes the object array from getObjectsFromSavedString and returns a formatted string
 * @param {array[{}]} inputObjectArray 
 */
const convertObjectsToSaveString = function (inputObjectArray) {
    let saveString = "";
    inputObjectArray.forEach(cell => {
        let value = cell.value;
        let editable = (cell.editable ? "e" : "n");
        let notes = cell.notes.join("");
        saveString += value + "|" + editable + "|" + notes + "#";
    });
    return saveString;
}

/**
 * output an 81 char string from an array of cell objects
 * @param {array[{}]} inputObjectArray 
 */
const getRawStringFromObjects = function (inputObjectArray) {
    let outputString = "";
    inputObjectArray.forEach(cell => {
        outputString += cell.value;
    });
    return outputString;
}

/**
 * output an 81 char string from a formatted cells string
 * @param {string} inputCellsString 
 */
const getRawStringFromCells = function (inputCellsString) {
    const split = inputCellsString.split("#");
    split.pop(); //removes the last element - it was blank. length now 81
    let outputString = "";
    split.forEach(cell => {
        outputString += cell[0];
    });
    console.log(outputString);

}



// let parsed = formatRawStringToCells(basicString);
// parsed = formatCellsToString(parsed);
// getRawStringFromCells(parsed);


// let foo = formatCellsToString(parsed);
// // let foo = parsed.join("");
// // console.log(foo);
// let bar = getObjectsFromSavedString(formatString);
// console.log(foo);
// console.log(convertObjectsToSaveString(bar));

