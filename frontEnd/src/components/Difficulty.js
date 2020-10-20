import React, { Fragment } from 'react'
import sudoku from '../helpers/sudoku'

import "./Difficulty.css";

const Difficulty = (props) => {

    function setDifficulty(event) {
        const generatedString = sudoku.sudoku.generate(event.target.value, true);
        props.createGameString(generatedString);

    }

    function makeChoice(event) {
        props.chooseMenu(event.target.value)
    }


    return (
        <Fragment>
            <h1>Diffi-cow-lty selection</h1>
            <section id="buttons">
                <button onClick={setDifficulty} value="easy">Laughing Coooo</button>
                <button onClick={setDifficulty} value="medium">Skimmed Milk</button>
                <button onClick={setDifficulty} value="hard">Moooodium Rare</button>
                <button onClick={setDifficulty} value="very-hard">Udderly difficult</button>
                <button onClick={setDifficulty} value="insane">Mad Cooo!!!</button>
                <button onClick={setDifficulty} value="inhuman">Holy Coo!!</button>
            </section>
            <button onClick={makeChoice} value="mainMenu"> Back to menu</button>

        </Fragment>
    )

}

export default Difficulty;