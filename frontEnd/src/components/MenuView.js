import { render } from '@testing-library/react'
import React, { Fragment } from 'react'

const MenuView = (props) => {
    render()

    function makeChoice(event){
        props.chooseMenu(event.target.value)
    }

    // const currentOption = props.viewOption;
    // return(
    // <div>fd  {currentOption}</div>
    // )
    

    if (props.viewOption === "mainMenu") {
    return (
        <Fragment>
            <p> I am menu view</p>
            <br />
            <button  onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
            <button  onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
            <button  onClick={makeChoice} value="SavedGames"> Continue a game   </button>
            
        </Fragment>
    )}

    
    if (props.viewOption === "DifficultyMenu") {
        return (
            <Fragment>
                <p> I am DifficultyMenu view</p>
                <br />
                <button  onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                <button  onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                <button  onClick={makeChoice} value="SavedGames"> Continue a game   </button>
                
            </Fragment>
        )
    }

    if (props.viewOption === "ImportImage") {
        return (
            <Fragment>
                <p> I am ImportImage view</p>
                <br />
                <button  onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                <button  onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                <button  onClick={makeChoice} value="SavedGames"> Continue a game   </button>
                
            </Fragment>
        )
    }

    if (props.viewOption === "SavedGames") {
        return (
            <Fragment>
                <p> I am SavedGames view</p>
                <br />
                <button  onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                <button  onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                <button  onClick={makeChoice} value="SavedGames"> Continue a game   </button>
                
            </Fragment>
        )
    }




}

export default MenuView;
