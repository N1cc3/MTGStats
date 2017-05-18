/*jshint esversion: 6 */

var DRAG_SENSITIVITY = -0.6;
var DRAG_TRIGGER_DISTANCE = 100;
var DRAG_CIRCLE_SIZE = 30;
var BODY = document.getElementById('body');
var DRAG_ELEMENT = document.getElementById('dragElement');
var UNDO_ELEMENT = document.getElementById('undoElement');
var ENDGAME_ELEMENT = document.getElementById('endgameElement');
var PLAYERS = document.getElementById('meta_players').getAttribute('content');
var PLAYERCOLORS = ['red', 'blue', 'teal', 'orange'];
var LOW_HEALTH = 10;

var dragAmount = 0;
var lastDragAmount = 0;
var undoHistory = [];
var endGameTriggered = false;

DRAW.setParent(BODY);

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
var IS_MOBILE = window.mobileAndTabletcheck();

if (IS_MOBILE) {
  document.ontouchmove = function(event) {
    event.preventDefault();
  };
}

function pushUndo(element, amount) {
  undoHistory.push({'element': element, 'amount': amount});
}

function popUndo() {
  var undoObject = undoHistory.pop();
  if (undoObject) {
    undoObject.element.innerHTML = undoObject.amount;
    if (undoHistory.length === 0) {
      UNDO_ELEMENT.style.display = 'none';
    }
  }
}

if (IS_MOBILE) {
  UNDO_ELEMENT.addEventListener('touchstart', function(e) {
    popUndo();
  });
} else {
  document.onkeydown = function(e) {
    var evtobj = window.event? event : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) popUndo();
    if (evtobj.keyCode == 13) endGame();
  };
}

function lowHealth(lifeElement) {
  var health = Number(lifeElement.innerHTML);
  if (health <= LOW_HEALTH) {
    lifeElement.setAttribute('lowHealth', 'true');
  } else {
    lifeElement.removeAttribute('lowHealth');
  }
}

function getAngle(x1, y1, x2, y2) {
  return Math.atan2(x2 - x1, y2 - y1);
}

function angleWrap(angle) {
  if (angle > Math.PI) {
    angle -= 2 * Math.PI;
  }
  if (angle < -Math.PI) {
    angle += 2 * Math.PI;
  }
  return angle;
}

function getDistance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function setColorByValue(element, value) {
  if (value > 0) {
    element.classList.add("positive");
  } else {
    element.classList.remove("positive");
  }
  if (value < 0) {
    element.classList.add("negative");
  } else {
    element.classList.remove("negative");
  }
}

//////////////////////////
// DRAGCHANGE ELEMENTS  //
//////////////////////////

var dragChangeElements = document.getElementsByClassName('dragChange');
for (var dragChangeElement of dragChangeElements) {
  var lifeElement = null;
  var invert = 1;
  if (dragChangeElement.classList.contains('commanderDmg')) {
    lifeElement = dragChangeElement.parentElement.parentElement.children[0].children[1];
  }
  if (dragChangeElement.classList.contains('life')) {
    invert = -1;
  }
  if (IS_MOBILE) {
    addMobileDragFeature(dragChangeElement, lifeElement);
  } else {
    addDragFeature(dragChangeElement, lifeElement, invert);
  }
}

function addDragFeature(element, linkedElement, invert) {
  element.addEventListener('mousedown', function(e) {
    if (event.which != 1) {
      return;
    }
    var triggered = false;
    var startAngle;
    var startX = element.offsetLeft + element.offsetWidth / 2;
    var startY = element.offsetTop + element.offsetHeight / 2;
    var startValue = Number(element.innerHTML);
    pushUndo(element, startValue);

    if (linkedElement !== null) {
      var linkedStartValue = Number(linkedElement.innerHTML);
      pushUndo(linkedElement, linkedStartValue);
    }

    BODY.style.cursor = 'none';

    DRAW.show();
    var line = DRAW.createLine('lightblue', 2);
    DRAW.modifyLine(line, startX, startY, e.pageX, e.pageY);
    var circle = DRAW.createCircle('lightblue', 2, 'lightblue', 0.2);

    var texts = [];
    var textOffsets = [-4, -3, -2, -1, 1, 2, 3, 4];
    for (var textOffset of textOffsets) {
      texts.push(DRAW.createText(textOffset, 40));
    }

    BODY.onmousemove = function(e) {

      var distance = getDistance(startX, startY, e.pageX, e.pageY);
      var currentAngle = getAngle(startX, startY, e.pageX, e.pageY);

      var lineX = e.pageX + DRAG_CIRCLE_SIZE * Math.cos(currentAngle - Math.PI / 2);
      var lineY = e.pageY + DRAG_CIRCLE_SIZE * Math.sin(currentAngle + Math.PI / 2);
      DRAW.modifyLine(line, startX, startY, lineX, lineY);

      if (!triggered) {
        if (distance > DRAG_TRIGGER_DISTANCE) {
          triggered = true;
          startAngle = getAngle(startX, startY, e.pageX, e.pageY);
          DRAG_ELEMENT.style.display = '';
          DRAG_ELEMENT.innerHTML = dragAmount;
          DRAG_ELEMENT.style.left = (e.pageX - DRAG_ELEMENT.offsetWidth / 2) + 'px';
          DRAG_ELEMENT.style.top = (e.pageY - DRAG_ELEMENT.offsetHeight / 2) + 'px';
          DRAG_ELEMENT.setAttribute('positive', 'true');
          new Audio('mp3/click.mp3').play();
        } else {
          return;
        }
      }


      DRAW.modifyCircle(circle, startX, startY, distance + DRAG_CIRCLE_SIZE);
      for (var i = 0; i < textOffsets.length; i++) {
        var offsetAngle = angleWrap(textOffsets[i] * DRAG_SENSITIVITY - Math.PI / 2);
        var angle = -angleWrap(startAngle + offsetAngle);
        var x = startX - 20 + 0.8 * distance * Math.cos(angle);
        var y = startY + 10 + 0.8 * distance * Math.sin(angle);
        DRAW.modifyText(texts[i], x, y, Math.abs(dragAmount + invert * textOffsets[i]));
      }

      var angleDiff = angleWrap(currentAngle - startAngle);
      dragAmount += invert * Math.floor((angleDiff + DRAG_SENSITIVITY / 2) / DRAG_SENSITIVITY);

      if (dragAmount != lastDragAmount) {
        if (dragAmount > lastDragAmount) {
          startAngle = angleWrap(startAngle + invert * DRAG_SENSITIVITY);
        } else {
          startAngle = angleWrap(startAngle - invert * DRAG_SENSITIVITY);
        }
        lastDragAmount = dragAmount;
        new Audio('mp3/click.mp3').play();
      }

      element.innerHTML = startValue + dragAmount;
      if (linkedElement !== null) {
        linkedElement.innerHTML = linkedStartValue - dragAmount;
      }

      setColorByValue(DRAG_ELEMENT, dragAmount);
      DRAG_ELEMENT.innerHTML = Math.abs(dragAmount);
      DRAG_ELEMENT.style.left = (e.pageX - DRAG_ELEMENT.offsetWidth / 2) + 'px';
      DRAG_ELEMENT.style.top = (e.pageY - DRAG_ELEMENT.offsetHeight / 2) + 'px';

    };
  });
}

var lifeElements = document.getElementsByClassName("life");
BODY.addEventListener('mouseup', function(e) {
  if (event.which != 1) {
    return;
  }
  for (var lifeElement of lifeElements) {
    lowHealth(lifeElement);
  }
  DRAW.hide();
  DRAG_ELEMENT.style.display = 'none';
  BODY.onmousemove = null;
  BODY.style.cursor = null;
  dragAmount = 0;
  lastDragAmount = 0;
});

function registerEventListener(obj, params) {
	if ( typeof obj._eventListeners == 'undefined' ) {
		obj._eventListeners = [];
	}

	obj.addEventListener(params.event, params.callback);

	var eventListeners = obj._eventListeners;
	eventListeners.push(params);
	obj._eventListeners = eventListeners;
}
function unRegisterAllEventListeners(obj) {
	if ( typeof obj._eventListeners == 'undefined' || obj._eventListeners.length === 0 ) {
		return;
	}

	for(var i = 0, len = obj._eventListeners.length; i < len; i++) {
		var e = obj._eventListeners[i];
		obj.removeEventListener(e.event, e.callback);
	}

	obj._eventListeners = [];
}

function addMobileDragFeature(element, linkedElement) {
  element.addEventListener('touchstart', function(e) {
    var startY = e.changedTouches.item(0).pageY;
    var startValue = Number(element.innerHTML);
    pushUndo(element, startValue);

    if (linkedElement !== null) {
      var linkedStartValue = Number(linkedElement.innerHTML);
      pushUndo(linkedElement, linkedStartValue);
    }

    BODY.style.cursor = 'none';
    DRAG_ELEMENT.style.display = '';
    UNDO_ELEMENT.style.display = 'none';
    registerEventListener(BODY, {
      event: 'touchmove',
      callback: function(e) {
        dragAmount = Math.floor((startY - e.changedTouches.item(0).pageY) / DRAG_SENSITIVITY);
        if (dragAmount != lastDragAmount) new Audio('mp3/click.mp3').play();
        lastDragAmount = dragAmount;
        element.innerHTML = startValue + dragAmount;
        if (linkedElement !== null) {
          linkedElement.innerHTML = linkedStartValue - dragAmount;
        }
        if (dragAmount >= 0) {
          DRAG_ELEMENT.setAttribute('positive', '');
        } else {
          DRAG_ELEMENT.removeAttribute('positive');
        }
        DRAG_ELEMENT.innerHTML = dragAmount;
      }
    });
  });

  BODY.addEventListener('touchend', function(e) {
    if (element.classList.contains('life')) {
      lowHealth(element);
    }
    DRAG_ELEMENT.style.display = 'none';
    if (undoHistory.length === 0) {
      UNDO_ELEMENT.style.display = 'none';
    } else {
      UNDO_ELEMENT.style.display = '';
    }
    BODY.style.cursor = null;
    unRegisterAllEventListeners(BODY);
  });
}

//////////////////////////
//    ENDGAME SLIDER    //
//////////////////////////

function endGame() {
  if (endGameTriggered === true) {
    return;
  }
  endGameTriggered = true;
  var playerNames = [];
  for (var i = 0; i < PLAYERS; i++) {
    playerNames[i] = prompt('Player ' + PLAYERCOLORS[i] + ' name?', PLAYERCOLORS[i]);
    if (playerNames[i] === null) {
      endGameTriggered = false;
      return;
    }
  }
  var winner = prompt('Winner? (0-' + (PLAYERS - 1) + ')', '0');
  if (winner === null) return;
  winner = Number(winner);
  var matches = COOKIE.get('matches');
  if (matches === '') {
    matches = '[]';
  }
  matches = JSON.parse(matches);
  matches.push({
    "players": playerNames,
    "winner": winner
  });
  var matchesString = JSON.stringify(matches);
  COOKIE.set('matches', matchesString, 1);
  window.location.href = 'history.html';
}

function resetSlider() {
    ENDGAME_ELEMENT.setAttribute('reset', '');
    ENDGAME_ELEMENT.addEventListener('transitionend', function(e) {
      ENDGAME_ELEMENT.removeAttribute('reset');
    });
    ENDGAME_ELEMENT.style.removeProperty('width');
}

ENDGAME_ELEMENT.addEventListener('mousedown', function(e) {
  if (event.which != 1) {
    return;
  }
  ENDGAME_ELEMENT.removeAttribute('reset');
  var startX = e.pageX;
  var startWidth = ENDGAME_ELEMENT.offsetWidth;
  BODY.onmousemove = function(e) {
    ENDGAME_ELEMENT.style.width = startWidth + (e.pageX - startX) + 'px';
    if (ENDGAME_ELEMENT.offsetWidth >= BODY.offsetWidth) {
      endGame();
      resetSlider();
      BODY.onmousemove = null;
    }
  };

  BODY.addEventListener('mouseup', function(e) {
    if (event.which != 1) {
      return;
    }
    BODY.onmousemove = null;
    resetSlider();
  });
});

ENDGAME_ELEMENT.addEventListener('touchstart', function(e) {
  ENDGAME_ELEMENT.removeAttribute('reset');
  var startX = e.changedTouches.item(0).pageX;
  var startWidth = ENDGAME_ELEMENT.offsetWidth;
  registerEventListener(BODY, {
    event: 'touchmove',
    callback: function(e) {
      ENDGAME_ELEMENT.style.width = startWidth + (e.changedTouches.item(0).pageX - startX) + 'px';
      if (ENDGAME_ELEMENT.offsetWidth >= BODY.offsetWidth) {
        endGame();
        resetSlider();
        unRegisterAllEventListeners(BODY);
      }
    }
  });

  BODY.addEventListener('touchend', function(e) {
    resetSlider();
    unRegisterAllEventListeners(BODY);
  });
});
