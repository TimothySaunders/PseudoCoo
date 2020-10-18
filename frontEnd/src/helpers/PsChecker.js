// will aid the game by blocking entering numbers already in the grid.
// import StringParser from './StringParser'

export default class PsChecker {

}

    PsChecker.prototype.validateEntry = function(index, grid, cellValue) {
    // console.log(" entered: "+ cellValue)
    // take game state which is an array of cess and extract the value , one numerical for each cell, hence length of resulting sting should be 81
    var stringGrid = "";
    grid.forEach(element => {
    stringGrid += element.value;
});
    // console.log(stringGrid.length)
    if (stringGrid.length!==81) {
    console.log("you have made changes gamestate format")
    return false;
} else {


    // estblish all characters in the same row,column, box as the index pased into the function (index of cell clicked)
    // SAME ROW
    const currentRowNumber = Math.floor(index/9);
    var currentRow = stringGrid.substr(currentRowNumber*9, 9);
    // SAME COLUMN
    const currentColumnNr =index%9;
    var currentColumn ="";
    for (var i =0; i<stringGrid.length; i++) {
    if (i%9 === currentColumnNr) {
    currentColumn += stringGrid[i];
}
}
    // SAME BOX
    var currentBox="";
    const boxRow = Math.floor(currentRowNumber/3)
    const boxcolumn = Math.floor(currentColumnNr/3)
    const startCell= (27*boxRow+3*boxcolumn)
    currentBox += stringGrid.substr(startCell, 3);
    currentBox += stringGrid.substr(startCell+9, 3);
    currentBox += stringGrid.substr(startCell+18, 3);

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





}
