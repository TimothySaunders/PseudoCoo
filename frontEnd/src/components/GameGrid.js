import React from "react";
import "../helpers/StringParser";

import { GridCell } from "./GridCell";

export default function GameGrid(props) {

    const cellObjects = getObjectsFromSavedString(props.gameState);
    const gridCells = cellObjects.map((cell, i) => {
        return (
            <GridCell key={i} cell={cell} />
        )
    })
}