import React from 'react';
import CowTimer from '../helpers/CowTimer';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

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
            <LoadGameItem key={index} game={game} clickEvent={handleLoadGame} deleteEvent={handleDeleteGame} />
        )
    })

    return (
        <main id="load-games">
            {saveNodes}
        </main>
    )

}