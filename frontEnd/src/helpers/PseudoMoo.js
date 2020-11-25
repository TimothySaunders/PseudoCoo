import confettiCannon from "../helpers/ConfettiCannon";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

class PseudoMoo {

    constructor() {
        this.configureCommands = [{}];
        this.permanentCommands = [{}];
        this.logWhatIsBeingSaid();
    }

    setConfigureCommands(configObjectArray) {
        this.configureCommands = configObjectArray;
    }

    addToCommands(newConfigObject) {
        this.configureCommands.push(newConfigObject);
    }

    addToPermanentCommands(newConfigObject) {
        this.permanentCommands.push(newConfigObject);
    }

    addManyCommands(newConfigArray) {
        this.configureCommands += newConfigArray;
    }
 
    startListeningToStuff() {
        if (!('webkitSpeechRecognition' in window)) {               // Will alert if browser
            alert("Browser does not support Speech recognition");
            return false;   // does not support
        }
        try { // prevent crash should this be called while recording is still taking place.
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.start();
            this.recognition.addEventListener('end', recognition.start); // if recognition stops, start again.
        } catch (error) {
            console.log(error + " You are not the problem, I am.")
        }
        recognition.onstart = function () {                         // verifies voice recognition has started.
            console.log('MooVoice recognition has started')
        }

    }

    stopListeningToStuff() {
        recognition.removeEventListener('end', recognition.start);  // removes reviving recognition
        recognition.stop();                                              // stops recognition
        recognition.onend = function () {                                 // verifies recogiontion stopped
            console.log('MooVoice recognition has ended');
        };
        recognition.continuous = false;
        recognition.interimResults = false;
    }

    logWhatIsBeingSaid() {
        const self = this;
        recognition.onresult = function (event) {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {                     // Verify if the recognized text is the last with the isFinal property
                    console.log(event.results[i][0].transcript);
                    self.actOnCommands(self, event.results[i][0].transcript.trim());
                    return event.results[i][0].transcript;
                }
            }
        }
    }

    actOnCommands(self, RESULT_OF_SPEECH) {
        const runCommands = (command) => {
            if (!command.args) {
                command.args = [];
            }
            if (command.words) {

                const splitWords = RESULT_OF_SPEECH.split(" ")
                splitWords.forEach(word => {
                    if (command.words.includes(word.toLowerCase())) {
                        command.function(...command.args);
                    }
                });
            }
        }
        const baseCommands = [
            { words: ["stop", "quit", "top"], function: this.stopListeningToStuff, args: undefined },
            { words: ["confetti", "bang", "confetti gun", "fetti"], function: confettiCannon, args: undefined }
        ]

        baseCommands.forEach(command => {
            runCommands(command);
            });

        self.configureCommands.forEach(command => {
            runCommands(command);
        });

        self.permanentCommands.forEach(command => {
            runCommands(command);
        });

    }}


const voice = new PseudoMoo();
export default voice;
