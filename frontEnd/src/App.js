import React, { Fragment, useState} from 'react';
import MenuContainer from './containers/MenuContainer'
import './App.css';

function App() {


  return (

    <Fragment>
      The APP:
      <MenuContainer/>
      <div id="cow-container">
        <img id="cow" className="cow-animation" src="cow.png" alt="cow" draggable="false"></img>
        <img id="speech-bubble" className="cow-animation" src="speech_bubble.png" alt="speech" draggable="false"></img>
        <p className="cow-speech" id="setup"></p>
        <p className="cow-speech" id="punchline"></p>
      </div>

  
    </Fragment>

  );
}

export default App;
