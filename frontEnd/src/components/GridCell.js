import React, { Component } from "react";
import "./GridCell.css";

export default class GridCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            notes: [],
            editable: true
        }
        this.editNotes = true;
        
        this.clickMakesNumberVanish = this.clickMakesNumberVanish.bind(this);
        this.setDisplay = this.setDisplay.bind(this);
        this.showNotes = this.showNotes.bind(this);
    }
    
    componentDidMount() {
        this.showNotes();
    }

    showNotes() {
        
        if (this.display.textContent === "0" || this.display.textContent === "") {
            for (let value of this.props.cell.notes) {
                document.querySelector("#notes_" + this.props.index + "_" + value).textContent = value;
            }
        } else {
            for (let i = 1; i < 10; i++) {
                document.querySelector("#notes_" + this.props.index + "_" + i).textContent = "";
            }
        }
    }

    getClassName() {
        let className = "grid-cell ";
        if (this.props.cell.editable) {
            className += "editable ";
        } else {
            className += "locked ";
        }
        if (this.props.index % 9 === 2 || this.props.index % 9 === 5) {
            className += "right ";
        }
        if (this.props.index % 9 === 3 || this.props.index % 9 === 6) {
            className += "left ";
        }
        if ((this.props.index >= 18 && this.props.index <= 26) || (this.props.index >= 45 && this.props.index <= 53)) {
            className += "bottom ";
        }
        if ((this.props.index >= 27 && this.props.index <= 35) || (this.props.index >= 54 && this.props.index <= 62)) {
            className += "top ";
        }
        return className;
    }

    clickMakesNumberVanish(event) {
        document.querySelectorAll(".display").forEach(el => el.style.backgroundColor = "");
        event.target.value = "";
        this.display.style.backgroundColor = "rgba(255, 255, 255, 0.3";
    }
    setDisplay(event) {
        
        let val = event.target.value;
        if (val.length > 1) {
            val = val.substr(1);
            event.target.value = val;
        }
        this.display.textContent = val;

        if (val === "") {
            val = "0";
        }
        let newCell = {
            value: val,
            editable: this.props.cell.editable,
            notes: this.props.cell.notes
        };
        this.props.onNumberInput(this.props.index, newCell, this.display);
        this.showNotes();
        // setTimeout((console.log()),200);

    }

    noScroll(event) {
        event.preventDefault();
    }

    render() {
        let className = this.getClassName();
        return (
            <div className={className}>
                <div ref={(div) => this.display = div} className="display">
                {this.props.cell.value.match(/[1-9]/) ? this.props.cell.value : null}
                </div>
                <input
                    min="1"
                    max="9"
                    className="cell-input"
                    type="number"
                    defaultValue={this.props.cell.value}
                    disabled={!this.props.cell.editable}
                    onClick={this.clickMakesNumberVanish}
                    onKeyUp={this.setDisplay}
                    onScroll={this.noScroll}
                />

                <div className="notes">
                    <div className="notes-cell" id={"notes_" + this.props.index + "_1"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_2"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_3"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_4"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_5"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_6"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_7"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_8"}></div>
                    <div className="notes-cell" id={"notes_" + this.props.index + "_9"}></div>
                </div>

            </div>
        )
    }
}
