import React, {Fragment} from 'react';
import CowTimer from '../helpers/CowTimer';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

    props.cowTimer.startTimer(12, 25, "MOOOOOOOOO")

    const handleLoadGame = (game) => {
        const gameId = game.id;
        props.cowTimer.endTimer();
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
        props.cowTimer.endTimer();
        props.returnHome();
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