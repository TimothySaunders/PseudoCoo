// Voice/ Moo recognition 
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

export default class PseudoMoo {
    

}
// Start the listening and keeping the microphone ON + prevent crash should this be called when recording is still taking place.
PseudoMoo.prototype.startListening = function () {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Unable to use the Speech Recognition API");  
    }
    
    try {
        recognition.start();
        recognition.addEventListener('end', recognition.start);
    } catch (error) {
        console.log(error + " Only one Moo at once")
    }
    
}

PseudoMoo.prototype.stopListening = function () {
    recognition.stop();
    recognition.removeEventListener('end', recognition.start);
}


