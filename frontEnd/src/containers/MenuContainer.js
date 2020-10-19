import React, { Component, Fragment } from 'react'
import { get, post, patch } from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// recognition.start();

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                id: null,
                gridValues: "",
                timeStamp: ""
            },
            viewOption: "mainMenu",
            savedGames: []
        }

    };

    async componentDidMount() {
        const saveGames = await get("api/saves");
        this.setState({ savedGames: saveGames })
        console.log('fff!')
        // recognition.start();
        this.voiceCommands();

        console.log('fff2!')
    }
    // --- --- VOICE  --- --- 

    voiceCommands() {
        recognition.start();
        console.log("inVoiceCommands")
        recognition.onstart = () => {
            console.log("voice recog initialised");
        }
        recognition.onresult = (e) => {
            console.log("here")
            let current = e.resultIndex;

            let transcript = e.results[current][0].transcript;
            let adjusted = (current === 1 && transcript === e.results[0[0].transcript])

            if (!adjusted) {
                if (transcript === 'load' || transcript === ' load') {
                    this.setState({ viewOption: "SavedGames" })
                }
                if (transcript === 'back' || transcript === ' back') {
                    this.setState({ viewOption: "mainMenu" })

                }
                if (transcript === 'play' || transcript === ' play') {
                    this.setState({ viewOption: "DifficultyMenu" })
                    
                }

            setTimeout(() => {
                recognition.start();
            }, 50);

            console.log(transcript);
        }
    }
}
// --- --- --- ---

saveGame = async (gridValues) => {
    const saveGame = {
        gridValues: gridValues,
        timeStamp: new Date().toLocaleString()
    }
    if (this.state.game.id === null) {
        const savedGame = await post("api/saves", saveGame)
        this.setState({ game: savedGame })
    } else {
        saveGame.id = this.state.game.id;
        const savedGame = await patch("api/saves/" + saveGame.id, saveGame)
        this.setState({ game: savedGame })
    }
}

loadGame = (event) => {
    const targetId = event.target.id;
    const gameIndex = targetId.substring(targetId.length - 1);
    const game = this.state.savedGames[gameIndex];
    this.setState({ game: game });
}

chooseMenu = (choice) => {
    const chosen = choice;
    this.setState({ viewOption: chosen })
}

creategameStringFromDifficulty = (choice) => {
    const newGame = this.state.game;
    newGame.gridValues = choice;
    this.setState({ game: newGame })
}

reset = () => {
    this.setState({
        game: {
            id: null,
            gridValues: "",
            timeStamp: ""
        }
    });
}


render() {

    if (this.state.game.gridValues === "") {
        return (
            <Fragment>
                <MenuView chooseMenu={this.chooseMenu} creategameStringFromDifficulty={this.creategameStringFromDifficulty}
                    viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} > </MenuView>
                    <br/>
                    <button onClick={this.voiceCommands}>resume VRC</button>
            </Fragment>
        )
    } else {
        return (
            <Fragment>
                <GameGrid game={this.state.game} saveGame={this.saveGame}></GameGrid>
                <button onClick={this.reset}> Return to menu</button>
                <br/>
                <button onClick={this.voiceCommands}>resume VRC</button>
            </Fragment>
        )
    }





    
}


}