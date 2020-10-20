import React from 'react';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

    const getIdFromEvent = (event) => {
        const stringIndexofID = event.target.id.indexOf("-") + 1;
        const targetId = event.target.id.slice(stringIndexofID);
        return targetId;
    }

    const handleLoadGame = (event) => {
        const gameId = getIdFromEvent(event)
        console.log(gameId);
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