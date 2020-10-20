import React from 'react';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

    const getIdFromEvent = (event) => {
        const stringIndexofID = event.target.id.indexOf("-") + 1;
        const targetId = event.target.id.slice(stringIndexofID);
        return targetId;
    }

    const handleLoadGame = (game) => {
        // const gameId = getIdFromEvent(event)
        // console.log(gameId);
        props.loadGame(game.id);
    }

    const handleDeleteGame = (game) => {
        // const gameId = getIdFromEvent(event)
        props.removeGame(game.id);
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