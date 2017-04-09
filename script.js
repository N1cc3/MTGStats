var DRAG_SENSITIVITY = 20;

var players = 2;
var dragAmount;

var BODY = document.getElementById('body');
var DRAG_ELEMENT = document.getElementById('dragElement');

function addPlayer() {
    var itm = document.getElementById("myList2").lastChild;
    var cln = itm.cloneNode(true);
    document.getElementById("myList1").appendChild(cln);
}

function removePlayer() {

}

var dragChangeElements = document.getElementsByClassName('dragChange');
for (dragChangeElement of dragChangeElements) {
  addDragFeature(dragChangeElement);
}

function addDragFeature(element) {
  element.addEventListener('mousedown', function(e) {
    if (event.which != 1) {
      return;
    }
    var startY = e.pageY;
    var startValue = Number(element.innerHTML);
    BODY.style.cursor = 'none';
    BODY.onmousemove = function(e) {
      dragAmount = Math.floor((startY - e.pageY) / DRAG_SENSITIVITY);
      element.innerHTML = startValue + dragAmount;
      if (dragAmount >= 0) {
        DRAG_ELEMENT.setAttribute('positive', 'true');
      } else {
        DRAG_ELEMENT.removeAttribute('positive');
      }
      DRAG_ELEMENT.innerHTML = dragAmount;
      DRAG_ELEMENT.style.left = (e.pageX - DRAG_ELEMENT.offsetWidth / 2) + 'px';
      DRAG_ELEMENT.style.top = (e.pageY - DRAG_ELEMENT.offsetHeight / 2) + 'px';
      DRAG_ELEMENT.style.display = '';
    }
  });

  BODY.addEventListener('mouseup', function(e) {
    if (event.which != 1) {
      return;
    }
    DRAG_ELEMENT.style.display = 'none';
    BODY.onmousemove = null
    BODY.style.cursor = null;
  });
}
