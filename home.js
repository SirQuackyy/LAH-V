speechSynthesis.cancel();
var msg = new SpeechSynthesisUtterance("Welcome to EyeWire. Please click the right arrow to navigate to an Object Identifier, and use the left arrow to speak to a Speech-Based Chat Bot. To repeat the menu, click the space bar.");
window.speechSynthesis.speak(msg);

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        window.location.href="";
    }
    else if(event.keyCode == 39) {
        window.location.href="object.html";
    }
    else if(event.keyCode == 32) {
        window.location.href="home.html";
    }
});