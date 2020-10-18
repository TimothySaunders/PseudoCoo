import React from 'react';

export default function LoadGame(props){

    const handleLoadGame = (event) => {
        const targetId = event.target.id;
        const gameIndex = targetId.substring(targetId.length-1);
        props.loadGame(gameIndex);
    }

    const saveNodes = props.savedGames.map((game, index) => {
        return (
                <button id={"save-"+index} key={index} onClick={handleLoadGame}>{game.timeStamp}</button>
        )
    })

    return(
        <div>
            {saveNodes}
        </div>
    )

}