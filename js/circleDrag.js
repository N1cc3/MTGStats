var DRAG_SENSITIVITY = 0.5; // Radians per tick

function angleBetween(x1, y1, x2, y2) {
  var dotProduct = x1 * x2 + y1 * y2;
  var len1 = Math.sqrt(x1 * x1 + y1 * y1);
  var len2 = Math.sqrt(x2 * x2 + y2 * y2);
  return dotProduct / (len1 * len2);
}

function addDragFeature(element, linkedElement) {
  element.addEventListener('mousedown', function(e) {
    if (event.which != 1) {
      return;
    }
    var startY = e.pageY;
    var startX = e.pageX;
    var startValue = Number(element.innerHTML);
    pushUndo(element, startValue);

    if (linkedElement != null) {
      var linkedStartValue = Number(linkedElement.innerHTML);
      pushUndo(linkedElement, linkedStartValue);
    }

    BODY.style.cursor = 'none';
    DRAG_ELEMENT.style.display = '';
    DRAG_ELEMENT.innerHTML = dragAmount;
    DRAG_ELEMENT.style.left = (e.pageX - DRAG_ELEMENT.offsetWidth / 2) + 'px';
    DRAG_ELEMENT.style.top = (e.pageY - DRAG_ELEMENT.offsetHeight / 2) + 'px';
    DRAG_ELEMENT.setAttribute('positive', 'true');

    BODY.onmousemove = function(e) {
      dragAmount = Math.floor((startY - e.pageY) / DRAG_SENSITIVITY);
      if (dragAmount != lastDragAmount) new Audio('mp3/click.mp3').play();
      lastDragAmount = dragAmount;
      element.innerHTML = startValue + dragAmount;
      if (linkedElement != null) {
        linkedElement.innerHTML = linkedStartValue - dragAmount;
      }
      if (dragAmount >= 0) {
        DRAG_ELEMENT.setAttribute('positive', '');
      } else {
        DRAG_ELEMENT.removeAttribute('positive');
      }
      DRAG_ELEMENT.innerHTML = dragAmount;
      DRAG_ELEMENT.style.left = (e.pageX - DRAG_ELEMENT.offsetWidth / 2) + 'px';
      DRAG_ELEMENT.style.top = (e.pageY - DRAG_ELEMENT.offsetHeight / 2) + 'px';
    }
  });

  BODY.addEventListener('mouseup', function(e) {
    if (event.which != 1) {
      return;
    }
    DRAG_ELEMENT.style.display = 'none';
    BODY.onmousemove = null
    BODY.style.cursor = null;
    dragAmount = 0;
  });
}
