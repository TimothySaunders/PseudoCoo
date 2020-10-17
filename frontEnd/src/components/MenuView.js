import { render } from '@testing-library/react'
import React, { Fragment } from 'react'
import Difficulty from "./Difficulty"

const MenuView = (props) => {

        function makeChoice(event) {
            props.chooseMenu(event.target.value)
        }

        switch (props.viewOption) {
            case "mainMenu":
                return (

                    <Fragment>
                        <p> I am menu view (case)</p>
                        <br />
                        <button onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                        <button onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                        <button onClick={makeChoice} value="SavedGames"> Continue a game   </button>

                    </Fragment>
                )
                break

            case "DifficultyMenu":
                return (

                    <Fragment>
                        <p> I am Difficulty Menu view -- case</p>
                        <Difficulty chooseMenu={props.chooseMenu} />
                        <br />


                    </Fragment>
                )
                break

            case "ImportImage":
                return (

                    <Fragment>
                        <p> I am ImportImage view (case)</p>
                        <br />
                        <button onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                        <button onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                        <button onClick={makeChoice} value="SavedGames"> Continue a game   </button>

                    </Fragment>
                )
                break

            case "SavedGames":
                return (

                    <Fragment>
                        <p> I am SavedGames view (case)</p>
                        <br />
                        <button onClick={makeChoice} value="DifficultyMenu"> PLAY   </button><br />
                        <button onClick={makeChoice} value="ImportImage"> get PseudoCoo from Image   </button><br />
                        <button onClick={makeChoice} value="SavedGames"> Continue a game   </button>

                    </Fragment>
                )
                break



        }

}

export default MenuView;
