import React, { useEffect } from "react";
import "./GridCell.css";

export default function GridCell(props) {
    let display, notes;

    useEffect( () => {
        showNotes();
    });

    const showNotes = function() {
        // if (["0", ".", ""].includes(display.textContent)) {
            const sorted = props.cell.notes.sort();

            notes.textContent = sorted.toString().split(",").join(" ");
        // } else {
            // notes.textContent = "";
        // }
    }
    const getClassName = function() {
        let className = "grid-cell ";
        if (props.cell.editable) {
            className += "editable ";
        } else {
            className += "locked ";
        }
        if (props.index % 9 === 2 || props.index % 9 === 5) {
            className += "right ";
        }
        if (props.index % 9 === 3 || props.index % 9 === 6) {
            className += "left ";
        }
        if ((props.index >= 18 && props.index <= 26) || (props.index >= 45 && props.index <= 53)) {
            className += "bottom ";
        }
        if ((props.index >= 27 && props.index <= 35) || (props.index >= 54 && props.index <= 62)) {
            className += "top ";
        }
        return className;
    }

    const clickMakesNumberVanish = function(event) {
      
        document.querySelectorAll(".display").forEach(el => el.style.backgroundColor = "");
        event.target.value = "";
        display.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        props.listenForDigit(giveNumToDisplay);
    }

    const giveNumToDisplay = (num) => {
        if (num === undefined || num === "...") {
            num = "0";
        }
        if (num.length > 1) {
            num = num.slice(-1);
        }
        
        props.onNumberInput(props.index, props.cell, display, num);
    }

    const setDisplay = (event) => {
        let num = event.target.value;
        if (num.length > 1) {
            num = num.slice(-1);
            event.target.value = num;
        }
        giveNumToDisplay(num);
    }

    return(
        <div className={getClassName()}>
            <div ref={(div) => display = div} className="display">
                {props.cell.value.match(/[1-9]/) ? props.cell.value : null}
            </div>
            <input 
                min="1"
                max='9'
                className="cell-input"
                type="number"
                defaultValue={props.cell.value}
                disabled={!props.cell.editable}
                onClick={clickMakesNumberVanish}
                onKeyUp={setDisplay}
            />
            <div className="notes-cell" ref={(div) => notes = div}></div>
        </div>
    )

}
