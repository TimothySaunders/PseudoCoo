const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true;
recognition.start();

VoiceCommands =() => {
    // recognition.abort();
    // recognition.start();
    // recognition.continous =true;
    console.log("inVoiceCommands")
    recognition.onstart = () => {
        console.log("voice recog initialised");
    }
    recognition.onresult = (e) => {
        console.log("onresult")
        let current = e.resultIndex;

        let transcript = e.results[current][0].transcript;
        let adjusted = (current === 1 && transcript === e.results[0[0].transcript])

        if (!adjusted) {
            if (transcript === 'load' || transcript === ' load') {
                this.setState({ viewOption: "SavedGames" })
            }

            if (this.contains(transcript, ['back','reset'])  ) {
                console.log("reset called")
                this.reset();
                this.setState({ viewOption: "mainMenu" })   
            }
            if (transcript === 'play' || transcript === ' play') {
                this.setState({ viewOption: "DifficultyMenu" })
            }

            if (this.state.viewOption==="DifficultyMenu") {
                if (this.contains(transcript, ['laughing','coo', 'cow'])  ) {
                    const generatedString = sudoku.sudoku.generate("easy", true);
                    this.creategameStringFromDifficulty(generatedString)
                }
                // if (transcript.includes('skimmed','milk')  ) {
                if (this.contains(transcript, ['skimmed','milk'])  ) {
                    const generatedString = sudoku.sudoku.generate("medium", true);
                    this.creategameStringFromDifficulty(generatedString)
                }
                if (this.contains(transcript, ['mooodium','rare','moodium','medium','mooooodium'])  ) {
                    const generatedString = sudoku.sudoku.generate("hard", true);
                    this.creategameStringFromDifficulty(generatedString)
                }
                if (this.contains(transcript, ['difficult','uterly','udder','udderly','elderly'])  ) {
                    const generatedString = sudoku.sudoku.generate("very-hard", true);
                    this.creategameStringFromDifficulty(generatedString)
                }
                if (this.contains(transcript, ['mad','madcow'])  ) {
                    const generatedString = sudoku.sudoku.generate("insane", true);
                    this.creategameStringFromDifficulty(generatedString)
                }
                if (this.contains(transcript, ['holy',' holy'])  ) {
                    const generatedString = sudoku.sudoku.generate("inhuman", true);
                    this.creategameStringFromDifficulty(generatedString)
                }
                
            }

            setTimeout(() => {
                recognition.start();
            }, 50);

            console.log(transcript);
        }
        this.getSaveGames();
    }
}