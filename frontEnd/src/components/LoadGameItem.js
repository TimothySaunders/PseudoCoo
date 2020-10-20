import React from "react";
import "./LoadGameItem.css";

export default function LoadGameItem({ game, clickEvent, deleteEvent }) {
    const handleLoadGame = (event) => {
        clickEvent(event);
    }
    const handleDeleteGame = (event) => {
        event.stopPropagation();
        deleteEvent(event);
    }
    return (
        <section id={`save-${game.id}`} className="load-game-item" onClick={handleLoadGame}>
            <span>{game.timeStamp}</span>
            <button id={"del-" + game.id} className="delete" onClick={handleDeleteGame}>
                <span className="fas fa-exclamation-triangle"></span> Delete
            </button>
        </section>
    )
}