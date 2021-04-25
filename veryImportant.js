try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
}

catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}

var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';
var micon = false;
var notes = getAllNotes();
renderNotes(notes);

recognition.continuous = false;

speechSynthesis.cancel();
var msg = new SpeechSynthesisUtterance("Press the spacebar once to start recrding your voice and begin begin voice recognition. Press the space bar one more time to stop recording your voice. Press enter to get a response from the bot");
window.speechSyntheses.speak(msg);

recognition.onresult = function(event) (
    
    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript;

    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if(!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
    }
    }

    recognition.onstart = function() {
        instructions.text('Voice recognition activated. Try speaking into the microphone.')
    }

    recognition.onspeechend = function() {
        instructions.text('You were quiet for a while so voice recognition turned itself off.')
    }

    recognition.onerror = function(event) {
        if(event.error == 'no-speech') {
            instructions.text('No speech was detected. Try again.')
        };
    }

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        window.location.href = "index.html";
    }
    else if(event.keyCode == 39) {
        window.location.href = "object.html";
    }
}
});

document.onkeypress = function (space) {
    space = space || window.event;
    if (!micon)
}
