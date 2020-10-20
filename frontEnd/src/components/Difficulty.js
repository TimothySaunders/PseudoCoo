import React, {Fragment} from 'react'
import sudoku from '../helpers/sudoku'
import CowTimer from '../helpers/CowTimer'

const Difficulty = (props) => {  

    const moo = new CowTimer(10, 15, "moo")
    moo.startTimer();

    function setDifficulty(event){
        const generatedString = sudoku.sudoku.generate(event.target.value, true);
        props.createGameString(generatedString);
        moo.endTimer();
    }

    function makeChoice(event) {
        props.chooseMenu(event.target.value)
        moo.endTimer();
    }


    return (
        <Fragment>
        <div> difficulty selections </div>
        <br/>
        <button onClick={setDifficulty} value="easy"> Laughing Coooo </button><br/>
        <button onClick={setDifficulty} value="medium"> Skimmed Milk</button><br/>
        <button onClick={setDifficulty} value="hard"> Moooodium Rare</button><br/>
        <button onClick={setDifficulty} value="very-hard"> Udderly difficult</button><br/>
        <button onClick={setDifficulty} value="insane"> Mad Cooo!!! </button><br/>
        <button onClick={setDifficulty} value="inhuman"> Holy Coo!!</button><br/>

        <button onClick={makeChoice} value="mainMenu"> Back to menu</button>

        </Fragment>
    )

}

export default Difficulty;