import React, { Component, Fragment } from 'react';
import './ImageUpload.css';
import sudoku from '../helpers/sudoku';
import { uploadImage } from "../helpers/requests.js";
import ImageParser from '../helpers/ImageParser'
import ValidateGrid from "../components/ValidateGrid";

export default class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageFile: null,
            parsedOutput: "",
        }
    }

    componentDidMount() {
        if (this.props.cowTimer) {
            this.props.cowTimer.clearAll()
            this.props.cowTimer.addImmediately(1.5, 2, "This is where you can upload an image", "None of that pen and paper nonsense!");
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
        this.props.cowTimer.clearAll()
        this.props.cowTimer.addImmediately(2, 3, "", "", true, 12, 12);

        const container = document.getElementById("processed_container");
        const uploadingPic = document.getElementById("uploading-gif");
        const previewPic = document.getElementById("preview-pic");
        const processingPic = document.getElementById("processing-gif");
        previewPic.style.display = "none";
        container.style.display = "none";
        uploadingPic.style.display = "initial";

        const cleanImage = await uploadImage(this.state.imageFile);
        let fileReader = new FileReader();
        let output = "";
        fileReader.onload = async () => {
            container.style.display = "flex";
            uploadingPic.style.display = "none";
            previewPic.src = fileReader.result;
            previewPic.style.display = "initial";
            processingPic.style.display = "initial";

            output = await ImageParser(fileReader.result, false, false);
            output = this.handleOutputNot81Chars(output);
            this.setState({ parsedOutput: output });
            processingPic.style.display = "none";
        }

        fileReader.readAsDataURL(cleanImage);
    }

    handleOutputNot81Chars = (output) => {
        const len = output.length;
        if (len < 81) {
            output += ".".repeat(81 - len);
        } else if (len > 81) {
            output = output.substr(0, 81);
        }
        return output;
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
        this.setState({ parsedOutput: "" });
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
        try {
            if (this.state.parsedOutput.length > 0) {
                const solution = sudoku.sudoku.solve(this.state.parsedOutput);
                return solution ? true : false;
            }
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    renderValidateGrid() {
        const blankGrid = ".................................................................................";
        const solvable = this.gameIsSolvable();
        this.props.cowTimer.clearAll()
        if (this.state.parsedOutput.length === 81) {
            if (this.state.parsedOutput === blankGrid) {
                this.props.cowTimer.addImmediately(0.5, 1.5, "Uh-oh, that doesn't look right...", "Try using a better picture");
                return (
                    <p>Could not find a sudoku grid, try taking a better picture</p>
                );
            } else {
                solvable ? this.props.cowTimer.addImmediately(0.5, 1.5, "Hurray, that was magic, huh?", "Let's go!") : this.props.cowTimer.addImmediately(0.5, 1.5, "Hmmm, it's not perfect...", "Can you spot and fix the mistakes for me?");
                return (
                    <Fragment>
                        <ValidateGrid input={this.state.parsedOutput} onInput={this.editParsedOutput} />
                        <button id="validate-upload" disabled={!solvable} onClick={this.handleValidate}>{solvable ? "Play the game" : "This grid is unsolvable!"}</button>
                    </Fragment>
                );
            }
        } else if (this.state.parsedOutput.length > 0) {
            this.props.cowTimer.addImmediately(1, 1.5, "Uh-oh, that doesn't look right...", "Try uploading the image again");
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
                            id="uploading-gif"
                            className="image hidden-pic fill-div"
                            src="uploading.gif"
                            alt="uploadImage"
                            draggable="false"
                        />
                        <div id="processed_container">
                            <img
                                id="preview-pic"
                                className="image hidden-pic fill-div"
                                alt="uploadImage"
                                draggable="false"
                            />
                            <img
                                id="processing-gif"
                                className="image hidden-pic fill-div"
                                src="processing.gif"
                                alt="uploadImage"
                                draggable="false"
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}