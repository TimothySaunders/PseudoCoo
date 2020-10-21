import {get} from './requests'

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
            this.resetTimer();
    }

    endTimer(){
        clearTimeout(this.time);
        document.removeEventListener("mousemove", this.resetTimer);
        document.removeEventListener("keypress", this.resetTimer);
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
        const selectedJoke = this.randomItemFromList(this.cowJokes);
        const selectedIndex = this.cowJokes.findIndex((joke) => joke === selectedJoke);
        this.cowJokes.splice(selectedIndex, 1);
        if (this.cowJokes.length === 0){
            this.getCowJokes();
        }
        
        document.getElementById("setup").classList.add("fade-out");
        document.getElementById("punchline").classList.add("fade-out");

        document.getElementById("cow-container").style.bottom="-10px";
        setTimeout(showBubble, 2000)

        function showBubble() {
            document.getElementById("speech-bubble").style.visibility="visible"
            setTimeout(tellSetup, 500)
        }

        function tellSetup(){
            document.getElementById("setup").classList.remove("fade-out");
            document.getElementById("setup").style.visibility="visible"
            document.getElementById("setup").classList.add("fade-in")
            document.getElementById("setup").innerHTML=selectedJoke.setup;
            setTimeout(removeSetup, 3000)
        }

        function removeSetup(){
            document.getElementById("setup").classList.remove("fade-in")
            document.getElementById("setup").classList.add("fade-out")
            setTimeout(tellPunchline, 500)
        }
        
        function tellPunchline(){
            document.getElementById("punchline").style.visibility="hidden"
            document.getElementById("punchline").classList.remove("fade-out");
            document.getElementById("punchline").style.visibility="visible"
            document.getElementById("punchline").classList.add("fade-in")
            document.getElementById("punchline").innerHTML=selectedJoke.punchline;
            setTimeout(removePunchline, 3000)
        }

        function removePunchline(){
            document.getElementById("punchline").classList.remove("fade-in")
            document.getElementById("punchline").classList.add("fade-out")
            setTimeout(removeCow, 500)
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
        setTimeout(showBubble, 2000)

        function showBubble() {
            document.getElementById("speech-bubble").style.visibility="visible"
            setTimeout(tellHint, 500)
        }

        function tellHint() {
            document.getElementById("setup").classList.remove("fade-out");
            document.getElementById("setup").style.visibility="visible"
            document.getElementById("setup").classList.add("fade-in")
            document.getElementById("setup").innerHTML="..... Need a hint?"
            setTimeout(removeSetup, 3000)
        }

        function removeSetup(){
            document.getElementById("setup").classList.remove("fade-in")
            document.getElementById("setup").classList.add("fade-out")
            setTimeout(tellPunchline, 500)
        }

        function tellPunchline(){
            document.getElementById("punchline").style.visibility="hidden"
            document.getElementById("punchline").classList.remove("fade-out");
            document.getElementById("punchline").style.visibility="visible"
            document.getElementById("punchline").classList.add("fade-in")
            document.getElementById("punchline").innerHTML="Just ask!"
            setTimeout(removePunchline, 3000)
        }

        function removePunchline(){
            document.getElementById("punchline").classList.remove("fade-in")
            document.getElementById("punchline").classList.add("fade-out")
            document.getElementById("setup").style.fontSize="1.5em"
            document.getElementById("punchline").style.fontSize="1.5em"
            setTimeout(removeCow, 500)
        }

        function removeCow(){
            document.getElementById("speech-bubble").style.visibility="hidden"
            document.getElementById("cow-container").style.bottom="-600px";
        }
    }

    moo = (out) => {



        document.getElementById("setup").classList.add("fade-out");
        document.getElementById("punchline").classList.add("fade-out");
        if (out.length <= 12){
            document.getElementById("setup").style.fontSize="3em"
        }

        document.getElementById("cow-container").style.bottom="-10px";
        setTimeout(showBubble, 2000)

        function showBubble() {
            document.getElementById("speech-bubble").style.visibility="visible"
            setTimeout(tellHint, 500)
        }

        function tellHint() {
            document.getElementById("setup").classList.remove("fade-out");
            document.getElementById("setup").style.visibility="visible"
            document.getElementById("setup").classList.add("fade-in")
            document.getElementById("setup").innerHTML= out
            setTimeout(removeSetup, 2000)
        }

        function removeSetup(){
            document.getElementById("setup").classList.remove("fade-in")
            document.getElementById("setup").classList.add("fade-out")
            document.getElementById("setup").style.fontSize="1.5em"
            setTimeout(removeCow, 2000)
        }

        function removeCow(){
            document.getElementById("speech-bubble").style.visibility="hidden"
            document.getElementById("cow-container").style.bottom="-1000px";
        }

    }

}