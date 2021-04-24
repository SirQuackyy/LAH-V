function moveSelection(evt) {
    element = document.getElementById("base");
    switch (evt.keyCode) {
      case 65:
        element.style.left = (parseInt(element.style.left) - 10) + 'px';
        break;
      case 68:
        element.style.left = (parseInt(element.style.left) + 10) + 'px';
        break;
      case 87:
        element.style.top = (parseInt(element.style.top) - 10) + 'px';
        break;
      case 83:
        element.style.top = (parseInt(element.style.top) + 10) + 'px';
        break;
    }
    element = document.getElementById("base2");
    switch (evt.keyCode) {
      case 37:
        element.style.left = (parseInt(element.style.left) - 10) + 'px';
        break;
      case 39:
        element.style.left = (parseInt(element.style.left) + 10) + 'px';
        break;
      case 38:
        element.style.top = (parseInt(element.style.top) - 10) + 'px';
        break;
      case 40:
        element.style.top = (parseInt(element.style.top) + 10) + 'px';
        break;
    }
  }
  window.addEventListener('keydown', moveSelection);