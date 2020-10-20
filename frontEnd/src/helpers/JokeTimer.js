import {get} from './requests'

export default function JokeTimer(min, max, output){

    let time;
    let cowJokes = [];
    getCowJokes();
    window.onload = resetTimer;

    async function getCowJokes() {
        cowJokes = await get("api/jokes");
    }

    function output() {
        const selectedJoke = randomItemFromList(cowJokes);
        const selectedIndex = cowJokes.findIndex((joke) => joke === selectedJoke);
        cowJokes.splice(selectedIndex,1);
        if (cowJokes.length === 1){
            getCowJokes();
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
            document.getElementById("cow-container").style.bottom="-1000px";
        }
        

        resetTimer();
    }
    
    function randomInterval(min, max) {
        return 1000 * Math.floor(min + (Math.random()*(max-min)));
    }

    function randomItemFromList(list) {
        const index = Math.floor((Math.random()*(list.length)));
        return list[index];
    }

    function resetTimer() {
        clearTimeout(time);
        let interval = randomInterval(min, max);
        time = setTimeout(output, interval);
    }

    function tellJoke(){
        
    }



}