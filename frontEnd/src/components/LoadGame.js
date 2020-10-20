import React from 'react';
import CowTimer from '../helpers/CowTimer';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

    const moo = new CowTimer(10, 15, "moo")
    moo.startTimer();

    const handleLoadGame = (game) => {
        const gameId = game.id;
        moo.endTimer();
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

    return (
        <main id="load-games">
            {saveNodes}
        </main>
    )

}