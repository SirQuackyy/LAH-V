const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
      window.location.href="index.html";
  }
  else if(event.keyCode == 39) {
      window.location.href="VoiceToText.html";
  }
});

function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }

  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  
  function enableCam(event) {
    if (!model) {
      return;
    }
    
    event.target.classList.add('removed');  

    const constraints = {
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }

  var children = [];

  function predictWebcam() {
    model.detect(video).then(function (predictions) {
      for (let i = 0; i < children.length; i++) {
        liveView.removeChild(children[i]);
      }
      children.splice(0);
      
      for (let n = 0; n < predictions.length; n++) {
        if (predictions[n].score > 0.66) {
          const p = document.createElement('p');
          p.innerText = predictions[n].class  + ' - with ' 
              + Math.round(parseFloat(predictions[n].score) * 100) 
              + '% confidence.';
          p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
              + (predictions[n].bbox[1] - 10) + 'px; width: ' 
              + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';
  
          const highlighter = document.createElement('div');
          highlighter.style.position = "absolute";
          highlighter.setAttribute('class', 'highlighter');
          highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
              + predictions[n].bbox[1] + 'px; width:' 
              + predictions[n].bbox[2] + 'px; height: '
              + predictions[n].bbox[3] + 'px;';
  
          liveView.appendChild(highlighter);
          liveView.appendChild(p);
          children.push(highlighter);
          children.push(p);
        }
      }
      
      window.requestAnimationFrame(predictWebcam);
    });
  }

speechSynthesis.cancel();
var msg = new SpeechSynthesisUtterance("Please wait for the model to finish loading");
window.speechSynthesis.speak(msg);
  
var model = undefined;
cocoSsd.load().then(function (loadedModel) {
    speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance("The model has finished loading. Put an item in front of the camera to detect it. Press space to tell you the items displayed.");
    window.speechSynthesis.speak(msg);

    model = loadedModel;
    demosSection.classList.remove('invisible');
});

document.onkeypress = function (space) {
  space = space || window.event;
  speechSynthesis.cancel();
  ttsObjects();
};

function ttsObjects(){
  model.detect(video).then(function (predictions) {
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    for (let n = 0; n < predictions.length; n++) {
      if (predictions[n].score > 0.66) {
          var msg = new SpeechSynthesisUtterance(predictions[n].class);
          window.speechSynthesis.speak(msg);
      }
    }
  });
}