import React from 'react';
import MenuContainer from './containers/MenuContainer'
import './App.css';

function App() {
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
    } catch(e) {}
  }

  window.onresize = () => {
    // resize the game grid
    resizeGrid();
    
  }
  return (

    <main id="main_container" ref={div => mainContainer = div}>
      {/* Psuedocoo */}
      <MenuContainer resizeGrid={resizeGrid} />
    </main>

  );
}

export default App;
