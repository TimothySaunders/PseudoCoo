import React, { Component, Fragment, } from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";
import sudoku from '../helpers/sudoku';
import PsChecker from '../helpers/PsChecker';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition' //! 
import Parser from "../helpers/StringParser";
import confetti from "canvas-confetti";


const sp = new Parser();
const psc = new PsChecker();


export default class GameGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: [],
            writeNotes: false,
            showConflictToggle: false,
            grid:"",
            hint:null
        }
        this.handleNumberInput = this.handleNumberInput.bind(this);
        this.toggleNotes = this.toggleNotes.bind(this);
        this.showConflict = this.showConflict.bind(this);
        this.hint = this.hint.bind(this);

    }


    componentDidMount() {
        this.props.resizeGrid();
        let gameState;

        if (this.props.game.gridValues.length === 81) {
            gameState = sp.getObjects(this.props.game.gridValues);
        } else {
            gameState = sp.getObjectsFromSavedString(this.props.game.gridValues);
        }
        let getGrid = sp.getRawStringFromObjects(gameState);
        this.setState({ gameState: gameState, grid: getGrid });

        if (this.props.cowTimer){
            this.props.cowTimer.startTimer(1, 2, "PSEUDOCOO!")
            setTimeout(()=>{this.props.cowTimer.startTimer(18, 25, "hint")}, 1500)
        }
    }


    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }
    solve = () => {
        // this.clear(); //! Needs to be run so that it eliminates any invalid entries, trying to solve 
        // const solution = sudoku.sudoku.solve(this.props.game.gridValues);
        // let toConvert = sp.getRawStringFromObjects(this.state.gameState)
        // toConvert.replace("0", ".");
        let toConvert = sp.getRawStringFromObjects(this.state.gameState);
        toConvert.replace("0", ".");  //! May need to be removed
        const solution = sudoku.sudoku.solve(toConvert);
        if (solution) {
            let prevState = this.state.gameState;
            let gameState = sp.getObjects(solution);
            prevState = prevState.map((cell, index) => {
                cell.value = gameState[index].value;
                return cell;
            });
            this.setState({ gameState: prevState });
            this.confettiCannon();
        }
    }

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
        if (sudoku.sudoku.solve(grid) === false) {
            solvable = false;
        }
        return solvable;

    }

    gridIsFilled = () => {
        // let grid = sp.getRawStringFromObjects(this.state.gameState);
        return !sp.getRawStringFromObjects(this.state.gameState).includes(".")
        // return !(grid).includes(".")
        
    }

    gridIsSolved = () => {
        const currentGameState = sp.getRawStringFromObjects(this.state.gameState);
        console.log(currentGameState);
        const solution = sudoku.sudoku.solve(currentGameState);
        console.log(solution);
        if (currentGameState === solution) {
            return true;
        }
        return false;
    }

    confettiCannon() {
        var count = 250;
        var defaults = {
            origin: { y: 0.8 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, {
            spread: 56,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 120,
        });
        fire(0.55, {
            spread: 180,
            decay: 0.90,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.2, {
            spread: 120,
            startVelocity: 55,
        });
    }

    // handleNumberInput(index, newCell, display) {
    handleNumberInput(index, cell, display, input) {
        let updated = this.state.gameState;

        if (this.state.writeNotes) {
            // write some notes
            if (input.match(/[1-9]/)) {
                if (cell.notes.includes(input)) {
                    cell.notes = cell.notes.filter(note => note !== input);
                } else {
                    cell.notes.push(input);
                }
            }
        } else {
            // write into the box
            cell.value = input;
        }
        updated[index] = cell;
        if (this.gridIsSolved()) {
            this.confettiCannon();
        }
        display.textContent = ["0", "."].includes(cell.value) ? "" : cell.value;
        this.setState({ gameState: updated });
    }

    handleSaveGame = () => {
        const gridValues = sp.convertObjectsToSaveString(this.state.gameState);
        this.props.saveGame(gridValues);
    }


    hint = () => {
        /// solve the sudoku
        let toConvert = sp.getRawStringFromObjects(this.state.gameState);
        toConvert.replace("0", ".");
        const solution = sudoku.sudoku.solve(toConvert);
        let hints = []
        if (solution) {
            console.log("solution: " + solution + "< --- " );
            let gridObjects = this.state.gameState
           for(let i=0;i< gridObjects.length; i++){                  //
               if (gridObjects[i].editable) {                     //
                   hints.push([i,solution[i]])     // should create a list of the solutions (excluding uneditable cells) 
               }
           } 
        }
        this.setState({hint: hints[0]});
        // this.setState(gameState[hints[0][0]].editable:false,gameState[hints[0][0]].value=hints[0][1])
        let index = hints[0][0];
        let value = hints[0][1];
        let updated = this.state.gameState;
        let cell = updated[index];
        cell.editable = false;
        cell.value = value;
        updated[index]=cell;
        this.setState({gameState: updated});
        // this.setState({gameState[index].editable: false})
            
            
            // ,gameState[hints[0][0]].value=hints[0][1])
        // console.log("hints: " + hints[0] + "< --- " );
        // console.log("hints: " + hints[1] + "< --- " );
        // console.log("hints: " + hints[2] + "< --- " );

        /// comlpile a list of all the indexes for the editable cells
        /// pick a random index
        /// pass the solution into that cells notes. 
        

    }
    
    toggleShowConflict = () => {
        this.setState({ showConflictToggle: !this.state.showConflictToggle })
        // this.setState({ grid : sp.getRawStringFromObjects(this.state.gameState)})

    }

    showConflict(i, grid, cell) {

        // let grid  = sp.getRawStringFromObjects(this.state.gameState);
        if (this.toggleShowConflict) {
            return psc.validateEntry(i, grid, cell.value)
        }
    }

    grid = () => {
        return sp.getRawStringFromObjects(this.state.gameState);
    }

    returnHome = () => {
        this.props.cowTimer.endTimer()
        this.props.returnHome();
    }

    render() {

        const gridCells = this.state.gameState.map((cell, i) => {


            if (!cell.editable) {
            return (
            
                <GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} hint={this.state.hint}/>
            )
        } else { return (<GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} grid={this.state.grid} showConflict={this.showConflict} showConflictToggle={this.state.showConflictToggle} hint={this.state.hint}/>)  }
        });


        return (
            <Fragment>
                <div className="menu-grid">
                    <button className="return-home" onClick={this.returnHome}> Return to Menu</button>
                </div>
                <div id="game-container">
                    <div id="game-grid">
                        {gridCells}
                    </div>
                    <div id="game-buttons">
                        <button onClick={this.solve} >Solve</button>
                        <button onClick={this.toggleNotes}>{this.state.writeNotes ? "Enter numbers" : "Enter notes"}</button>
                        <button onClick={this.clear} >Clear</button>
                        <button onClick={this.toggleShowConflict} >Verify</button>
                        <button onClick={this.hint} >Hint</button>
                        <button onClick={this.handleSaveGame} >Save</button>
                    </div>
                    {/* <button onClick={ () => this.props.voiceInput(['hello','apple'])} >test voice passed down</button> */}

                </div>
            </Fragment>
        )
    }
}
