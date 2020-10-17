import React, { Component } from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";


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
    handleNumberInput(index, newCell) {
        let updated = this.state.gameState;
        updated[index] = newCell;
        this.setState({ gameState: updated });
    }

    render() {
        const gridCells = this.state.gameState.map((cell, i) => {
            return (
                <GridCell key={i} index={i} cell={cell} onNumberImput={this.handleNumberInput} />
            )
        });
        return (
            <div id="game-container">
                <div id="game-grid">
                    {gridCells}
                </div>
                <button onClick={this.toggleNotes}>{this.state.writeNotes ? "Enter numbers" : "Enter notes"}</button>
            </div>
        )
    }
}
