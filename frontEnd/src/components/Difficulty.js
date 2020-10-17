import React, {Fragment} from 'react'

const Difficulty = (props) => {

    const difficultyLevel = 0; 

    function setDifficulty(event){
        difficultyLevel = event.target.value;
    }

    return (
        <Fragment>
        <div> difficulty selections </div>
        <br/>
        <button> Skimmed Milk </button>
        <button> Moooodium Rare</button>
        <button> Udderly difficult </button>
        <button> Mad Coo!</button>
        </Fragment>
    )

}

export default Difficulty;