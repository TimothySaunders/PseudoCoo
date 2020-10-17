import React from "react";
import getObjectsFromSavedString from "../helpers/StringParser";

import GridCell from "./GridCell";

export default function GameGrid(props) {
    console.log(props.gameState);
    const cellObjects = getObjectsFromSavedString(props.gameState);
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