import React, { Component } from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";
import sudoku from '../helpers/sudoku'


import Parser from "../helpers/StringParser";
const sp = new Parser();


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
        if (this.props.gameString.length === 81) {
            gameState = sp.getObjects(this.props.gameString);
        } else {
            gameState = sp.getObjectsFromSavedString(this.props.gameString);
        }
        this.setState({ gameState: gameState });
    }

    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }
    solve = () => {
        const solution = sudoku.sudoku.solve(this.props.gameString);
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

    handleNumberInput(index, newCell) {
        let updated = this.state.gameState;
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
