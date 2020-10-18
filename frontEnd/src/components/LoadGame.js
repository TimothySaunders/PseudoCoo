import React from 'react';

export default function LoadGame(props){

    const getIdFromEvent = (event) => {
        const targetId = event.target.id;
        return targetId.substring(targetId.length-1);
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
            <div>
                <button id={"save-"+index} key={"sav"+index} onClick={handleLoadGame}>{game.timeStamp}</button>
                <button id={"del-"+index} key={"del"+index} onClick={handleDeleteGame}>Delete</button>
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