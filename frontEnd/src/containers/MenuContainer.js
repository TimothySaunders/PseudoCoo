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

        // this.newGame=this.newGame.bind(this);
        // this.importImage=this.importImage.bind(this);
        // this.viewSavedGames=this.viewSavedGames.bind(this);
        this.chooseMenu=this.chooseMenu.bind(this);

    };
    
    newGame(){
        this.setState({viewOption:"new"})
    }
    importImage(){
        this.setState({viewOption:"importImage"})
    }
    viewSavedGames(){
        this.setState({viewOption:"savedGames"})
    }
    chooseMenu(choice){
        const chosen = choice; 
        this.setState({viewOption:chosen})

    }



    render(){
        return(
            <Fragment>
                I am the menus container.
                {/* <br/>
                <button onClick={this.newGame} value="newGame"> Play </button><br/>
                <button onClick={this.importImage}> Extract from Image </button><br/>
                <button onClick={this.viewSavedGames}> Continue game </button> */}
                <MenuView chooseMenu={this.chooseMenu} viewOption={this.state.viewOption}   > </MenuView>

            </Fragment>
        )
    }


}