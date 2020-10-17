import React from "react";
import parser from "../helpers/StringParser";
import GridCell from "./GridCell";

import "./GameGrid.css";


const sp = new parser();


export default function GameGrid(props) {
    console.log(props.gameState);
    const cellObjects = sp.getObjects(props.gameState);
    console.log(cellObjects);
    const gridCells = cellObjects.map((cell, i) => {
        return (
            <GridCell key={i} cell={cell} />
        )
    });

    return (
        <div id="game-grid">
            {gridCells}
        </div>
    )
}