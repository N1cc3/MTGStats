var UNDO_ELEMENT = document.getElementById('undoElement');
var STAT_SCROLLER = document.getElementById('statScroller');
var PLAYERS = document.getElementById('meta_players').getAttribute('content');
var LOW_HEALTH = 10;

var undoHistory = [];
var endGameTriggered = false;

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

if (IS_MOBILE) {
  UNDO_ELEMENT.addEventListener('touchstart', function() {
    popUndo();
  });
} else {
  document.onkeydown = function(e) {
    var evtobj = window.event? event : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) popUndo();
    if (evtobj.keyCode == 13) {
      e.preventDefault();
      endGame();
    }
  };
}

for (var statElement of document.getElementsByTagName('stat-component')) {
  statElement.init(IS_MOBILE);
  statElement.setAttribute('value-change', 'valueChange');
}

for (var crownElement of document.getElementsByClassName('crown')) {
  crownElement.addEventListener('click', crownClick);
}

function valueChange(element, diff) { // eslint-disable-line no-unused-vars
  if (diff == 0) return;
  lowHealth(element);
  var amount = Math.abs(diff);
  var player = element.getAttribute('player');
  var commander = element.getAttribute('commander');
  if (commander != null) {
    var lifeElement = document.querySelector(`.life[player="${player}"]`);
    lifeElement.innerHTML = Number(lifeElement.innerHTML) - diff;
    STAT_SCROLLER.addStat(player, amount, '', commander);
    pushUndo([
      element,
      lifeElement
    ], [
      Number(element.innerHTML) - diff,
      Number(lifeElement.innerHTML) + diff
    ]);
  } else if (element.classList.contains('infect')) {
    STAT_SCROLLER.addStat(player, amount, 'infect');
    pushUndo([element], [Number(element.innerHTML) - diff]);
  } else {
    var type = (diff > 0) ? 'heal' : '';
    STAT_SCROLLER.addStat(player, amount, type);
    pushUndo([element], [Number(element.innerHTML) - diff]);
  }
}

function pushUndo(elements, amounts) {
  undoHistory.push({'elements': elements, 'amounts': amounts});
  if (IS_MOBILE) {
    UNDO_ELEMENT.style.display = '';
  }
}

function popUndo() {
  var undoObject = undoHistory.pop();
  if (undoObject) {
    for (var i = 0; i < undoObject.elements.length; i++) {
      undoObject.elements[i].innerHTML = undoObject.amounts[i];
      lowHealth(undoObject.elements[i]);
    }
    if (undoHistory.length === 0) {
      UNDO_ELEMENT.style.display = 'none';
    }
    STAT_SCROLLER.removeStat();
  }
}

function lowHealth(lifeElement) {
  var health = Number(lifeElement.innerHTML);
  if (health <= LOW_HEALTH) {
    lifeElement.setAttribute('lowHealth', 'true');
  } else {
    lifeElement.removeAttribute('lowHealth');
  }
}

function endGame() {
  if (endGameTriggered === true) {
    return;
  }
  endGameTriggered = true;

  var endGameCurtain = document.getElementById('curtain');
  endGameCurtain.style.display = '';
  for (var form of document.getElementsByClassName('playerForm')) {
    form.style.display = '';
  }


  document.addEventListener('keydown', submit);

  function submit(e) {
    if (e.code != 'Enter') return;

    document.removeEventListener('keydown', submit);

    var winner;
    for (var crownElement of document.getElementsByClassName('crown')) {
      if (crownElement.getAttribute('value') == 'true') winner = Number(crownElement.getAttribute('player'));
    }

    var playerNames = [];
    for (var i = 0; i < PLAYERS; i++) {
      var nameField = document.querySelector(`.nameField[player='${i}']`);
      var name = nameField.value;
      playerNames.push(name);
    }

    var matches = localStorage.getItem('matches');
    if (matches === null) {
      matches = '[]';
    }
    matches = JSON.parse(matches);
    matches.push({
      "players": playerNames,
      "winner": winner
    });
    var matchesString = JSON.stringify(matches);
    localStorage.setItem('matches', matchesString);
    window.location.href = 'history.html';
  }
}

function crownClick(e) { // eslint-disable-line no-unused-vars
  var crownElement = e.srcElement;
  if (crownElement.getAttribute('value')) {
    crownElement.setAttribute('value', '');
  } else {
    for (var otherCrown of document.getElementsByClassName('crown')) {
      otherCrown.setAttribute('value', '');
    }
    crownElement.setAttribute('value', 'true');
  }
  new Audio('mp3/click.mp3').play();
}
