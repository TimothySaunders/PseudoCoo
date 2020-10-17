import React, {Component} from "react";
import Parser from "../helpers/StringParser";
import GridCell from "./GridCell";

import "./GameGrid.css";


const sp = new Parser();


export default class GameGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: ""
        }
    }


    componentDidMount() {
        if (this.props.gameString.length === 81) {
            const gameState = sp.getObjects(this.props.gameString);
            this.setState({ gameState: gameState });
        } else {
            this.setState({ gameState: this.props.gameString });
        }
    }

    render() {
        const gridCells = this.state.gameState.map((cell, i) => {
            return (
                <GridCell key={i} index={i} cell={cell} />
            )
        });
        return (
            <div id="game-grid">
                {gridCells}
            </div>
        )
    }
}