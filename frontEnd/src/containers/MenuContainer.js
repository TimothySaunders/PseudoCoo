import React, {Component, Fragment} from 'react'
import {get, post, patch, remove} from '../helpers/requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'


export default class MenuContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            game: {
                id: null,
                gridValues: "",
                timeStamp: ""
            },
            viewOption: "mainMenu",
            savedGames: []
        }
    };

    componentDidMount(){
        this.getSaveGames();
        this.inactivityTime()
    }

    inactivityTime = () => {
        let time;
        window.onload = resetTimer;
        

        // document.onkeypress = resetTimer;
        // document.onmousemove = resetTimer;
    
        function newJoke() {
            // tell joke
            resetTimer();
        }
        
        //returns a random time in millisenconds between a min and max (seconds)
        function randomInterval(min, max) {
            return 1000 * Math.floor(min + (Math.random()*(max-min)));
        }

        function resetTimer() {
            clearTimeout(time);
            let interval = randomInterval(15, 30);
            console.log(interval/1000)
            time = setTimeout(newJoke, interval);
        }
    };

    getSaveGames = async () => {
        const saveGames =  await get("api/saves");
        this.setState({savedGames: saveGames});
    }

    saveGame = async (gridValues) => {
        const saveGame = {
            gridValues: gridValues,
            timeStamp: new Date().toLocaleString()
        }
        if (this.state.game.id === null){
            const savedGame = await post("api/saves", saveGame)
            this.setState({game: savedGame})
        } else {
            saveGame.id = this.state.game.id;
            const savedGame = await patch("api/saves/"+saveGame.id, saveGame)
            this.setState({game: savedGame})
        }
        this.getSaveGames();
    }

    loadGame = (id) => {
        const game = this.state.savedGames[id];
        this.setState({game: game});
    }

    removeGame = async (id) => {
        await remove("/api/saves/"+id);
        this.getSaveGames();
    }

    chooseMenu = (choice) => {
        const chosen = choice; 
        this.setState({viewOption:chosen})
    }

    creategameStringFromDifficulty = (choice) => {
        const newGame = this.state.game;
        newGame.gridValues = choice;
        this.setState({game:newGame})
    }

    reset = () => {
        this.setState({game: {
            id: null,
            gridValues: "",
            timeStamp: ""
        }});
    }

    render(){

        if(this.state.game.gridValues === ""){
            return(
                <Fragment>
                    <MenuView chooseMenu={this.chooseMenu} creategameStringFromDifficulty={this.creategameStringFromDifficulty}
                      viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} removeGame={this.removeGame}> </MenuView>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <GameGrid game={this.state.game} saveGame={this.saveGame}></GameGrid>
                    <button onClick={this.reset}> Return to menu</button>
                </Fragment>
            )
        }
    }

}