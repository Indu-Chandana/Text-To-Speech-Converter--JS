const textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.querySelector("button");

let synth = speechSynthesis,
isSpeaking = true;

voices(); //chrome is fine. mozilla, not working voice list

function voices(){
    for(let voice of synth.getVoices()) {  //getVoices() method of speechSynthesis returns a list of voice objects of the user current device
        let selected = voice.name === "Google US English" ? "selected" : "";
        // create an option tag with passing voice and voice language
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option); // inserting option tag beforeend of select tag
    }

}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text){
    let utternance = new SpeechSynthesisUtterance(text); //SpeechSynthesisUtterance represents aspeech request
    for(let voice of synth.getVoices()){
        // if the available device voice name is equal to the user selected voice name
        // then set the speech voice to the user selected voice
        if(voice.name === voiceList.value){ // voiceList.value return the selected option value
            utternance.voice = voice;
        }
    }
    synth.speak(utternance) //speechSynthesis is the controller interface for the speech service
    //speak method of speechSynthesis add an utterance to the queue for speak
}

speechBtn.addEventListener("click", e => {
    e.preventDefault();
    if(textarea.value !== "") {
        if(!synth.speaking){ // if an utternance/speech is not currently in the process of speaking
            textToSpeech(textarea.value);
        }
        if(textarea.value.length > 80){
            //if isSpeaking is true then change it's value to false and resume utternance
            // else change it's value to true and pause the speech
            if(isSpeaking){
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech";
            } else {
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech";
            }

            // checking is utternance/speech in speaking process or not in every 100 ms
            // if not then set the value of isSpeaking to true and change the button text
            setInterval(() => {
                if(!synth.speaking && !isSpeaking){
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }
            })
        } else {
            speechBtn.innerText = "Convert To Speech";
        }
    }
});