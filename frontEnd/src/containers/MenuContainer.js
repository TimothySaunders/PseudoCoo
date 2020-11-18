import React, { Component, Fragment } from 'react'
import { get, post, patch, remove } from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'
import './MenuContainer.css'
import '../helpers/CowTimer.css'
import voice from '../helpers/PseudoMoo'
import CowTimer from '../helpers/CowTimer';

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                id: null,
                gridValues: "",
                timeStamp: "",
            },
            viewOption: "mainMenu",
            savedGames: [],
            cowTimer: null
        }
        this.voiceCommandConfig = [
            { words: ["play", "start", "go"], function: this.chooseMenu, args: ["DifficultyMenu"] },
            { words: ["upload", "image", "photo"], function: this.chooseMenu, args: ["ImportImage"] },
            { words: ["load", "continue"], function: this.chooseMenu, args: ["SavedGames"] },  
        ];
    }

    componentDidMount() {
        this.getSaveGames();
        voice.setConfigureCommands(this.voiceCommandConfig);
        voice.addToPermanentCommands({ words: ["home", "menu"], function: this.reset, args: [] })
        this.setState({ cowTimer: new CowTimer() });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listening !== this.props.listening) {
            if (this.props.listening) {
                this.state.cowTimer.addImmediately(0.5, 1.5, "I'm listening!", "Try out these commands:<br />'menu' or 'confetti'")
            } else {
                if (this.props.firstTime === 0) {
                    this.state.cowTimer.addImmediately(0.5, 1.5, "Okay, I'll close my ears...", "")
                }
            }
        }
    }

    getSaveGames = async () => {
        const saveGames = await get("api/saves");
        this.setState({ savedGames: saveGames });
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

    render() {
        if (this.state.viewOption === "mainMenu"){
            voice.setConfigureCommands(this.voiceCommandConfig);
        }

        if (this.state.game.gridValues === "") {
            return (
                <Fragment>
                    <MenuView chooseMenu={this.chooseMenu} createGameString={this.createGameString} cowTimer={this.state.cowTimer}
                        viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} removeGame={this.removeGame}> </MenuView>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <GameGrid game={this.state.game} saveGame={this.saveGame} 
                        resizeGrid={this.props.resizeGrid} returnHome={this.reset} cowTimer={this.state.cowTimer}></GameGrid>
                </Fragment>
            )
        }
    }
}



