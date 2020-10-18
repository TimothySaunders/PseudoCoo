import React, {Component, Fragment} from 'react'
import {get, post, patch} from '../helpers/requests'
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

    async componentDidMount(){
        const saveGames =  await get("api/saves");
        this.setState({savedGames: saveGames})
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
            console.log(savedGame)
            // this.setState({game: savedGame})
        }
    }

    loadGame = (event) => {
        const targetId = event.target.id;
        const gameIndex = targetId.substring(targetId.length-1);
        const game = this.state.savedGames[gameIndex];
        this.setState({game: game});
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
                      viewOption={this.state.viewOption} savedGames={this.state.savedGames} loadGame={this.loadGame} > </MenuView>
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