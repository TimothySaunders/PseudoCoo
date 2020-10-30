import React, { Component, Fragment } from 'react';
import './ImageUpload.css';
import sudoku from '../helpers/sudoku';
import { uploadImage } from "../helpers/requests.js";
import ImageParser from '../helpers/ImageParser'
import ValidateGrid from "../components/ValidateGrid";

let timeout;

export default class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageFile: null,
            parsedOutput: "",
        }
    }

    componentDidMount(){
        if (this.props.cowTimer) {
            this.props.cowTimer.startTimer(2, 18, 18, false, "This is where you can upload an image", "I dislike pen and paper sometimes too")
            .then(() => this.props.cowTimer.endTimer())
        }
    }

    handleImageClick = () => {
        const virtualInput = this.createUpload();
        virtualInput.click();
    }

    createUpload = () => {
        const virtualInput = document.createElement("input");
        virtualInput.type = "file";
        virtualInput.accept = "image/*";
        virtualInput.addEventListener('change', this.handleUpload);
        return virtualInput;
    }

    handleUpload = async (event) => {
        this.handleClear();
        await this.setState({ imageFile: event.target.files[0] });
        this.createPreview();
        this.analyseImage();
    }

    createPreview = async () => {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            document.getElementById("preview").src = fileReader.result;
        }
        fileReader.readAsDataURL(this.state.imageFile);
    }

    analyseImage = async () => {
        this.props.cowTimer.startTimer(2, 12, 12, false);
        const secondImageBox = document.getElementById("processed-preview");
        secondImageBox.style.display = "initial";
        secondImageBox.src = "uploading.gif";
        const cleanImage = await uploadImage(this.state.imageFile);
        let output = "";

        let fileReader2 = new FileReader();
        fileReader2.onload = async () => {
            secondImageBox.src = "processing.gif";
            output = await ImageParser(fileReader2.result, false, false)
            secondImageBox.src = fileReader2.result;
            this.setState ({ parsedOutput: output })
            this.props.cowTimer.endTimer();
        }
        fileReader2.readAsDataURL(cleanImage)
    }

    handleValidate = () => {
        if (this.state.parsedOutput !== "") {
            // check if solvable // still to be written
            this.props.createGameString(this.state.parsedOutput);
        }
    }

    // drag and drop methods
    handleClear = () => {
        this.setState({ imageFile: null });
        document.getElementById("preview").src = "uploadDefault.png";
    }

    handleDragEnter = (event) => {
        event.preventDefault();
        document.getElementById("preview").classList.add("on-droppable");
    }

    handleDragLeave = (event) => {
        event.preventDefault();
        document.getElementById("preview").classList.remove("on-droppable");
    }

    handleDragOver = (event) => {
        event.preventDefault();
    }

    handleOnDrop = async (event) => {
        event.preventDefault();
        if (event.dataTransfer.files[0].type.includes("image")) {
            await this.setState({ imageFile: event.dataTransfer.files[0] });
            this.createPreview();
            this.analyseImage();
        } else {
            this.handleClear();
        }
    }

    returnHome = () => {
        this.props.returnHome("mainMenu");
    }

    editParsedOutput = (index, value) => {
        const parsedGrid = this.state.parsedOutput.split("");
        parsedGrid[index] = value;
        this.setState({ parsedOutput: parsedGrid.join("") });
    }
    gameIsSolvable = () => {
        if (this.state.parsedOutput.length > 0) {
            const solution = sudoku.sudoku.solve(this.state.parsedOutput);
            return solution ? true : false;
        }
        return false;
    }

    renderValidateGrid() {
        const blankGrid = ".................................................................................";
        const solvable = this.gameIsSolvable();
        if (this.state.parsedOutput.length === 81) {
            if (this.state.parsedOutput === blankGrid) {
                return (
                    <p>Could not find a sudoku grid, try taking a better picture</p>
                );
            } else {
                return (
                    <Fragment>
                        <ValidateGrid input={this.state.parsedOutput} onInput={this.editParsedOutput} />
                        <button id="validate-upload" disabled={!solvable} onClick={this.handleValidate}>{solvable ? "Play the game" : "This grid is unsolvable!"}</button>
                    </Fragment>
                );
            }
        } else if (this.state.parsedOutput.length > 0) {
            return (
                <p>Something went wrong! Try uploading your image again.</p>
            );
        }
    }

    render() {

        return (
            <Fragment>
                <div className="menu-grid">
                    <button className="return-home" onClick={this.returnHome}> Return to Menu</button>
                </div>
                <div>
                    <h1>Upload a Puzzle</h1>
                    <article id="upload-grid-container">
                        {this.renderValidateGrid()}
                    </article>
                    <div id="upload-images-container">
                        <img
                            id="preview"
                            className="image uploader"
                            src="uploadDefault.png"
                            alt="uploadImage"
                            draggable="false"
                            onClick={this.handleImageClick}
                            onDragEnter={this.handleDragEnter}
                            onDragLeave={this.handleDragLeave}
                            onDragOver={this.handleDragOver}
                            onDrop={this.handleOnDrop}
                        />
                        <img
                            id="processed-preview"
                            className="image"
                            src="uploading.gif"
                            alt="uploadImage"
                            draggable="false"
                        />
                    </div>
                </div>
            </Fragment>
        )
    }


}
