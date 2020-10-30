import {get} from './requests'

export default class CowTimer{

    constructor(){
        this.initialDelay = 0;
        this.min = 0;
        this.max = 0;
        this.out1 = "";
        this.out2 = "";
        this.joke = false;
        this.jokes = [];
        this.timeoutMain = null;
        this.timeoutInitialDelay = null;
        this.timeout1 = null;
        this.timeout2 = null;
        this.timeout3 = null;
        this.timeout4 = null;
        this.timeout5 = null;
        this.timeout6 = null;
        this.timeoutReset = null;
        this.bubbleDelay = 2000
        this.line1Delay = 500
        this.line1Life = 3000
        this.line2Delay = 0
        this.line2Life = 3000
        this.hideCowDelay = 2000
        
        this.addDomElements()
    }

    addDomElements(){
        const parentNode = document.querySelector("main")
        const container = document.createElement("div")
        container.setAttribute("id", "cow-container")
        const cowImg = document.createElement("img")
        cowImg.setAttribute("id", "cow")
        cowImg.setAttribute("class", "cow-animation")
        cowImg.setAttribute("src", "cow.png")
        cowImg.setAttribute("draggable", "false")
        const bubble = document.createElement("img")
        bubble.setAttribute("id", "speech-bubble")
        bubble.setAttribute("class", "cow-animation")
        bubble.setAttribute("src", "speech_bubble.png")
        bubble.setAttribute("draggable", "false")
        const lineOne = document.createElement("p")
        lineOne.setAttribute("id", "lineOne")
        lineOne.setAttribute("class", "cow-speech")
        const lineTwo = document.createElement("p")
        lineTwo.setAttribute("id", "lineTwo")
        lineTwo.setAttribute("class", "cow-speech")
        container.appendChild(cowImg)
        container.appendChild(bubble)
        container.appendChild(lineOne)
        container.appendChild(lineTwo)
        parentNode.appendChild(container)
    }

    //might need to make async to get cowjokes
    async startTimer(initialDelay, min, max, resetTimerOnActivity=false, out1="", out2=""){
        this.endTimer();
        this.initialDelay = 1000 * initialDelay;
        this.min = min;
        this.max = max;
        this.out1 = out1;
        this.out2 = out2;

        // if no output given fetches jokes from api
        if (out1===""){
            this.joke = true
            await this.getJokes();
        } else {
            this.joke = false
        }

        // adds event listeners for mouse and key presses - resets timer on these events
        if (resetTimerOnActivity===true){
            document.addEventListener("mousemove", this.resetTimer);
            document.addEventListener("keypress", this.resetTimer);
        }

        this.line2Delay = this.out2 || this.joke ? 0 : 0
        this.line2Life = this.out2 || this.joke ? 3000 : 1

        this.timeoutInitialDelay = setTimeout(this.output, this.initialDelay)

        // returns resolved promise afer delay so that function call can be used in async to run specified alert just once
        await this.delay(this.initialDelay + this.bubbleDelay + this.line1Delay + this.line1Life + this.line2Delay + this.line2Life + this.hideCowDelay + 1200)
        return Promise.resolve
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    endTimer(){
        //clear all timeouts so they dont carry over
        clearTimeout(this.timeoutInitialDelay);
        clearTimeout(this.timeoutMain);
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
        clearTimeout(this.timeout3);
        clearTimeout(this.timeout4);
        clearTimeout(this.timeout5);
        clearTimeout(this.timeout6);
        clearTimeout(this.timeoutReset);

        // remove eventlisteners, if exist
        document.removeEventListener("mousemove", this.resetTimer);
        document.removeEventListener("keypress", this.resetTimer);

        //reset dom element attributes
        document.getElementById("lineOne").classList.remove("fade-in")
        document.getElementById("lineOne").classList.remove("fade-out");
        document.getElementById("lineOne").style.visibility="hidden"
        document.getElementById("lineOne").innerHTML=""
        document.getElementById("lineTwo").classList.remove("fade-in")
        document.getElementById("lineTwo").classList.remove("fade-out");
        document.getElementById("lineTwo").style.visibility="hidden"
        document.getElementById("lineTwo").innerHTML=""
        document.getElementById("speech-bubble").style.visibility="hidden"
        document.getElementById("cow-container").style.bottom="-600px";
    }

    getJokes = async () => {
        this.jokes = await get("api/jokes");
    }

    output = () => {
        // if no output argument given then reply with joke instead
        if (this.joke === true){
            const selectedJoke = this.randomItemFromList(this.jokes)
            this.out1 = selectedJoke.setup
            this.out2 = selectedJoke.punchline
            const selectedJokeIndex = this.jokes.findIndex((joke) => joke === selectedJoke);
            this.jokes.splice(selectedJokeIndex, 1);
            if (this.jokes.length === 0){
                this.getJokes();
            }
        }

        // set line messages
        document.getElementById("lineOne").innerHTML=this.out1;
        document.getElementById("lineTwo").innerHTML=this.out2;

        // set sequential timestamps for use in timeouts
        const showBubbleTime = this.bubbleDelay
        const showLine1Time = showBubbleTime + this.line1Delay
        const hideLine1Time = showLine1Time + this.line1Life
        const showLine2Time = hideLine1Time + this.line2Delay
        const hideLine2Time = showLine2Time + this.line2Life
        const hideCowTime = hideLine2Time + this.hideCowDelay

        // set sequential steps using timeouts
        this.showCow()
        this.timeout1 = setTimeout(this.showBubble, showBubbleTime)
        this.timeout2 = setTimeout(this.showLineOne, showLine1Time)
        this.timeout3 = setTimeout(this.hideLineOne, hideLine1Time)
        this.timeout4 = setTimeout(this.showLineTwo, showLine2Time)
        this.timeout5 = setTimeout(this.hideLineTwo, hideLine2Time)
        this.timeout6 = setTimeout(this.removeCow, hideCowTime)

        // reset timer for animation after delay to allow for final animation step
        this.timeoutReset = setTimeout(this.resetTimer, hideCowTime + 1200);
    }
    
    randomInterval = (min, max) => {
        const interval = 1000 * Math.floor(min + (Math.random()*(max-min)));
        return interval
    }

    randomItemFromList = (list) => {
        const index = Math.floor((Math.random()*(list.length)));
        return list[index];
    }

    resetTimer = () => {
        clearTimeout(this.timeoutMain);
        let interval = this.randomInterval(this.min, this.max);
        this.timeoutMain = setTimeout(this.output, interval);
    }

    showCow = () => {
        document.getElementById("cow-container").style.bottom="-10px";
    }

    showBubble = () => {
        document.getElementById("speech-bubble").style.visibility="visible"
    }

    showLineOne = () => {
        document.getElementById("lineOne").classList.remove("fade-out");
        document.getElementById("lineOne").style.visibility="visible"
        document.getElementById("lineOne").classList.add("fade-in")
    }

    hideLineOne = () => {
        document.getElementById("lineOne").classList.remove("fade-in")
        document.getElementById("lineOne").classList.add("fade-out")
    }

    showLineTwo = () => {
        document.getElementById("lineTwo").classList.remove("fade-out");
        document.getElementById("lineTwo").style.visibility="visible"
        document.getElementById("lineTwo").classList.add("fade-in")
    }

    hideLineTwo = () => {
        document.getElementById("lineTwo").classList.remove("fade-in")
        document.getElementById("lineTwo").classList.add("fade-out")
    }

    removeCow = () => {
        document.getElementById("speech-bubble").style.visibility="hidden"
        document.getElementById("cow-container").style.bottom="-600px";
    }
}