import React, { Component, Fragment, } from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";
import sudoku from '../helpers/sudoku';
import PsChecker from '../helpers/PsChecker';
import Parser from "../helpers/StringParser";
import confettiCannon from "../helpers/ConfettiCannon";
import voice from '../helpers/PseudoMoo'


const sp = new Parser();
const psc = new PsChecker();

export default class GameGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: [],
            writeNotes: false,
            showConflictToggle: false,
            grid: "",
            hint: null,
            currentOrder: "",
            preventDoubleExecution: 1
        }
        this.handleNumberInput = this.handleNumberInput.bind(this);
        this.toggleNotes = this.toggleNotes.bind(this);
        this.showConflict = this.showConflict.bind(this);
        this.hint = this.hint.bind(this);
        this.voiceConfigCommands = [
            { words: ["solve", "soul", "souls", "song"], function: this.solve, args: [] },
            { words: ["save", "shave", "slave"], function: this.handleSaveGame, args: [] },
            { words: ["notes", "goats", "nods"], function: this.toggleNotes, args: [] },
            { words: ["verify", "verified"], function: this.toggleShowConflict, args: [] },
            { words: ["hint", "hence", "mint", "paint", "hills"], function: this.hint, args: [] },
            { words: ["clear", "claire", "clare", "glare"], function: this.clear, args: [] },
        ];
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

        if (this.props.cowTimer) {
            this.props.cowTimer.clearAll()
            this.props.cowTimer.addImmediately(1, 1.5, "PSEUDOCOO!", "Oh, I love this game!!")
            this.props.cowTimer.addToQueue(20, 2, "Need a hint?", "Just ask!!", true, 20, 30, true)
        }

        voice.setConfigureCommands(this.voiceConfigCommands);
    }

    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }

    solve = () => {
        this.clear(); //! Needs to be run so that it eliminates any invalid entries, trying to solve 
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
            confettiCannon();
            this.props.cowTimer.clearAll()
            this.props.cowTimer.addImmediately(2, 1.5, "I think you'll find *I* solved it...", "That confetti is for me, not you!!")
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
        return !sp.getRawStringFromObjects(this.state.gameState).includes(".")
    }

    gridIsSolved = () => {
        const currentGameState = sp.getRawStringFromObjects(this.state.gameState);
        const solution = sudoku.sudoku.solve(currentGameState);
        if (currentGameState === solution) {
            return true;
        }
        return false;
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
            confettiCannon();
            this.props.cowTimer.startTimer(2, 18, 18, false, "Cow-gratulations!!")
                .then(() => this.props.cowTimer.endTimer())
        }
        display.textContent = ["0", "."].includes(cell.value) ? "" : cell.value;
        this.setState({ gameState: updated });
    }

    handleSaveGame = () => {
        const gridValues = sp.convertObjectsToSaveString(this.state.gameState);
        this.props.saveGame(gridValues);
        this.props.cowTimer.addImmediately(1, 1.5, "Saved!", "")
    }

    hint = () => {
        /// solve the sudoku
        let toConvert = sp.getRawStringFromObjects(this.state.gameState);
        if (toConvert.indexOf(".") !== -1) {
            toConvert.replace("0", ".");
            const solution = sudoku.sudoku.solve(toConvert);
            let hints = []
            if (solution) {
                let gridObjects = this.state.gameState
                for (let i = 0; i < gridObjects.length; i++) {                  //
                    if (gridObjects[i].editable) {                     //
                        hints.push([i, solution[i]])     // should create a list of the solutions (excluding uneditable cells) 
                    }
                }
            }
            if (hints.length > 0) {
                this.setState({ hint: hints[0] });
                let index = hints[0][0];
                let value = hints[0][1];
                let updated = this.state.gameState;
                let cell = updated[index];
                cell.editable = false;
                cell.value = value;
                updated[index] = cell;

                this.setState({ gameState: updated });
            }
        }
        if (this.gridIsSolved()) {
            confettiCannon();
        }
        
        this.props.cowTimer.addImmediately(1, 1.5, "Mooston, we have a problem...", "This should make it a bit easier!")
    }

    toggleShowConflict = () => {
        const button = document.getElementById("verify_button");
        if (!this.state.showConflictToggle) {
            button.textContent = "Hide verify";
        } else {
            button.textContent = "Verify";
        }
        this.setState({ showConflictToggle: !this.state.showConflictToggle })
    }

    showConflict(i, grid, cell) {
        if (this.toggleShowConflict) {
            return psc.validateEntry(i, grid, cell.value)
        }
    }

    grid = () => {
        return sp.getRawStringFromObjects(this.state.gameState);
    }

    returnHome = () => {
        this.props.returnHome("mainMenu");
    }

    render() {
        const gridCells = this.state.gameState.map((cell, i) => {
            if (!cell.editable) {
                return (
                    <GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} hint={this.state.hint} />
                )
            } else {
                return (
                    <GridCell
                        key={i}
                        index={i}
                        cell={cell}
                        onNumberInput={this.handleNumberInput}
                        listenForDigit={this.props.listenForDigit}
                        grid={this.state.grid}
                        showConflict={this.showConflict}
                        showConflictToggle={this.state.showConflictToggle}
                        hint={this.state.hint}
                    />
                )
            }
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
                        <button id="verify_button" onClick={this.toggleShowConflict} >Verify</button>
                        <button onClick={this.hint} >Hint</button>
                        <button onClick={this.handleSaveGame} >Save</button>
                    </div>
                </div>

            </Fragment>
        )
    }
}
