import React, {Component} from 'react';

export default class ImageUpload extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageFile: null,
        }
    }

    handleImageClick = () => {
        const virtualInput = this.createUpload()
        virtualInput.click()
    }
    

    handleUpload = async (event) => {
        this.handleClear()
        await this.setState({imageFile : event.target.files[0]});
        this.createPreview();
    }

    createPreview = () => {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            document.getElementById("preview").src = fileReader.result;
        }
        fileReader.readAsDataURL(this.state.imageFile);
    }

    createUpload = () => {
        const virtualInput = document.createElement("input");
        virtualInput.type = "file";
        virtualInput.accept = "image/*";
        virtualInput.addEventListener('change', this.handleUpload)
        return virtualInput
    }

    handleClear = () => {
        this.setState({imageFile : null});
        document.getElementById("preview").src = "uploadDefault.png";
    }


    render(){
        return(
            <div>
                <img id="preview" src="uploadDefault.png" alt="uploadImage" width="200" height="200" onClick={this.handleImageClick}/>
            </div>
            
        )
    }


}
