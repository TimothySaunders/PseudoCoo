import React, { Component, } from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";
import sudoku from '../helpers/sudoku';
import PsChecker from '../helpers/PsChecker';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition' //! 
import CowTimer from '../helpers/CowTimer'
import Parser from "../helpers/StringParser";

const hint = new CowTimer(20, 20, "hint")
hint.startTimer()

const sp = new Parser();
const psc = new PsChecker();
// SpeechRecognition.SpeechRecognition();  //! 

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
        this.props.resizeGrid();
        let gameState;
        if (this.props.game.gridValues.length === 81) {
            gameState = sp.getObjects(this.props.game.gridValues);
        } else {
            gameState = sp.getObjectsFromSavedString(this.props.game.gridValues);
        }
        this.setState({ gameState: gameState });
    }


    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }
    solve = () => {
        let toConvert = sp.getRawStringFromObjects(this.state.gameState);
        const solution = sudoku.sudoku.solve(toConvert);
        if (solution) {
            let prevState = this.state.gameState;
            let gameState = sp.getObjects(solution);
            prevState = prevState.map((cell, index) => {
                cell.value = gameState[index].value;
                return cell;
            });
            this.setState({ gameState: prevState });
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
        display.textContent = ["0", "."].includes(cell.value) ? "" : cell.value;
        this.setState({ gameState: updated });
    }

    handleSaveGame = () => {
        const gridValues = sp.convertObjectsToSaveString(this.state.gameState);
        this.props.saveGame(gridValues);
    }

    render() {

        const gridCells = this.state.gameState.map((cell, i) => {
            return (
                <GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} />
            )
        });
        return (
            <div id="game-container">
                <div id="game-grid">
                    {gridCells}
                </div>
                <div id="game-buttons">
                    <button onClick={this.solve} > Solve</button>
                    <button onClick={this.toggleNotes}>{this.state.writeNotes ? "Enter numbers" : "Enter notes"}</button>
                    <button onClick={this.clear} >Clear</button>
                    <button onClick={this.handleSaveGame} >Save</button>
                </div>
                {/* <button onClick={ () => this.props.voiceInput(['hello','apple'])} >test voice passed down</button> */}



            </div>
        )
    }
}
