import React, { Fragment } from 'react'
import sudoku from '../helpers/sudoku'

import "./Difficulty.css";

import voice from '../helpers/PseudoMoo'

let timeout;

const Difficulty = (props) => {

    if (props.cowTimer) {
        props.cowTimer.startTimer(18, 18, "Feelin' tough?")
        timeout = window.setTimeout(()=>{props.cowTimer.startTimer(15, 25, "MOOOOOOOOO")}, 15000)
    }

    const setDifficulty = (event) => {
        const generatedString = sudoku.sudoku.generate(event.target.value, true);
        window.clearTimeout(timeout);
        props.cowTimer.endTimer();
        props.createGameString(generatedString);
    }

    function makeChoice(event) {
        window.clearTimeout(timeout);
        props.cowTimer.endTimer();
        props.chooseMenu(event.target.value)
    }

    const difficultyVoiceCommands = [
        { words: ['laughing', 'coo', 'cow'], function: setDifficulty, args: [{ target: { value: "easy" } }] },
        { words: ['skimmed', 'milk'], function: setDifficulty, args: [{ target: { value: "medium" } }] },
        { words: ['rare', 'medium'], function: setDifficulty, args: [{ target: { value: "hard" } }] },
        { words: ['difficult', 'utterly', 'udder', 'elderly'], function: setDifficulty, args: [{ target: { value: "very-hard" } }] },
        { words: ['mad', 'madcow'], function: setDifficulty, args: [{ target: { value: "insane" } }] },
        { words: ['holy'], function: setDifficulty, args: [{ target: { value: "inhuman" } }] },
    ];

    voice.setConfigureCommands(difficultyVoiceCommands);
    
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