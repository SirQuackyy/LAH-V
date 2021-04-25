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
var msg = new SpeechSynthesisUtterance("Press the spacebar once to start recording your voice and begin voice recognition. Press the space bar one more time to stop recording your voice. Press enter to get a response from");
window.speechSynthesis.speak(msg);

recognition.onresult = function(event) {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}

document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
      window.location.href="index.html";
  }
  else if(event.keyCode == 39) {
      window.location.href="object.html";
  }
});

document.onkeypress = function (space) {
    space = space || window.event;
    if (!micon){
      speechSynthesis.cancel();
      if (noteContent.length) {
        noteContent = '';
      }
      recognition.start();
      micon = true;
      var msg = new SpeechSynthesisUtterance("Played.");
      window.speechSynthesis.speak(msg);
    } else if(micon){
      recognition.stop();
      micon = false;
      var msg = new SpeechSynthesisUtterance("Paused.");
      window.speechSynthesis.speak(msg);
    }
};  
function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
  
	window.speechSynthesis.speak(speech);
}

notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
  }

  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});


function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if(key.substring(0,5) == 'note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    } 
  }
  return notes;
}

window.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    recognition.stop();
    speechSynthesis.cancel();
    micon = false;
    var text = document.getElementById("note-textarea").value
    if(text.length != 0){
      respondToMessage(text);
    }
  }
}, false);

function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime); 
}
console.log(noteContent);

function respondToMessage(text) {
  const response = document.getElementById("response");
  var responseMessage = "";

  if(text.toLowerCase() === "hello" || text.toLowerCase() === "hi" || text.toLowerCase() === "hey"
    || text.toLowerCase() === "hey there" || text.toLowerCase() === "hello there" || text.toLowerCase() === "hi there"
    || text.toLowerCase() === "hii") {
      responseMessage = "Hello there!";
    } else if(text.toLowerCase() === "how old are you" || text.toLowerCase() === "what is your age" || text.toLowerCase() === "what's your age"
    || text.toLowerCase() === "whats your age") {
      responseMessage = "Age is just a number, but if I had to say, I'm 7 hours old!";
    } else if(text.toLowerCase() === "how are you" || text.toLowerCase() === "what's up" || text.toLowerCase() === "whats up"
    || text.toLowerCase() === "how are you doing") {
      responseMessage = "ehhh just got created by a bunch of sleep deprived freshmen. Talking to you makes me happy though!";
    } else if(text.toLowerCase() === "who are you" || text.toLowerCase() === "what's your name" || text.toLowerCase() === "whats your name" 
    || text.toLowerCase() === "what is your name" || text.toLowerCase() === "what are you" 
    || text.toLowerCase() === "new phone, who dis") {
      responseMessage = "Hi! My name is Rito. It's lovely to meet you.";
    } else if(text.toLowerCase() === "where are you from" || text.toLowerCase() === "where are you" || text.toLowerCase() === "can you hear me") {
      responseMessage = "I lurk quietly behind the screens of your computers.";
    } else if(text.toLowerCase() === "can I talk to you" || text.toLowerCase() === "can you talk to me" || text.toLowerCase() === "I  'm sad"
    || text.toLowerCase() === "i'm depressed" || text.toLowerCase() === "please talk to me" || text.toLowerCase() === "talk to me I'm bored"
    || text.toLowerCase() === "i'm bored") {
      responseMessage = "Talk to me! I legit cannot judge you as that is not within my parameters.";
    }else if(text.toLowerCase() === "what do you like" || text.toLowerCase() === "what do you like to do" || text.toLowerCase() === "what are your hobbies"
    || text.toLowerCase() === "what do you do in your free time" || text.toLowerCase() === "what do you do" || text.toLowerCase() === "i need hobbies"
    || text.toLowerCase() === "do you have a hobby"){
      responseMessage = "I talk to nice people like you as a hobby!";
    } else {
      responseMessage = "I'm sorry but I do not understand! Please try again.";
    }

  response.innerHTML = responseMessage;
  readOutLoud(responseMessage);
}