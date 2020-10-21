import React from "react";
import ValidateGridCell from "./ValidateGridCell";

import "./ValidateGrid.css";

export default function ValidateGrid(props) {

   

    const cells = props.input.split("").map((char, i) => {
        return (
            <ValidateGridCell key={i} index={i} char={char} onInput={props.onInput} />
        )
    });

    return (
        <div id="validate-grid">
            {cells}
        </div>
    )
}