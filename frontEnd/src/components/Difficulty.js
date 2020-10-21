import React, { Fragment } from 'react'
import sudoku from '../helpers/sudoku'

import "./Difficulty.css";

const Difficulty = (props) => {

    if (props.cowTimer) {
        props.cowTimer.startTimer(18, 18, "Feelin' tough?")
        setTimeout(()=>{props.cowTimer.startTimer(15, 25, "MOOOOOOOOO")}, 15000)
    }

    function setDifficulty(event){
        const generatedString = sudoku.sudoku.generate(event.target.value, true);
        props.cowTimer.endTimer();
        props.createGameString(generatedString);
    }

    function makeChoice(event) {
        props.chooseMenu(event.target.value)
        props.cowTimer.endTimer();
    }

    return (
        <Fragment>
            <div className="menu-grid">
                <button className="return-home" onClick={makeChoice} value="mainMenu"> Return to Menu</button>
            </div>
            <h1>Choose Diffi-cow-lty</h1>
            <section id="buttons">
                <button onClick={setDifficulty} value="easy">Laughing Coooo</button>
                <button onClick={setDifficulty} value="medium">Skimmed Milk</button>
                <button onClick={setDifficulty} value="hard">Moooodium Rare</button>
                <button onClick={setDifficulty} value="very-hard">Udderly difficult</button>
                <button onClick={setDifficulty} value="insane">Mad Coo!!!</button>
                <button onClick={setDifficulty} value="inhuman">Holy Coo!!!!</button>
            </section>
        </Fragment>
    )

}

export default Difficulty;