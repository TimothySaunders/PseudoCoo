import React, { Component, Fragment } from 'react'
import { get, post, patch, remove } from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'
import JokeTimer from '../helpers/JokeTimer'
import sudoku from '../helpers/sudoku'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true;
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

        this.voiceCommands = this.voiceCommands.bind(this)
    };

    componentDidMount() {
        this.getSaveGames();
        const jokeGenerator = new JokeTimer(15, 30)
        // this.setState({ savedGames: saveGames })
        // recognition.start();
        this.voiceCommands();
    }

    getSaveGames = async () => {
        const saveGames = await get("api/saves");
        this.setState({ savedGames: saveGames });
    }
    // --- --- VOICE  --- --- 



    contains(checkedarray, arrayOfWords) {
        var result = false;
        for (let word of arrayOfWords){
            if (checkedarray.includes(word)) {
                result = true
            }
        }

        return result;
    }

    voiceCommands() {
        // recognition.abort();
        recognition.start();
        // recognition.continous =true;
        console.log("inVoiceCommands")
        recognition.onstart = () => {
            console.log("voice recog initialised");
        }
        recognition.onresult = (e) => {
            console.log("onresult")
            let current = e.resultIndex;

            let transcript = e.results[current][0].transcript;
            let adjusted = (current === 1 && transcript === e.results[0[0].transcript])

            if (!adjusted) {
                if (transcript === 'load' || transcript === ' load') {
                    this.setState({ viewOption: "SavedGames" })
                }

                if (this.contains(transcript, ['back','reset'])  ) {
                    console.log("reset called")
                    this.reset();
                    this.setState({ viewOption: "mainMenu" })   
                }
                if (transcript === 'play' || transcript === ' play') {
                    this.setState({ viewOption: "DifficultyMenu" })
                }

                if (this.state.viewOption==="DifficultyMenu") {
                    if (this.contains(transcript, ['laughing','coo', 'cow'])  ) {
                        const generatedString = sudoku.sudoku.generate("easy", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    // if (transcript.includes('skimmed','milk')  ) {
                    if (this.contains(transcript, ['skimmed','milk'])  ) {
                        const generatedString = sudoku.sudoku.generate("medium", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['mooodium','rare','moodium','medium','mooooodium'])  ) {
                        const generatedString = sudoku.sudoku.generate("hard", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['difficult','uterly','udder','udderly','elderly'])  ) {
                        const generatedString = sudoku.sudoku.generate("very-hard", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['mad','madcow'])  ) {
                        const generatedString = sudoku.sudoku.generate("insane", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['holy',' holy'])  ) {
                        const generatedString = sudoku.sudoku.generate("inhuman", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    
                }

                setTimeout(() => {
                    recognition.start();
                }, 50);

                console.log(transcript);
            }
            this.getSaveGames();
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

    loadGame = (id) => {
        const game = this.state.savedGames[id];
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

    loadGame = (event) => {
        const targetId = event.target.id;
        const gameIndex = targetId.substring(targetId.length - 1);
        const game = this.state.savedGames[gameIndex];
        this.setState({ game: game });
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
        this.setState({game:newGame})
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
                    <MenuView chooseMenu={this.chooseMenu} createGameString={this.createGameString}
                      viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} removeGame={this.removeGame}> </MenuView>
                    <br />
                    <button onClick={this.voiceCommands}>resume VRC</button>
                    
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <GameGrid game={this.state.game} saveGame={this.saveGame}></GameGrid>
                    <button onClick={this.reset}> Return to menu</button>
                    <br />
                    <button onClick={this.voiceCommands}>resume VRC</button>
                </Fragment>
            )
        }
    }
}



