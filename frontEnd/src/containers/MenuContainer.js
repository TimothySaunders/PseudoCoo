import React, { Component, Fragment } from 'react'
import { get, post, patch, remove } from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'
import sudoku from '../helpers/sudoku'
import './MenuContainer.css'
import CowTimer from '../helpers/CowTimer'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.addEventListener('end', recognition.start);//! THIS WORKS - it will will run indefinately but will crash out when changing views. 

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

        this.voiceCommands = this.voiceCommands.bind(this)
    };

    componentDidMount() {
        this.getSaveGames();
        // this.setState({ savedGames: saveGames })
        // recognition.start();
        this.voiceCommands();
        this.setState({cowTimer: new CowTimer()});
    }

    getSaveGames = async () => {
        const saveGames = await get("api/saves");
        this.setState({ savedGames: saveGames });
    }

    // !--- --- VOICE  START --- --- 
    // ------------------------------

    contains(checkedarray, arrayOfWords) {
        var result = false;
        for (let word of arrayOfWords) {
            if (checkedarray.includes(word)) {
                result = true
            }
        }

        return result;
    }

    // !Currently not used?
    voiceCommandsContain(arrayOfWords) {

        // recognition.start();
        // // recognition.addEventListener('end', recognition.start); //! ADDED TESTING
        // var result = false;
        // recognition.onresult = (e) => {
        //     let current = e.resultIndex;
        //     let transcript = e.results[current][0].transcript;
        //     let adjusted = (current === 1 && transcript === e.results[0[0].transcript])
        //     if (!adjusted) {
        //         // var result = false;
        //         var match = ""
        //         for (let word of arrayOfWords) {
        //             if (transcript.includes(word)) {
        //                 result = true
        //                 match = word;
        //                 console.log("trn: " + transcript + "  - >" + word + " was detected hence result = " + result)
        //             }
        //         }
        //     }
        // }
        // recognition.abort();  //! ADDED TESTING


        // return result;
    }

    voiceCommandsGameGrid() {
        // try {

        //     recognition.onresult = (e) => {
        //         let current = e.resultIndex;
        //         let transcript = e.results[current][0].transcript;
        //         let output = "";
        //         let adjusted = (current === 1 && transcript === e.results[0[0].transcript])
        //         if (!adjusted) {
        //             if (transcript === 'verify' || transcript === ' verify') {
        //                 output = "Grid 1";
        //             }
        //             if (transcript === 'back' || transcript === ' back') {
        //                 output = "Grid2";
        //             }
        //             if (transcript === 'verify' || transcript === ' verify') {
        //                 output = "Grid 3";
        //             }

        //         }
        //         return output;
        //     }

        // } catch (error) {
        //     console.log(error + "   oops i broke");

        // }
        
    }



    // Currently Passed down to gameGrid and then to each cell - clicking on a cell activates this and tk
    voiceCommandsContainsDigit(functionPassedBack) {
        try {
            // recognition.abort();  //! ADDED TESTING
            // recognition.stop();  //! ADDED TESTING
            // recognition.start();
            // recognition.addEventListener('end', recognition.start); //! ADDED TESTING
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
        } catch (error) {
            console.log(error + "   oops i broke");
        }
    }

    resetOrder = () => {
        this.setState({ voiceOrder: ""})
    }

    voiceCommands() {   // THIS IS what controls the MENU navigation
        // recognition.stop();
        // recognition.abort();
        recognition.start();  // !
        // recognition.addEventListener('end', recognition.start); //! ADDED TESTING
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

                if (this.contains(transcript, ['back'])) {
                    console.log("reset called")
                    this.reset();
                    this.setState({ viewOption: "mainMenu" })
                }
                if (this.contains(transcript, ['solve', 'solve', 'resolve', 'endgame'])) {
                    console.log("solve called")
                    this.setState({ voiceOrder: "solve" }) 
                }

                if (this.contains(transcript, ['hint', 'help', 'help me'])) {
                    console.log("hint")
                    this.setState({ voiceOrder: "hint" }) 
                }
                if (this.contains(transcript, ['reset', 'clear', 'empty', 'clear board', 'empty board', 'reset board'])) {
                    console.log("clear")
                    this.setState({ voiceOrder: "clear" }) 
                }
                if (this.contains(transcript, ['notes', 'note'])) {
                    console.log("notes")
                    this.setState({ voiceOrder: "notes" }) 
                }
                if (this.contains(transcript, ['save', 'save game', 'later'])) {
                    console.log("save")
                    this.setState({ voiceOrder: "save" }) 
                }
                if (this.contains(transcript, ['bang', 'shoot', 'confetti', 'boom'])) {
                    console.log("confetti")
                    this.setState({ voiceOrder: "confetti" }) 
                }
                if (this.contains(transcript, ['verify', 'show', 'correct'])) {
                    console.log("verify")
                    this.setState({ voiceOrder: "verify" }) 
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

                // setTimeout(() => {
                //     recognition.start();
                // }, 50);

                console.log(transcript);
            }
            // setTimeout(() => {
            //     recognition.start();
            // }, 50);
        }

    }
    // !  --- VOICE--- END  --- --- ---
    // ------------------------------
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
        recognition.stop(); //!! TESTING 
        recognition.abort(); //!! TESTING 
        const chosen = choice;
        this.setState({ viewOption: chosen })
        // this.voiceCommands();
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

    render() {

        if (this.state.game.gridValues === "") {
            return (
                <Fragment>
                    <MenuView chooseMenu={this.chooseMenu} createGameString={this.createGameString} cowTimer={this.state.cowTimer}
                        viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} removeGame={this.removeGame}> </MenuView>
                    {/* <br />
                    <button onClick={this.voiceCommands}>resume VRC</button> */}
                </Fragment>
            )
        } else {
            return (
                <Fragment>

                    <GameGrid game={this.state.game} saveGame={this.saveGame} listenForDigit={this.voiceCommandsContainsDigit}
                        resizeGrid={this.props.resizeGrid} returnHome={this.reset} voiceOrder={this.state.voiceOrder} resetOrder={this.resetOrder} cowTimer={this.state.cowTimer}></GameGrid>
=
                </Fragment>
            )
        }
    }
}



