import React, {Component} from 'react';
import './ImageUpload.css';
import {uploadImage} from "../helpers/requests.js";

export default class ImageUpload extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageFile: null,
        }
    }

    handleImageClick = () => {
        const virtualInput = this.createUpload();
        virtualInput.click();
    }
    

    handleUpload = async (event) => {
        this.handleClear();
        await this.setState({imageFile : event.target.files[0]});
        this.createPreview();
    }

    createPreview = () => {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            document.getElementById("preview").src = fileReader.result;
        }
        // fileReader.readAsDataURL(this.state.imageFile);
        // console.log(this.state.imageFile);
        uploadImage(this.state.imageFile).then(data => fileReader.readAsDataURL(data));
    }

    createUpload = () => {
        const virtualInput = document.createElement("input");
        virtualInput.type = "file";
        virtualInput.accept = "image/*";
        virtualInput.addEventListener('change', this.handleUpload);
        return virtualInput;
    }

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
        } else {
            this.handleClear();
        }
    }

    render(){

        return(
            <div>
                <p>//grid component will go here</p>
                <p>//validate button will appear here once upload complete and image parsed</p>
                <img id="preview" className="image" src="uploadDefault.png" alt="uploadImage" draggable="false"
                onClick={this.handleImageClick} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleOnDrop}/>
            </div>
            
        )
    }


}
