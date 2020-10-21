import React, { Component, Fragment, } from "react";
import GridCell from "./GridCell";
import "./GameGrid.css";
import sudoku from '../helpers/sudoku';
import PsChecker from '../helpers/PsChecker';
import Parser from "../helpers/StringParser";
import confetti from "canvas-confetti";


const sp = new Parser();
const psc = new PsChecker();

let timeout;

export default class GameGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: [],
            writeNotes: false,
            showConflictToggle: false,
            grid:"",
            hint:null,
            currentOrder:"",
            preventDoubleExecution:1
        }
        this.handleNumberInput = this.handleNumberInput.bind(this);
        this.toggleNotes = this.toggleNotes.bind(this);
        this.showConflict = this.showConflict.bind(this);
        this.hint = this.hint.bind(this);
        

    }


    componentDidMount() {
        this.props.resizeGrid();
        let gameState;

        if (this.props.game.gridValues.length === 81) {
            gameState = sp.getObjects(this.props.game.gridValues);
        } else {
            gameState = sp.getObjectsFromSavedString(this.props.game.gridValues);
        }
        let getGrid = sp.getRawStringFromObjects(gameState);
        
        this.setState({ gameState: gameState, grid: getGrid });

        if (this.props.cowTimer){
            clearTimeout(timeout);
            this.props.cowTimer.endTimer()
            this.props.cowTimer.startTimer(30, 30, "PSEUDOCOO!")
            timeout = setTimeout(()=>{this.props.cowTimer.startTimer(14, 20, "hint")}, 28000)
        }

       
        this.setState({currentOrder: this.props.voiceOrder}, this.executeOrder66)
    }
  
    executeVoiceOrders = (order) => {
        console.log("Execute order");
        let prev = this.state.preventDoubleExecution
        prev +=1;


        // if (prev%2===0) {
        if (order==="solve"){
            this.solve();
            this.setState({preventDoubleExecution:prev})  
        }
        if (order==="notes"){
            this.toggleNotes();
            this.setState({preventDoubleExecution:prev}) 
        }
        if (order==="clear"){
            this.clear();  
            this.setState({preventDoubleExecution:prev})
        }
        if (order==="verify"){
            this.toggleShowConflict();  
            this.setState({preventDoubleExecution:prev})
        }
        if (order==="hint"){
            this.hint();  
            this.setState({preventDoubleExecution:prev})
        }
        if (order==="save"){
            this.handleSaveGame(); 
            this.setState({preventDoubleExecution:prev}) 
        }
        if (order==="confetti"){
            this.confettiCannon();  
            this.setState({preventDoubleExecution:prev})
        }
        // }
        // if (order==="joke"){
        //     this.getCowWithAjoke?();  
        // }
        
        this.props.resetOrder();
        // prev = this.state.preventDoubleExecution
        
        // this.setState({preventDoubleExecution:prev})

    }


    toggleNotes() {
        this.setState({ writeNotes: !this.state.writeNotes });
    }
    solve = () => {
        // this.clear(); //! Needs to be run so that it eliminates any invalid entries, trying to solve 
        // const solution = sudoku.sudoku.solve(this.props.game.gridValues);
        // let toConvert = sp.getRawStringFromObjects(this.state.gameState)
        // toConvert.replace("0", ".");
        let toConvert = sp.getRawStringFromObjects(this.state.gameState);
        toConvert.replace("0", ".");  //! May need to be removed
        const solution = sudoku.sudoku.solve(toConvert);
        if (solution) {
            let prevState = this.state.gameState;
            let gameState = sp.getObjects(solution);
            prevState = prevState.map((cell, index) => {
                cell.value = gameState[index].value;
                return cell;
            });
            this.setState({ gameState: prevState });
            this.confettiCannon();
            clearTimeout(timeout);
            this.props.cowTimer.endTimer();
            this.props.cowTimer.startTimer(18, 18, "*I* solved it! That confetti is for me, not you!!")
            timeout = setTimeout(()=>{this.props.cowTimer.endTimer()}, 15000)
        }
    }

    clear = () => {
        let cells = this.state.gameState;
        cells = cells.map(cell => {
            if (cell.editable) {
                cell.value = ".";
                cell.notes = [];
            }
            return cell;
        });
        this.setState({ gameState: cells });
    }

    gridIsStillSolvable = () => {
        var solvable = true;
        let grid = sp.getRawStringFromObjects(this.state.gameState);
        if (sudoku.sudoku.solve(grid) === false) {
            solvable = false;
        }
        return solvable;
    }

    gridIsFilled = () => {
        return !sp.getRawStringFromObjects(this.state.gameState).includes(".")
    }

    gridIsSolved = () => {
        const currentGameState = sp.getRawStringFromObjects(this.state.gameState);
        console.log(currentGameState);
        const solution = sudoku.sudoku.solve(currentGameState);
        console.log(solution);
        if (currentGameState === solution) {
            return true;
        }
        return false;
    }

    confettiCannon() {
        var count = 250;
        var defaults = {
            origin: { y: 0.8 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, {
            spread: 56,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 120,
        });
        fire(0.55, {
            spread: 180,
            decay: 0.90,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.2, {
            spread: 120,
            startVelocity: 55,
        });
    }

    // handleNumberInput(index, newCell, display) {
    handleNumberInput(index, cell, display, input) {
        let updated = this.state.gameState;

        if (this.state.writeNotes) {
            // write some notes
            if (input.match(/[1-9]/)) {
                if (cell.notes.includes(input)) {
                    cell.notes = cell.notes.filter(note => note !== input);
                } else {
                    cell.notes.push(input);
                }
            }
        } else {
            // write into the box
            cell.value = input;
        }
        updated[index] = cell;
        if (this.gridIsSolved()) {
            this.confettiCannon();
            clearTimeout(timeout);
            this.props.cowTimer.endTimer()
            this.props.cowTimer.startTimer(18, 18, "Cow-gratulations!!")
            timeout = setTimeout(()=>{this.props.cowTimer.endTimer()}, 15000)
        }
        display.textContent = ["0", "."].includes(cell.value) ? "" : cell.value;
        this.setState({ gameState: updated });
    }

    handleSaveGame = () => {
        const gridValues = sp.convertObjectsToSaveString(this.state.gameState);
        this.props.saveGame(gridValues);
        clearTimeout(timeout);
        this.props.cowTimer.endTimer()
        this.props.cowTimer.startTimer(20, 20, "Saved!")
        timeout = setTimeout(()=>{this.props.cowTimer.startTimer(18, 25, "hint")}, 20000)
    }


    hint = () => {
        /// solve the sudoku
        let toConvert = sp.getRawStringFromObjects(this.state.gameState);
        if(toConvert.indexOf(".") !== -1){ 
        toConvert.replace("0", ".");
        const solution = sudoku.sudoku.solve(toConvert);
        let hints = []
        if (solution) {
            console.log("solution: " + solution + "< --- " );
            let gridObjects = this.state.gameState
           for(let i=0;i< gridObjects.length; i++){                  //
               if (gridObjects[i].editable) {                     //
                   hints.push([i,solution[i]])     // should create a list of the solutions (excluding uneditable cells) 
               }
           } 




           
        }
        if (hints.length >0) {
        this.setState({hint: hints[0]});
        // this.setState(gameState[hints[0][0]].editable:false,gameState[hints[0][0]].value=hints[0][1])
        let index = hints[0][0];
        let value = hints[0][1];
        let updated = this.state.gameState;
        let cell = updated[index];
        cell.editable = false;
        cell.value = value;
        updated[index]=cell;

        let a = this.state.preventDoubleExecution;
        if(a%2===0) {
            // console.log("a: " + a)
        this.setState({gameState: updated});
        }
        }
        }
        if (this.gridIsSolved()) {
            this.confettiCannon();
        }
     
        clearTimeout(timeout);
        this.props.cowTimer.endTimer();
        this.props.cowTimer.startTimer(18, 18, "Mooston, we have a problem...")
        timeout = setTimeout(()=>{this.props.cowTimer.startTimer(18, 25, "hint")}, 20000)
    }
    
    toggleShowConflict = (event) => {
        if (!this.state.showConflictToggle) {
            event.target.textContent = "Hide verify";
        } else {
            event.target.textContent = "Verify";
        }
        this.setState({ showConflictToggle: !this.state.showConflictToggle })


    }

    showConflict(i, grid, cell) {

    
        if (this.toggleShowConflict) {
            return psc.validateEntry(i, grid, cell.value)
        }
    }

    grid = () => {
        return sp.getRawStringFromObjects(this.state.gameState);
    }

    returnHome = () => {
        clearTimeout(timeout);
        this.props.cowTimer.endTimer()
        this.props.returnHome();
    }


    componentDidUpdate() {

        let order = this.props.voiceOrder;
        if (order!==""){
            this.executeVoiceOrders(order)
        }

    }

    render() {
     
        const gridCells = this.state.gameState.map((cell, i) => {


            if (!cell.editable) {
            return (
            
                <GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} hint={this.state.hint}/>
            )
        } else { return (<GridCell key={i} index={i} cell={cell} onNumberInput={this.handleNumberInput} listenForDigit={this.props.listenForDigit} grid={this.state.grid} showConflict={this.showConflict} showConflictToggle={this.state.showConflictToggle} hint={this.state.hint}/>)  }
        });


        return (
            <Fragment>
                <div className="menu-grid">
                    <button className="return-home" onClick={this.returnHome}> Return to Menu</button>
                </div>
                <div id="game-container">
                    <div id="game-grid">
                        {gridCells}
                    </div>
                    <div id="game-buttons">
                        <button onClick={this.solve} >Solve</button>
                        <button onClick={this.toggleNotes}>{this.state.writeNotes ? "Enter numbers" : "Enter notes"}</button>
                        <button onClick={this.clear} >Clear</button>
                        <button onClick={this.toggleShowConflict} >Verify</button>
                        <button onClick={this.hint} >Hint (£5)</button>
                        <button onClick={this.handleSaveGame} >Save</button>
                    </div>
                    

                </div>
            </Fragment>
        )
    }
}
