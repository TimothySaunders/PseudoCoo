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
        if (this.state.editable) {
            return (
                <div class="grid-cell">

                </div>
            )

        } else {
            return (
                <div class="grid-cell">

                </div>
            )

        }
    }
}