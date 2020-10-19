import React from 'react';

export default function LoadGame(props){

    const getIdFromEvent = (event) => {
        const stringIndexofID = event.target.id.indexOf("-")+1;
        const targetId = event.target.id.slice(stringIndexofID);
        return targetId;
    }

    const handleLoadGame = (event) => {
        const gameIndex = getIdFromEvent(event)
        props.loadGame(gameIndex);
    }

    const handleDeleteGame = (event) => {
        const gameIndex = getIdFromEvent(event)
        props.removeGame(gameIndex);
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