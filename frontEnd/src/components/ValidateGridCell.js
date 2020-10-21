import React from "react";

export default function ValidateGridCell(props) {

    const handleInput = (event) => {
        const index = event.target.id.split("-")[2];
        let value = event.target.value;
        if (value.length > 1) {
            value = value.slice(-1);
            event.target.value = value;
        }
        if (!value.match(/[1-9]/) || value === "") {
            value = ".";
            event.target.value = "";
        }
        props.onInput(index, value);

    }

    return (
        <div className="validate-cell">
            <input
                type="number"
                min="1"
                max="9"
                id={"validate-cell-" + props.index}
                defaultValue={props.char}
                onInput={handleInput}
            />
        </div>
    )
}