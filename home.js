speechSynthesis.cancel();
var msg = new SpeechSynthesisUtterance("Welcome to EyeSee. Please press the right arrow on your keyboard to navigate to an Object Identifier, or use the left arrow to speak to a Speech-Based Chat Bot. To repeat the menu, click the space bar.");
window.speechSynthesis.speak(msg);

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        window.location.href="VoiceToText.html";
    }
    else if(event.keyCode == 39) {
        window.location.href="object.html";
    }
    else if(event.keyCode == 32) {
        window.location.href="index.html";
    }
});