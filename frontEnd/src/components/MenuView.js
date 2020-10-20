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
                        <p> I am menu view (case)</p>
                        <br />
                        <button onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                        <button onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                        <button onClick={makeChoice} value="SavedGames"> Continue a game   </button>
                    </Fragment>
                )

            case "DifficultyMenu":
                return (

                    <Fragment>
                        <p> I am Difficulty Menu view -- case</p>
                        <Difficulty chooseMenu={props.chooseMenu} createGameString={props.createGameString} />
                    </Fragment>
                )

            case "ImportImage":
                return (
                    <Fragment>
                        <ImageUpload createGameString={props.createGameString} />
                        <br />
                        <button onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                        <button onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                        <button onClick={makeChoice} value="SavedGames"> Continue a game   </button>
                    </Fragment>
                )

            case "SavedGames":
                return (

                    <Fragment>
                        <LoadGame savedGames={props.savedGames} loadGame={props.loadGame} removeGame={props.removeGame} />
                        <br />
                        <button onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                        <button onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                        <button onClick={makeChoice} value="SavedGames"> Continue a game   </button>
                    </Fragment>
                )
        }
}

export default MenuView;
