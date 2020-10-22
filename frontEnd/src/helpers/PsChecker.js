// will aid the game by blocking entering numbers already in the grid.
// import StringParser from './StringParser'

export default class PsChecker {
}
    // Function to take an index value of a targeted cell, the grid which is an array of cells, and the current cell's value.
    PsChecker.prototype.validateEntry = function(index, grid, cellValue) {

    //Create an empty string
    var stringGrid = "";
    //extract the .value from each object(Cell) in the 'grid' and add the value to the empty string. 
    grid.forEach(element => {
    stringGrid += element.value;
});
    // If the process took in a correct grid, there shoult be 81 characters --> one for each cell in a 9x9 grid, the method returns false at this stage if the generated string is not 81characters long
    if (stringGrid.length!==81) {
    console.log("you have made changes gamestate format")
    return false;
} else {            //Otherwise continue and: 

    // estblish all characters in the same ROW,COLUMN, BOX as the index pased into the function (index of cell clicked)

    //!ROW
    // Identify currentRowNumber using the index/9
    const currentRowNumber = Math.floor(index/9);
    //identify the string of characters in the current row - it is the substring of the string grid, starting at index rowNumber*9 and spanning 9 characters.
    var currentRow = stringGrid.substr(currentRowNumber*9, 9);

    //!COLUMN
    const currentColumnNr =index%9;             // columnNr is the remainder of index divded by 9;
    var currentColumn ="";                      // establish an empty string to store characters
    for (var i =0; i<stringGrid.length; i++) {  //loop over all characters in the grid 
        if (i%9 === currentColumnNr) {          //and if the reminder of their index%9 is the same as the column number 
            currentColumn += stringGrid[i];     //add it to the current column string.
        }
    }
    // !BOX
    var currentBox="";                                  //establish an empty string 
    const boxRow = Math.floor(currentRowNumber/3)       //establish a the boxRow (which is the row/3 rounded down to a whole number)
    const boxcolumn = Math.floor(currentColumnNr/3)     //establish a the boxColumn (which is the column/3 rounded down to a whole number)                  
    const startCell= (27*boxRow+3*boxcolumn)            //establish the index of the first cell in the box (each box row has 27 charactres, and columns are 3 cells wide)
    currentBox += stringGrid.substr(startCell, 3);      //add the 3 characters matching starting at the startCell
    currentBox += stringGrid.substr(startCell+9, 3);    //add the 3 characters matching 9 characters down in the string
    currentBox += stringGrid.substr(startCell+18, 3);   //again add the 3 characters matching a further 9 characters down in the string

    const combined = currentRow +  currentColumn + currentBox;  //merge the values in ROW, COLUMN and BOX into 1 string.
    // return combined.indexOf(cellValue) === -1;          //Return true IF the cellValue passed into the funciton is not present in the final combined string.

    // could be used too


    // Identify all unique string values, romoving all '.' characters (not necessary)   
    /// 
    //extension: 
    var stringOfUniques ="";
    for (var j=0; j<combined.length; j++) {

    if (stringOfUniques.indexOf(combined[j]) === -1 && combined[j] !== ".") {
    stringOfUniques += combined[j];
}
}
    return stringOfUniques.indexOf(cellValue) === -1;
}






}
    PsChecker.prototype.validateEntryStringGrid = function(index, grid, cellValue) {
    // console.log(" entered: "+ cellValue)
    // take game state which is an array of cess and extract the value , one numerical for each cell, hence length of resulting sting should be 81


    // estblish all characters in the same row,column, box as the index pased into the function (index of cell clicked)
    // SAME ROW
    const currentRowNumber = Math.floor(index/9);
    var currentRow = grid.substr(currentRowNumber*9, 9);
    // SAME COLUMN
    const currentColumnNr =index%9;
    var currentColumn ="";
    for (var i =0; i<grid.length; i++) {
    if (i%9 === currentColumnNr) {
    currentColumn += grid[i];
}
}
    // SAME BOX
    var currentBox="";
    const boxRow = Math.floor(currentRowNumber/3)
    const boxcolumn = Math.floor(currentColumnNr/3)
    const startCell= (27*boxRow+3*boxcolumn)
    currentBox += grid.substr(startCell, 3);
    currentBox += grid.substr(startCell+9, 3);
    currentBox += grid.substr(startCell+18, 3);

    // Identify all unique string values, romoving all '.' characters (not necessary)

    const combined = currentRow +  currentColumn + currentBox;
    // return combined.indexOf(cellValue) === -1;  // could be used too

    /// 

    //extension: 
    var stringOfUniques ="";
    for (var j=0; j<combined.length; j++) {

    if (stringOfUniques.indexOf(combined[j]) === -1 && combined[j] !== ".") {
    stringOfUniques += combined[j];
}
}

    return stringOfUniques.indexOf(cellValue) === -1;

}
