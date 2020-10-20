import React, { Component, Fragment } from 'react'
import { get, post, patch, remove } from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'
import JokeTimer from '../helpers/JokeTimer'
import sudoku from '../helpers/sudoku'
import './MenuContainer.css'


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
        new JokeTimer(15, 30)
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
        for (let word of arrayOfWords) {
            if (checkedarray.includes(word)) {
                result = true
            }
        }

        return result;
    }

    voiceCommandsContain(arrayOfWords) {
        recognition.start();
        var result = false;
        recognition.onresult = (e) => {
            let current = e.resultIndex;
            let transcript = e.results[current][0].transcript;
            let adjusted = (current === 1 && transcript === e.results[0[0].transcript])
            if (!adjusted) {
                // var result = false;
                var match = ""
                for (let word of arrayOfWords) {
                    if (transcript.includes(word)) {
                        result = true
                        match = word;
                        console.log("trn: " + transcript + "  - >" + word + " was detected hence result = " + result)
                    }
                }
            }
        }

        return result;
    }

    voiceCommandsContainsDigit(functionPassedBack) {
        try {

            recognition.stop();
            recognition.start();
            var match = "";   // ! this is not being overridden in time before value is returned.
            recognition.onresult = (e) => {
                let current = e.resultIndex;
                let transcript = e.results[current][0].transcript;
                let output = "...";
                let adjusted = (current === 1 && transcript === e.results[0[0].transcript])
                // var result = false;

                if (!adjusted) {
                    if (transcript === 'one' || transcript === ' one' || transcript === '1') {
                        output = "1";
                    }
                    if (transcript === 'two' || transcript === ' two' || transcript === "2") {
                        output = "2";
                    }
                    if (transcript === 'three' || transcript === ' three' || transcript === '3') {
                        output = "3";
                    }
                    if (transcript === 'four' || transcript === ' four' || transcript === '4') {
                        output = "4";
                    }
                    if (transcript === 'five' || transcript === ' five' || transcript === '5') {
                        output = "5";
                    }
                    if (transcript === 'six' || transcript === ' six' || transcript === '6') {
                        output = "6";
                    }
                    if (transcript === 'seven' || transcript === ' seven' || transcript === '7') {
                        output = "7";
                    }
                    if (transcript === 'eight' || transcript === ' eight' || transcript === '8') {
                        output = "8";
                    }
                    if (transcript === 'nine' || transcript === ' nine' || transcript === '9') {
                        output = "9";
                    }
                }
                // setTimeout(() => {
                //     recognition.start();
                // }, 50);
                recognition.stop();
                console.log("tr " + transcript)
                console.log(output + " maybe this is working")
                functionPassedBack(output);
                // return output;
            }
        } catch(error) {
            console.log(error + "   oops i broke");
        }
    }

    voiceCommands() {

        // recognition.abort();
        // recognition.start();  // !
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

                if (this.contains(transcript, ['back', 'reset'])) {
                    console.log("reset called")
                    this.reset();
                    this.setState({ viewOption: "mainMenu" })
                }
                if (transcript === 'play' || transcript === ' play') {
                    this.setState({ viewOption: "DifficultyMenu" })
                }

                if (this.state.viewOption === "DifficultyMenu") {
                    if (this.contains(transcript, ['laughing', 'coo', 'cow'])) {
                        const generatedString = sudoku.sudoku.generate("easy", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    // if (transcript.includes('skimmed','milk')  ) {
                    if (this.contains(transcript, ['skimmed', 'milk'])) {
                        const generatedString = sudoku.sudoku.generate("medium", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['mooodium', 'rare', 'moodium', 'medium', 'mooooodium'])) {
                        const generatedString = sudoku.sudoku.generate("hard", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['difficult', 'uterly', 'udder', 'udderly', 'elderly'])) {
                        const generatedString = sudoku.sudoku.generate("very-hard", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['mad', 'madcow'])) {
                        const generatedString = sudoku.sudoku.generate("insane", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }
                    if (this.contains(transcript, ['holy', ' holy'])) {
                        const generatedString = sudoku.sudoku.generate("inhuman", true);
                        this.creategameStringFromDifficulty(generatedString)
                    }

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
    }

    render() {

        if (this.state.game.gridValues === "") {
            return (
                <Fragment>
                    <MenuView chooseMenu={this.chooseMenu} createGameString={this.createGameString}
                        viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} removeGame={this.removeGame}> </MenuView>
                    <br />
                    <button onClick={this.voiceCommands}>resume VRC</button>
                    <div id="cow-container">
                            <img id="cow" className="cow-animation" src="cow.png" alt="cow" draggable="false"></img>
                            <img id="speech-bubble" className="cow-animation" src="speech_bubble.png" alt="speech" draggable="false"></img>
                            <p class="cow-speech" id="setup">testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123</p>
                            <p class="cow-speech" id="punchline">testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123</p>
                    </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <GameGrid game={this.state.game} saveGame={this.saveGame} voiceInput={this.voiceCommandsContain} listenForDigit={this.voiceCommandsContainsDigit}  ></GameGrid>
                    <button onClick={this.reset}> Return to menu</button>
                    <br />
                    <button onClick={this.voiceCommands}>resume VRC</button>
                    <div id="cow-container">
                            <img id="cow" className="cow-animation" src="cow.png" alt="cow" draggable="false"></img>
                            <img id="speech-bubble" className="cow-animation" src="speech_bubble.png" alt="speech" draggable="false"></img>
                            <p class="cow-speech" id="setup">testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123</p>
                            <p class="cow-speech" id="punchline">testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123 testing testing 123</p>
                    </div>
                </Fragment>
            )
        }
    }
}



