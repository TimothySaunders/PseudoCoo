import React, {Fragment} from 'react';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

    if (props.cowTimer) {
        props.cowTimer.clearAll()
        props.cowTimer.addImmediately(1, 1.5, "Here's one I did earlier...", "Finish it off for me, will ya?")
        props.cowTimer.addToQueue(15, 3, "", "", true, 15, 20)
    }

    const handleLoadGame = (game) => {
        const gameId = game.id;
        props.loadGame(gameId);
    }

    const handleDeleteGame = (game) => {
        const gameId = game.id;
        props.removeGame(gameId);
    }

    const saveNodes = props.savedGames.map((game, index) => {
        return (
            <LoadGameItem key={index} game={game} clickEvent={handleLoadGame} deleteEvent={handleDeleteGame} />
        )
    })

    const returnHome = () => {
        props.returnHome("mainMenu");
    }

    return (
        <Fragment>
            <div className="menu-grid">
                <button className="return-home" onClick={returnHome}> Return to Menu</button>
            </div>
            <h1>Load Game</h1>
            <div id="load-games">
                {saveNodes}
            </div>
        </Fragment>
    )

}