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

    render() {
        let className = this.getClassName();
        return (
            <div className={className}>
                {(!this.props.cell.editable) ? this.props.cell.value : null}
                {/* {this.props.index} */}
            </div>
        )
    }
}
