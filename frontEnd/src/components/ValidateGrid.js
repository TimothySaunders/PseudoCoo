import React from "react";

import "./ValidateGrid.css";

export default function ValidateGrid(props) {

    const cells = props.input.split("").map((char, i) => {
        return (
            <div key={i} index={i} className="validate-cell">
                <input
                    type="number"
                    min="1"
                    max="9"
                    defaultValue={char}
                />
            </div>
        )
    })

    return (
        <div id="validate-grid">
            {cells}
        </div>
    )
}