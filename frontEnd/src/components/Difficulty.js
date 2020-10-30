import React, { Fragment } from 'react'
import sudoku from '../helpers/sudoku'

import "./Difficulty.css";

const Difficulty = (props) => {

    if (props.cowTimer) {
        props.cowTimer.startTimer(2, 18, 18, false, "How brave you feelin'?", "You don't look so tough to me!")
        .then(() => {if (props.viewOption==="DifficultyMenu") {props.cowTimer.startTimer(2, 18, 18, false, "May I suggest 'Mooooodium Rare'?", "You look like you love a challenge...")}})
        .then(() => {if (props.viewOption==="DifficultyMenu") {props.cowTimer.startTimer(12, 18, 18, false, "Oh, hurry up and choose!", "...or maybe I'll just choose for you...")}})
        .then(() => {if (props.viewOption==="DifficultyMenu") {props.cowTimer.startTimer(12, 18, 18, false, "MOOOOOOOO", "BAAAAAA")}})
        .then(() => {if (props.viewOption==="DifficultyMenu") {props.cowTimer.startTimer(2, 15, 25, false, "", "")}})
    }

    function setDifficulty(event){
        const generatedString = sudoku.sudoku.generate(event.target.value, true);
        props.chooseMenu("inGame")
        props.createGameString(generatedString);
    }

    function makeChoice(event) {
        props.chooseMenu(event.target.value)
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