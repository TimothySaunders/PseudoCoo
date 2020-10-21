import {get} from './requests'

let timeout1;
let timeout2;
let timeout3;
let timeout4;
let timeout5;
let timeout6;
let timeout7;

export default class CowTimer{

    constructor(){
        this.min = 0;
        this.max = 0;
        this.out = "";
        this.cowJokes = [];
        this.time = null;
    }

    startTimer(min, max, out){
        clearTimeout(this.time);
        this.min = min;
        this.max = max;
        this.out = out;
        this.getCowJokes();
        switch (this.out) {
            case "joke":
                this.getCowJokes();
                break;
            case "hint":
                document.addEventListener("mousemove", this.resetTimer);
                document.addEventListener("keypress", this.resetTimer);
                break;
            default:
                break;
        }
        this.output();
    }

    endTimer(){
        clearTimeout(this.time);

        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
        clearTimeout(timeout6);
        clearTimeout(timeout7);

        document.removeEventListener("mousemove", this.resetTimer);
        document.removeEventListener("keypress", this.resetTimer);

        document.getElementById("setup").classList.remove("fade-in")
        document.getElementById("setup").classList.remove("fade-out");
        document.getElementById("setup").style.visibility="hidden"
        document.getElementById("setup").innerHTML=""
        document.getElementById("setup").style.fontSize="1.5em"
        document.getElementById("punchline").classList.remove("fade-in")
        document.getElementById("punchline").classList.remove("fade-out");
        document.getElementById("punchline").style.visibility="hidden"
        document.getElementById("punchline").innerHTML=""
        document.getElementById("punchline").style.fontSize="1.5em"
        document.getElementById("speech-bubble").style.visibility="hidden"
        document.getElementById("cow-container").style.bottom="-600px";
    }

    getCowJokes = async () => {
        this.cowJokes = await get("api/jokes");
    }

    output = () => {
        switch (this.out) {
            case "joke":
                this.tellJoke();
                break;
            case "hint":
                this.tellHint();
                break;
            default:
                this.moo(this.out);
                break;
        }
        this.resetTimer();
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
        clearTimeout(this.time);
        let interval = this.randomInterval(this.min, this.max);
        this.time = setTimeout(this.output, interval);
    }

    // functions for use in output()

    tellJoke = () => {
        timeout7 = setTimeout(()=>{}, 2000)
        const selectedJoke = this.randomItemFromList(this.cowJokes);
        const selectedIndex = this.cowJokes.findIndex((joke) => joke === selectedJoke);
        this.cowJokes.splice(selectedIndex, 1);
        if (this.cowJokes.length === 0){
            this.getCowJokes();
        }
        
        document.getElementById("setup").classList.add("fade-out");
        document.getElementById("punchline").classList.add("fade-out");

        document.getElementById("cow-container").style.bottom="-10px";
        timeout1 = setTimeout(showBubble, 2000)

        function showBubble() {
            document.getElementById("speech-bubble").style.visibility="visible"
            timeout2 = setTimeout(tellSetup, 500)
        }

        function tellSetup(){
            document.getElementById("setup").classList.remove("fade-out");
            document.getElementById("setup").style.visibility="visible"
            document.getElementById("setup").classList.add("fade-in")
            document.getElementById("setup").innerHTML=selectedJoke.setup;
            timeout3 = setTimeout(removeSetup, 3000)
        }

        function removeSetup(){
            document.getElementById("setup").classList.remove("fade-in")
            document.getElementById("setup").classList.add("fade-out")
            timeout4 = setTimeout(tellPunchline, 500)
        }
        
        function tellPunchline(){
            document.getElementById("punchline").style.visibility="hidden"
            document.getElementById("punchline").classList.remove("fade-out");
            document.getElementById("punchline").style.visibility="visible"
            document.getElementById("punchline").classList.add("fade-in")
            document.getElementById("punchline").innerHTML=selectedJoke.punchline;
            timeout5 = setTimeout(removePunchline, 3000)
        }

        function removePunchline(){
            document.getElementById("punchline").classList.remove("fade-in")
            document.getElementById("punchline").classList.add("fade-out")
            timeout6 = setTimeout(removeCow, 500)
        }

        function removeCow(){
            document.getElementById("speech-bubble").style.visibility="hidden"
            document.getElementById("cow-container").style.bottom="-600px";
        }
    }

    tellHint = () => {
        document.getElementById("setup").classList.add("fade-out");
        document.getElementById("punchline").classList.add("fade-out");
        document.getElementById("setup").style.fontSize="2em"
        document.getElementById("punchline").style.fontSize="2em"

        document.getElementById("cow-container").style.bottom="-10px";
        timeout1 = setTimeout(showBubble, 2000)

        function showBubble() {
            document.getElementById("speech-bubble").style.visibility="visible"
            timeout2 = setTimeout(tellHint, 500)
        }

        function tellHint() {
            document.getElementById("setup").classList.remove("fade-out");
            document.getElementById("setup").style.visibility="visible"
            document.getElementById("setup").classList.add("fade-in")
            document.getElementById("setup").innerHTML="..... Need a hint?"
            timeout3 = setTimeout(removeSetup, 3000)
        }

        function removeSetup(){
            document.getElementById("setup").classList.remove("fade-in")
            document.getElementById("setup").classList.add("fade-out")
            timeout4 = setTimeout(tellPunchline, 500)
        }

        function tellPunchline(){
            document.getElementById("punchline").style.visibility="hidden"
            document.getElementById("punchline").classList.remove("fade-out");
            document.getElementById("punchline").style.visibility="visible"
            document.getElementById("punchline").classList.add("fade-in")
            document.getElementById("punchline").innerHTML="Just ask!"
            timeout5 = setTimeout(removePunchline, 3000)
        }

        function removePunchline(){
            document.getElementById("punchline").classList.remove("fade-in")
            document.getElementById("punchline").classList.add("fade-out")
            document.getElementById("setup").style.fontSize="1.5em"
            document.getElementById("punchline").style.fontSize="1.5em"
            timeout6 = setTimeout(removeCow, 500)
        }

        function removeCow(){
            document.getElementById("speech-bubble").style.visibility="hidden"
            document.getElementById("cow-container").style.bottom="-600px";
        }
    }

    moo = (out) => {

        document.getElementById("setup").classList.add("fade-out");
        document.getElementById("punchline").classList.add("fade-out");
        if (out.length <= 14){
            document.getElementById("setup").style.fontSize="3em"
        } else {
            document.getElementById("setup").style.fontSize="1.5em"
        }

        document.getElementById("cow-container").style.bottom="-10px";
        timeout1 = setTimeout(showBubble, 2000)

        function showBubble() {
            document.getElementById("speech-bubble").style.visibility="visible"
            timeout2 = setTimeout(tellHint, 500)
        }

        function tellHint() {
            document.getElementById("setup").classList.remove("fade-out");
            document.getElementById("setup").style.visibility="visible"
            document.getElementById("setup").classList.add("fade-in")
            document.getElementById("setup").innerHTML= out
            timeout3 = setTimeout(removeSetup, 2000)
        }

        function removeSetup(){
            document.getElementById("setup").classList.remove("fade-in")
            document.getElementById("setup").classList.add("fade-out")
            document.getElementById("setup").style.fontSize="1.5em"
            timeout4 = setTimeout(removeCow, 2000)
        }

        function removeCow(){
            document.getElementById("speech-bubble").style.visibility="hidden"
            document.getElementById("cow-container").style.bottom="-1000px";
        }

    }

}