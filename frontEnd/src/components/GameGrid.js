import React, { Component,} from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";
import sudoku from '../helpers/sudoku';
import PsChecker from '../helpers/PsChecker';




import Parser from "../helpers/StringParser";
const sp = new Parser();
const psc = new PsChecker();


export default class GameGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: [],
            writeNotes: false
        }
        this.handleNumberInput = this.handleNumberInput.bind(this);
        this.toggleNotes = this.toggleNotes.bind(this);
        
    }


    componentDidMount() {
        let gameState;
        if (this.props.game.gridValues.length === 81) {
            gameState = sp.getObjects(this.props.game.gridValues);
        } else {
            gameState = sp.getObjectsFromSavedString(this.props.game.gridValues);
        }
        this.setState({ gameState: gameState });
    }

    // voiceContains()

    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }
    solve = () => {
        this.clear(); //! Needs to be run so that it eliminates any invalid entries, trying to solve 
        // const solution = sudoku.sudoku.solve(this.props.game.gridValues);
        let toConvert = sp.getRawStringFromObjects(this.state.gameState)
        toConvert.replace("0",".");
        const solution = sudoku.sudoku.solve(toConvert);

        // const solution = sudoku.sudoku.solve(sp.getRawStringFromObjects(this.state.gameState));

        let prevState = this.state.gameState;
        let gameState = sp.getObjects(solution);
        prevState = prevState.map((cell, index) => {
            cell.value = gameState[index].value;
            return cell;
        });
        this.setState({ gameState: prevState });
    }

    // takeVoiceCommand = (command) => {
    //     if (command.includes("solve")){
    //         this.solve();
    //     }
    // }

    clear = () => {
        let cells = this.state.gameState;
        cells = cells.map(cell => {
            if (cell.editable) {
                cell.value = ".";
                cell.notes = [];
            }
            return cell;
        });
        this.setState({ gameState: cells });
    }

    gridIsStillSolvable = () => {
        var solvable = true;
        let grid = sp.getRawStringFromObjects(this.state.gameState);
        if(sudoku.sudoku.solve(grid)===false){
            solvable = false;
        }
        return solvable;
        
    }

    gridIsFilled = () => {
        // let grid = sp.getRawStringFromObjects(this.state.gameState);
        return !sp.getRawStringFromObjects(this.state.gameState).includes(".")
        // return !(grid).includes(".")
        
    }

   



    handleNumberInput(index, newCell, display) {
        let updated = this.state.gameState;

        if(!this.state.writeNotes){
            
            updated[index] = newCell;
            this.setState({ gameState: updated });
        } else {

            if (newCell.value.match(/[1-9]/) ) {
                if( !newCell.notes.includes(newCell.value)){
                newCell.notes.push(newCell.value);
                newCell.value="."
                }
                if ( newCell.notes.includes(newCell.value)){
                    const r = newCell.notes.pop(newCell.value);
                    newCell.value=".";
                }
            }
            display.textContent =""
            
        }
        // VALIDATE game finished on click//!! 
        (this.gridIsStillSolvable() && this.gridIsFilled()) ? console.log("Moooooo - you have won") : console.log("The game is not finished");     // ! this is for THE victory COW display/
       

        //! prevent invalid input being entered into cell // rephrase to validae all inputs
        // if(!psc.validateEntry(index,this.state.gameState,newCell.value)) {
        //     newCell.value =".";
        //      display.textContent ="";
        // }

    }

    handleSaveGame(index){
        const gridValues = sp.convertObjectsToSaveString(this.state.gameState);
        this.props.saveGame(gridValues);
    }


    hint = () => {

    }
    showConflict =() => {
       return true;
    }


    render() {
        
        const gridCells = this.state.gameState.map((cell, i) => {
            if(!cell.editable) {
            return (<GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit}/>)
            } else {
            return (<GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} showConflict={this.showConflict}/>)
            }
        });


        return (
            <div id="game-container">
                <div id="game-grid">
                    {gridCells}
                </div>
                <button onClick={this.solve} > Solve</button><br/>
                <button onClick={this.conflicts} > Find Conflicts</button><br/>
                <button onClick={this.hint} > Hint</button><br/>

                <button onClick={this.toggleNotes}>{this.state.writeNotes ? "Enter numbers" : "Enter notes"}</button>
                <button onClick={this.clear} >Clear</button>
                <button onClick={this.handleSaveGame} >Save</button>
                {/* <button onClick={ () => this.props.voiceInput(['hello','apple'])} >test voice passed down</button> */}

            
    
            </div>
        )
    }
}
