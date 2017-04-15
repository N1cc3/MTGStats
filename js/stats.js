var DRAG_SENSITIVITY = 20;
var BODY = document.getElementById('body');
var DRAG_ELEMENT = document.getElementById('dragElement');
var UNDO_ELEMENT = document.getElementById('undoElement');

var dragAmount;
var undoHistory = [];

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
var IS_MOBILE = window.mobileAndTabletcheck();

function pushUndo(element, amount) {
  undoHistory.push({'element': element, 'amount': amount});
}

function popUndo() {
  var undoObject = undoHistory.pop();
  undoObject.element.innerHTML = undoObject.amount;
  if (undoHistory.length == 0) {
    UNDO_ELEMENT.style.display = 'none';
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
  }
}

var dragChangeElements = document.getElementsByClassName('dragChange');
for (dragChangeElement of dragChangeElements) {
  if (IS_MOBILE) {
    addMobileDragFeature(dragChangeElement);
  } else {
    addDragFeature(dragChangeElement);
  }
}

function addDragFeature(element) {
  element.addEventListener('mousedown', function(e) {
    if (event.which != 1) {
      return;
    }
    var startY = e.pageY;
    var startValue = Number(element.innerHTML);
    pushUndo(element, startValue);
    BODY.style.cursor = 'none';
    DRAG_ELEMENT.style.display = '';
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
	if ( typeof obj._eventListeners == 'undefined' || obj._eventListeners.length == 0 ) {
		return;
	}

	for(var i = 0, len = obj._eventListeners.length; i < len; i++) {
		var e = obj._eventListeners[i];
		obj.removeEventListener(e.event, e.callback);
	}

	obj._eventListeners = [];
}

function addMobileDragFeature(element) {
  element.addEventListener('touchstart', function(e) {
    var startY = e.changedTouches.item(0).pageY;
    var startValue = Number(element.innerHTML);
    pushUndo(element, startValue);
    BODY.style.cursor = 'none';
    DRAG_ELEMENT.style.display = '';
    UNDO_ELEMENT.style.display = 'none';
    registerEventListener(BODY, {
      event: 'touchmove',
      callback: function(e) {
        dragAmount = Math.floor((startY - e.changedTouches.item(0).pageY) / DRAG_SENSITIVITY);
        element.innerHTML = startValue + dragAmount;
        if (dragAmount >= 0) {
          DRAG_ELEMENT.setAttribute('positive', 'true');
        } else {
          DRAG_ELEMENT.removeAttribute('positive');
        }
        DRAG_ELEMENT.innerHTML = dragAmount;
      }
    });
  });

  BODY.addEventListener('touchend', function(e) {
    DRAG_ELEMENT.style.display = 'none';
    if (undoHistory.length == 0) {
      UNDO_ELEMENT.style.display = 'none';
    } else {
      UNDO_ELEMENT.style.display = '';
    }
    BODY.style.cursor = null;
    unRegisterAllEventListeners(BODY);
  });
}

function endGame() {
  var playerNameRed = prompt('Player Red name?', 'Red');
  var playerNameBlue = prompt('Player Blue name?', 'Blue');
  var winner = prompt('Winner?', '0');
  winner = Number(winner);
  var matches = COOKIE.get('matches');
  if (matches == '') {
    matches = '[]';
  }
  matches = JSON.parse(matches);
  matches.push({
    "players": [playerNameRed, playerNameBlue],
    "winner": winner
  });
  var matchesString = JSON.stringify(matches);
  COOKIE.set('matches', matchesString, 1);
}
