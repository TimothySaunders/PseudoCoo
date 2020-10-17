// will aid the game by blocking entering numbers already in the grid.
// import StringParser from './StringParser'

export default class PsChecker{

}

    PsChecker.prototype.validateEntry = function(index, grid) {

    // const sp = new StringParser;

    var stringGrid = "";
    grid.forEach(element => {
        stringGrid += element.value;
    });

    const inx = index;
    const currentGrid = grid;

    const currentRow = grid.map(element => {
        
    });

    const currentColumn ="";
    const currentBox="";

    return stringGrid;
    }
