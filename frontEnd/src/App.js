import React, { useState } from 'react';
import MenuContainer from './containers/MenuContainer'
import './App.css';
import voice from "./helpers/PseudoMoo";

function App() {

  const [listening, setListening] = useState(false);
  const [firstTime, setFirstTime] = useState(1);

  let mainContainer;

  const resizeGrid = () => {
    try {
      const containerWidth = window.getComputedStyle(mainContainer).getPropertyValue("width").slice(0, -2);
      const scaleFactor = parseInt(containerWidth) / 600;
      const gameGrid = document.querySelector("#game-grid");
      const gameContainer = document.querySelector("#game-container");
      const buttons = document.querySelector("#game-buttons");
      if (scaleFactor < 1) {
        gameGrid.style.transform = `scale(${scaleFactor})`;
        gameContainer.style.gridTemplateRows = `${containerWidth}px 1fr`;
        buttons.style.width = `${containerWidth}px`;
        // gameContainer.style.marginLeft = "";
      } else {
        gameGrid.style.transform = "";
        // gameContainer.style.marginLeft = `${(containerWidth - 600) / 2}px`;
        gameContainer.style.gridTemplateRows = "600px 1fr";
        buttons.style.width = ``;
      }
    } catch (e) { }
  }

  window.onresize = () => {
    // resize the game grid
    resizeGrid();
  }

  const clickListenButton = () => {
    setFirstTime(0);
    if (listening) {
      voice.stopListeningToStuff();
      setListening(false);
    } else {
      voice.startListeningToStuff();
      setListening(true);
    }
  }
  return (

    <main id="main_container" ref={div => mainContainer = div}>
      <button id="listen_button" onClick={clickListenButton}>
        <div>
          {listening ? "Stop voice recog" : "Start voice recog"}
        </div>
      </button>
      {/* Psuedocoo */}
      <MenuContainer resizeGrid={resizeGrid} listening={listening} firstTime={firstTime} />
    </main >

  );
}

export default App;
