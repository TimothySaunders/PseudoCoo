import React, {Component, Fragment} from 'react'
import MenuView from '../components/MenuView'


export default class MenuContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            gameString:"",
            viewOption: "mainMenu",
            savedGames: []
        }
        this.chooseMenu=this.chooseMenu.bind(this);
        this.creategameStringFromDifficulty=this.creategameStringFromDifficulty.bind(this);
        this.reset=this.reset.bind(this);

    };
    chooseMenu(choice){
        const chosen = choice; 
        this.setState({viewOption:chosen})
    }
    creategameStringFromDifficulty(choice) {
        const chosenDifficulty = choice; 
        this.setState({gameString:chosenDifficulty})
    }

    reset(){
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
                    <div> you have chosen difficulty {this.state.gameString}</div>
                    <button onClick={this.reset}> Return to menu</button>
                </Fragment>
            )
        }


        
    }


}