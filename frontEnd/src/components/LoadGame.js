import React from 'react';
import CowTimer from '../helpers/CowTimer';

export default function LoadGame(props){

    const moo = new CowTimer(10, 15, "moo")
    moo.startTimer();

    const getIdFromEvent = (event) => {
        const stringIndexofID = event.target.id.indexOf("-")+1;
        const targetId = event.target.id.slice(stringIndexofID);
        return targetId;
    }

    const handleLoadGame = (event) => {
        const gameId = getIdFromEvent(event)
        moo.endTimer();
        props.loadGame(gameId);
    }

    const handleDeleteGame = (event) => {
        const gameId = getIdFromEvent(event)
        props.removeGame(gameId);
    }

    const saveNodes = props.savedGames.map((game, index) => {
        return (
            <div key={index}>
                <button id={"save-"+game.id} onClick={handleLoadGame}>{game.timeStamp}</button>
                <button id={"del-"+game.id} onClick={handleDeleteGame}>Delete</button>
                <br/>
            </div>
                
        )
    })

    return(
        <div>
            {saveNodes}
        </div>
    )

}