import React, { Fragment } from 'react'
import ImageUpload from '../containers/ImageUpload'
import Difficulty from "./Difficulty"
import LoadGame from './LoadGame'
import CowTimer from '../helpers/CowTimer'

/* eslint-disable */

const moo = new CowTimer(15, 30, "moo")
moo.startTimer()

const MenuView = (props) => {

        function makeChoice(event) {
            moo.endTimer();
            props.chooseMenu(event.target.value)
        }
        
        switch (props.viewOption) {
            // case "mainMenu":
            default:
                return (

                    <Fragment>
                        <h1>Menu</h1>
                        <div className="menu-grid">
                            <button className="menu-button" onClick={makeChoice} value="DifficultyMenu" > PLAY </button>
                            <button className="menu-button" onClick={makeChoice} value="ImportImage" > Get PseudoCoo from Image </button>
                            <button className="menu-button" onClick={makeChoice} value="SavedGames" > Continue a Game </button>
                        </div>
                    </Fragment>
                )

            case "DifficultyMenu":
                return (

                    <Fragment>
                        <Difficulty chooseMenu={props.chooseMenu} createGameString={props.createGameString} returnHome={props.chooseMenu} />
                    </Fragment>
                )

            case "ImportImage":
                return (
                    <Fragment>
                        <ImageUpload createGameString={props.createGameString} returnHome={props.chooseMenu} />
                    </Fragment>
                )

            case "SavedGames":
                return (

                    <Fragment>
                        <LoadGame savedGames={props.savedGames} loadGame={props.loadGame} removeGame={props.removeGame} returnHome={props.chooseMenu} />
                    </Fragment>
                )
        }
}

export default MenuView;
