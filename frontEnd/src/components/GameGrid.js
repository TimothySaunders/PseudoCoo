import React, { Component } from "react";
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

    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }
    solve = () => {
        const solution = sudoku.sudoku.solve(this.props.game.gridValues);
        let prevState = this.state.gameState;
        let gameState = sp.getObjects(solution);
        prevState = prevState.map((cell, index) => {
            cell.value = gameState[index].value;
            return cell;
        });
        this.setState({ gameState: prevState });
    }
    clear = () => {
        let cells = this.state.gameState;
        cells = cells.map(cell => {
            if (cell.editable) {
                cell.value = "0";
            }
            return cell;
        });
        this.setState({ gameState: cells });
    }

    handleNumberInput(index, newCell, display) {
        let updated = this.state.gameState;

        //! prevent invalid input being entered into cell // rephrase to validae all inputs
        // if(!psc.validateEntry(index,this.state.gameState,newCell.value)) {
        //     newCell.value =".";
        //      display.textContent ="";
        // }

        updated[index] = newCell;
        this.setState({ gameState: updated });

       
    }

    render() {
        const gridCells = this.state.gameState.map((cell, i) => {
            return (
                <GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} />
            )
        });
        return (
            <div id="game-container">
                <div id="game-grid">
                    {gridCells}
                </div>
                <button onClick={this.solve} > Solve</button>
                <button onClick={this.toggleNotes}>{this.state.writeNotes ? "Enter numbers" : "Enter notes"}</button>
                <button onClick={this.clear} >Clear</button>
            </div>
        )
    }
}
