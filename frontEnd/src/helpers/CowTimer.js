import {get} from './requests'

export default class CowTimer{

    constructor(){
        this.currentMessage = {
            initialDelay: 0,
            duration: 0,
            min: 0,
            max: 0,
            out1: "",
            out2: "",
            repeat: false
        }
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
        this.line1Life = null //depends on duration argument passed in
        this.line2Delay = 500
        this.line2Life = null //depends on if second line of speech exists AND duration argument passed in
        this.hideCowDelay = 2000
        this.queue = []
        this.running = false
        
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

    addToQueue(initialDelay, duration = 3, out1 = "", out2 = "", repeat = false, min = 0, max = 0, resetTimerOnActivity = false) {
        const message = { initialDelay: initialDelay * 1000, duration: duration * 1000, out1: out1, out2: out2, repeat: repeat, min: min, max: max, resetTimerOnActivity: resetTimerOnActivity }
        // this check is required for testing whilst react is in strict mode for development build
        // consequentially wont be able to stack multiple of identical messages unless altered
        if (this.messageNotInQueue(message)) {
            this.queue.push(message);
            this.startTimer(this.running ? false : true);
        } else {
            console.log("Already in queue")
        }
        return message
    }

    addImmediately(initialDelay, duration = 3, out1 = "", out2 = "", repeat = false, min = 0, max = 0, resetTimerOnActivity = false) {
        const message = { initialDelay: initialDelay * 1000, duration: duration * 1000, out1: out1, out2: out2, repeat: repeat, min: min, max: max, resetTimerOnActivity: resetTimerOnActivity }
        if (this.messageNotInQueue(message)) {
            this.queue.unshift(message);
            this.startTimer(true);
        } else {
            console.log("Already in queue")
        }
        return message
    }

    messageNotInQueue(message){
        return this.queue.every(queueItem => {
            return (queueItem.initialDelay !== message.initialDelay ||
                    queueItem.out1 !== message.out1 ||
                    queueItem.out2 !== message.out2 ||
                    queueItem.repeat !== message.repeat ||
                    queueItem.min !== message.min ||
                    queueItem.max !== message.max ||
                    queueItem.resetTimerOnActivity !== message.resetTimerOnActivity)
        })
    }

    removeFromQueue(message){
        const index = this.queue.indexOf(message);
        if (index !==-1) {
            this.queue.splice(index, 1)
        } else {
            console.log("Not in queue")
        }
    }

    clearAll(){
        this.endTimer()
        this.currentMessage = {
            initialDelay: 0,
            min: 0,
            max: 0,
            out1: "",
            out2: "",
            repeat: false
        }
        this.queue = []
    }

    async startTimer(immediate=false){
        // end the loop if current message is on repeat
        if (immediate) {
            this.endTimer();

            //set variables to first item in queue or clear all settings if empty
            if (this.queue.length >= 1) {
                this.currentMessage = this.queue[0]
            } else {
                this.clearAll()
            }

            //remove from queue if not on repeat
            if (!this.currentMessage.repeat){
                this.removeFromQueue(this.currentMessage)
            }

            // if no output given fetches jokes from api
            if (this.currentMessage.out1===""){
                this.joke = true
                await this.getJokes();
            } else {
                this.joke = false
            }

            // adds event listeners for mouse and key presses - resets timer on these events
            if (this.currentMessage.resetTimerOnActivity===true){
                document.addEventListener("mousemove", this.resetTimer);
                document.addEventListener("keypress", this.resetTimer);
            }

            //set animation delays
            this.line1Life = this.currentMessage.duration
            // //add animation delays dependant on 2nd line of message content
            this.line2Delay = this.currentMessage.out2 || this.joke ? 500 : 0
            this.line2Life = this.currentMessage.out2 || this.joke ? this.currentMessage.duration : 0

            this.running = true
            this.timeoutInitialDelay = setTimeout(this.output, this.currentMessage.initialDelay)
        }
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

        this.running = false
        this.joke = false
    }

    getJokes = async () => {
        this.jokes = await get("api/jokes");
    }

    output = () => {
        // set line messages
        // if no output argument given then reply with joke instead
        if (this.joke === true) {
            const selectedJoke = this.randomItemFromList(this.jokes)
            document.getElementById("lineOne").innerHTML = selectedJoke.setup
            document.getElementById("lineTwo").innerHTML = selectedJoke.punchline
            const selectedJokeIndex = this.jokes.findIndex((joke) => joke === selectedJoke);
            this.jokes.splice(selectedJokeIndex, 1);
            if (this.jokes.length === 0){
                this.getJokes();
            }
        } else {
            document.getElementById("lineOne").innerHTML=this.currentMessage.out1;
            document.getElementById("lineTwo").innerHTML=this.currentMessage.out2;
        }

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

        // reset timer for animation after delay to allow for final animation step if animation is to repeat
        this.timeoutReset = setTimeout(()=>{
            if (this.currentMessage.repeat) {
                this.resetTimer()
             } else {
                if (this.queue.length >= 1){
                    this.startTimer(true)
                }
            }
        }, hideCowTime + 1200);
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
        let interval = this.randomInterval(this.currentMessage.min, this.currentMessage.max);
        this.timeoutMain = setTimeout(this.output, interval);
    }

    // dom manipulation functions for cow animation

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