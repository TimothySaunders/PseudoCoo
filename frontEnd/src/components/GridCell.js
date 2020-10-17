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



    render() {
        return (
            <div className={(this.props.cell.editable) ? "grid-cell editable" : "grid-cell locked"}>
                {(!this.props.cell.editable) ? this.props.cell.value : null}
            </div>
        )
    }
}
