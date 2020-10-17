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
        this.clickMakesNumberVanish = this.clickMakesNumberVanish.bind(this);
        this.setDisplay = this.setDisplay.bind(this);
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
        this.display.textContent = event.target.value;
    }

    noScroll(event) {
        event.preventDefault();
    }

    render() {
        let className = this.getClassName();
        if (this.props.showNotes = true) {

        }
        return (
            <div className={className}>
                <div ref={(div) => this.display = div} className="display">
                    {this.props.cell.editable ? null : this.props.cell.value}
                </div>
                <input
                    min="1"
                    max="9"
                    class="cell-input"
                    type="number"
                    defaultValue={this.props.cell.value}
                    disabled={!this.props.cell.editable}
                    onClick={this.clickMakesNumberVanish}
                    onInput={this.setDisplay}
                    onScroll={this.noScroll}
                />
                
                <div class="notes">
                    <div className="notes-cell" id="notes1"></div>
                    <div className="notes-cell" id="notes2"></div>
                    <div className="notes-cell" id="notes3"></div>
                    <div className="notes-cell" id="notes4"></div>
                    <div className="notes-cell" id="notes5"></div>
                    <div className="notes-cell" id="notes6"></div>
                    <div className="notes-cell" id="notes7"></div>
                    <div className="notes-cell" id="notes8"></div>
                    <div className="notes-cell" id="notes9"></div>
                </div>
                
            </div>
        )
    }
}
