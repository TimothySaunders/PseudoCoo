import React from 'react';
import "./LoadGame.css";
import LoadGameItem from "./LoadGameItem.js";

export default function LoadGame(props) {

    const handleLoadGame = (game) => {
        props.loadGame(game.id);
    }

    const handleDeleteGame = (game) => {
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