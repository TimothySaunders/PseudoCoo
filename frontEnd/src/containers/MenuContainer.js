import React, { Component, Fragment } from 'react'
import { get, post, patch, remove } from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'
import sudoku from '../helpers/sudoku'
import './MenuContainer.css'
import CowTimer from '../helpers/CowTimer'
import ImageUpload from './ImageUpload'
import voice from '../helpers/PseudoMoo'

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                id: null,
                gridValues: "",
                timeStamp: "",
                voiceOrder:""
            },
            viewOption: "mainMenu",
            savedGames: [],
            cowTimer: null
        }
        this.voiceCommandConfig = [
            {words: ["home", "menu"], function: this.setState, args: [{ viewOption: "mainMenu" }]},
            {words: ["play", "start", "go"], function: this.setState, args: [{ viewOption: "DifficultyMenu" }]},
            {words: ["upload", "image", "photo"], function: this.setState, args: [{ viewOption: "ImportImage" }]},
            {words: ["load", "continue"], function: this.setState, args: [{ viewOption: "SavedGames" }]},  
        ];
    }

    componentDidMount() {
        this.getSaveGames();
        this.actingOnVoiceCommands();
        this.setState({cowTimer: new CowTimer()});
    }

    getSaveGames = async () => {
        const saveGames = await get("api/saves");
        this.setState({ savedGames: saveGames });
    }

    actingOnVoiceCommands = () => {
        voice.logWhatIsBeingSaid();
    }

    showVoiceX = () => {
        console.log(voice.getWordsHeardRecently())
    }
    
    resetOrder = () => {
        this.setState({ voiceOrder: ""})
    }

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
        this.getSaveGames();
    }

    loadGame = (id) => {
        console.log(id)
        const game = this.state.savedGames.find(game => game.id === parseInt(id));
        this.setState({ game: game });
    }

    removeGame = async (id) => {
        await remove("/api/saves/" + id);
        this.getSaveGames();
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
    
    createGameString = (choice) => {
        const newGame = {
            id: null,
            gridValues: choice,
            timeStamp: ""
        }
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
        this.chooseMenu("mainMenu")
    }

    startListen = () => {
        voice.startListeningToStuff(this.voiceCommandConfig);
    }

    stopListen = () => {
        voice.stopListeningToStuff();
    }

    render() {
      
        if (this.state.game.gridValues === "") {
            return (
                <Fragment>
                    <MenuView chooseMenu={this.chooseMenu} createGameString={this.createGameString} cowTimer={this.state.cowTimer}
                        viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} removeGame={this.removeGame}> </MenuView>
                        <button onClick={this.startListen} > LISTEN</button>
                        <button onClick={this.stopListen} > STOP</button>
                </Fragment>
            )
        } else {
            return (
                <Fragment>

                    <GameGrid game={this.state.game} saveGame={this.saveGame} listenForDigit={this.voiceCommandsContainsDigit}
                        resizeGrid={this.props.resizeGrid} returnHome={this.reset} voiceOrder={this.state.voiceOrder} resetOrder={this.resetOrder} cowTimer={this.state.cowTimer}></GameGrid>

                </Fragment>
            )
        }
    }
}



