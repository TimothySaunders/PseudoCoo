import React, {Component, Fragment} from 'react';
import './ImageUpload.css';
import {uploadImage} from "../helpers/requests.js";
import ImageParser from '../helpers/ImageParser'
import CowTimer from '../helpers/CowTimer'
import ValidateGrid from "../components/ValidateGrid";

export default class ImageUpload extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageFile: null,
            parsedOutput: "",
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
        await this.setState({imageFile : event.target.files[0]});
        this.createPreview();
        this.analyseImage();
    }

    createPreview = async () => {
        let fileReader = new FileReader();
        fileReader.onload = function (){
            document.getElementById("preview").src = fileReader.result;
        }
        fileReader.readAsDataURL(this.state.imageFile);
    }

    analyseImage = async () => {
        const joke = new CowTimer(12, 12, "joke")
        joke.startTimer()
        const secondImageBox = document.getElementById("processed-preview");
        secondImageBox.style.display = "initial";
        const cleanImage = await uploadImage(this.state.imageFile);
        let output = "";

        let fileReader2 = new FileReader();
        fileReader2.onload = async () => {
            secondImageBox.src = "processing.gif";
            output = await ImageParser(fileReader2.result, false, false)
            secondImageBox.src = fileReader2.result;
            this.setState ({parsedOutput: output})
            joke.endTimer();
        }
        fileReader2.readAsDataURL(cleanImage)
    }

    handleValidate = () => {
        if (this.state.parsedOutput !== ""){
            // check if solvable // still to be written
            this.props.createGameString(this.state.parsedOutput);
        }
        
    }

    // drag and drop methods
    handleClear = () => {
        this.setState({imageFile : null});
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
            await this.setState({imageFile : event.dataTransfer.files[0]});
            this.createPreview();
            this.analyseImage();
        } else {
            this.handleClear();
        }
    }

    returnHome = () => {
        clearTimeout("joke")
        this.props.returnHome();
    }

    renderValidateGrid() {
        if (this.state.parsedOutput.length === 81) {
            return (
                <Fragment>
                    <ValidateGrid input={this.state.parsedOutput} />
                    <button id="validate-upload" onClick={this.handleValidate}>Play the game</button>
                </Fragment>
            )
        } else if (this.state.parsedOutput.length > 0) {
            return (
                <p>Couldn't find a sudoku grid! Try taking a better picture!</p>
            )
        }
    }

    render(){

        return(
            <Fragment>
                <button className="return-home" onClick={this.returnHome}> Return to Menu</button>
                <div>
                    <h1>Upload a Puzzle</h1>
                    {this.renderValidateGrid()}
                    
                    <img id="preview" className="image" src="uploadDefault.png" alt="uploadImage" draggable="false"
                    onClick={this.handleImageClick} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleOnDrop}/>
                    <img id="processed-preview" className="image" src="uploading.gif" alt="uploadImage" draggable="false" />
                </div>
            </Fragment>
        )
    }


}
