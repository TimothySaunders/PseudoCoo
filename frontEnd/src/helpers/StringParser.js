// helpers to convert strings

/*
    - A game can be represented by a string of 81 numbers. Blank spaces can be represented by a '0', '.' or ' ' (space).
    - Parsing the string will create a string of cells.
    - Cells are separated by '#'
    - Interally, cells are separated by '|'
    0            |            e            |            16            #
    ^value      ^divider     ^editable    ^divider     ^notes(1, 6)   ^end of cell
*/


export default class Parser  {

}

/**
 * takes an 81 char input string and converts to cell array
 * @input "017480....."
 * @param {str} inputString
 * @returns ["0|e|#", "1|n|#", "7|n|#", "4|n|#", "8|n|#", "0|e|#".....]
 */
Parser.prototype.formatRawStringToCells = function (inputString) {
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
                if (chunk === "0" || chunk === "." || chunk === " ") {
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
 * @input ["0|e|#", "1|n|#", "7|n|#", "4|n|#", "8|n|#", "0|e|#".....]
 * @param {array} inputArray 
 * @output "0|e|#1|n|#7|n|#4|n|#8|n|#0|e|#...."
 */
Parser.prototype.formatCellsToString = function(inputArray) {
    let outputString = inputArray.join("");
    return outputString;
}

/**
 * takes a formatted input string from formatCellsToString and returns an array of cell objects
 * @input "0|e|#1|n|#7|n|#4|n|#8|n|#0|e|#...."
 * @param {string} parsedInputString 
 * @output [{value: 0, editable: true, notes: []}, {value:1, editable: false, notes: []},....]
 */
Parser.prototype.getObjectsFromSavedString = function (parsedInputString) {
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
 * @input [{value: 0, editable: true, notes: [1, 5]}, {value:1, editable: false, notes: []},....]
 * @param {array[{}]} inputObjectArray 
 * @return "0|e|15#1|n|#7|n|#4|n|#8|n|#0|e|279#...."
 */
Parser.prototype.convertObjectsToSaveString = function (inputObjectArray) {
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
 * @input [{value: 0, editable: true, notes: [1, 5]}, {value:1, editable: false, notes: []},....]
 * @param {array[{}]} inputObjectArray 
 * @output "017480....."
 */
Parser.prototype.getRawStringFromObjects = function (inputObjectArray) {
    let outputString = "";
    inputObjectArray.forEach(cell => {
        outputString += cell.value;
    });
    return outputString;
}

/**
 * output an 81 char string from a formatted cells string
 * @input "0|e|15#1|n|#7|n|#4|n|#8|n|#0|e|279#...."
 * @param {string} inputCellsString 
 * @output "017480....."
 */
Parser.prototype.getRawStringFromCells = function (inputCellsString) {
    const split = inputCellsString.split("#");
    split.pop(); //removes the last element - it was blank. length now 81
    let outputString = "";
    split.forEach(cell => {
        outputString += cell[0];
    });
    console.log(outputString);

}

Parser.prototype.getObjects = function (rawInput) {
    console.log(this.formatCellsToString(this.formatRawStringToCells(rawInput)))
    return this.getObjectsFromSavedString(this.formatCellsToString(this.formatRawStringToCells(rawInput)));
}

// export default Parser;