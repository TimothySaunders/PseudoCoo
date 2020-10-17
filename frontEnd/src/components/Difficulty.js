import React, {Fragment} from 'react'

const Difficulty = (props) => {

    const difficultyLevel = ""; 

    function setDifficulty(event){
        difficultyLevel = event.target.value;
        if (difficultyLevel !=""){
            // this will need to send the difficulty to the game 
            // props.chooseMenu();
        }
    }

    function makeChoice(event) {
        props.chooseMenu(event.target.value)
    }


    return (
        <Fragment>
        <div> difficulty selections </div>
        <br/>
        <button onClick={setDifficulty} value="1"> Skimmed Milk </button><br/>
        <button onClick={setDifficulty} value="2"> Moooodium Rare</button><br/>
        <button onClick={setDifficulty} value="3"> Udderly difficult </button><br/>
        <button onClick={setDifficulty} value="4"> Mad Coo!</button><br/>

        <button onClick={makeChoice} value="mainMenu"> Back to menu</button>

        </Fragment>
    )

}

export default Difficulty;