import React, {Component, Fragment} from 'react'
import {getSaves} from '../helpers/Requests'
import MenuView from '../components/MenuView'
import GameGrid from '../components/GameGrid'


export default class MenuContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            gameString:"",
            viewOption: "mainMenu",
            savedGames: []
        }
       

    };

    componentDidMount(){
        getSaves()
        // const saveGames = 
    }

    chooseMenu = (choice) => {
        const chosen = choice; 
        this.setState({viewOption:chosen})
    }

    creategameStringFromDifficulty = (choice) => {
        const chosenDifficulty = choice; 
        this.setState({gameString:chosenDifficulty})
    }

    reset = () => {
        const val = "";
        this.setState({gameString:val});
    }

    render(){

        if(this.state.gameString===""){
            return(
                <Fragment>
                    <MenuView chooseMenu={this.chooseMenu} creategameStringFromDifficulty={this.creategameStringFromDifficulty}  viewOption={this.state.viewOption}   > </MenuView>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <GameGrid gameString={this.state.gameString}></GameGrid>
                    <button onClick={this.reset}> Return to menu</button>
                </Fragment>
            )
        }


        
    }


}