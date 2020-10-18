import React from 'react';

export default function LoadGame(props){

    const saveNodes = props.savedGames.map((game, index) => {
        return (
                <button id={"save-"+index} key={index} onClick={props.loadGame}>{game.timeStamp}</button>
        )
    })

    return(
        <div>
            {saveNodes}
        </div>
    )

}