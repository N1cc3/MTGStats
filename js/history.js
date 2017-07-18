/*jshint esversion: 6 */

var matches = JSON.parse(localStorage.getItem('matches'));
var BODY = document.getElementById('body');
var SLIDER = document.getElementById('slider');
var CLEARED_NOTIFICATION = document.getElementById('clearedNotification');

addMatches(matches);

function addMatches(matches) {
  if (matches == null) return;

  var historyBox = document.getElementById('historyBox');
  var fragment = document.createDocumentFragment();

  for (var match of matches) {
    var matchElement = document.createElement('div');
    matchElement.className = 'match';
    var players = match.players;
    for (var i = 0; i < players.length; i++) {
      var playerElement = document.createElement('div');
      playerElement.className = 'player';
      playerElement.setAttribute('player', i);
      if (match.winner == i) playerElement.setAttribute('winner', '');
      playerElement.textContent = players[i];
      matchElement.appendChild(playerElement);
    }
    fragment.appendChild(matchElement);
  }

  historyBox.appendChild(fragment);
}

function clearHistory() {
  var matchesString = "[]";
  localStorage.setItem('matches', matchesString);

  var matchElements = document.getElementsByClassName('match');
  for (matchElement of matchElements) {
    matchElement.parentNode.removeChild(matchElement);
  }

  CLEARED_NOTIFICATION.setAttribute('show', '');
  CLEARED_NOTIFICATION.addEventListener('animationend', function(e) {
    CLEARED_NOTIFICATION.removeAttribute('show');
  });
}

function resetSlider() {
  SLIDER.setAttribute('reset', '');
  SLIDER.addEventListener('transitionend', function(e) {
    SLIDER.removeAttribute('reset');
  });
  SLIDER.style.removeProperty('width');
}

SLIDER.addEventListener('mousedown', function(e) {
  if (event.which != 1) {
    return;
  }
  SLIDER.removeAttribute('reset');
  var startX = e.pageX;
  var startWidth = SLIDER.offsetWidth;
  BODY.onmousemove = function(e) {
    SLIDER.style.width = startWidth + (e.pageX - startX) + 'px';
    if (SLIDER.offsetWidth >= BODY.offsetWidth) {
      clearHistory();
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

SLIDER.addEventListener('touchstart', function(e) {
  SLIDER.removeAttribute('reset');
  var startX = e.changedTouches.item(0).pageX;
  var startWidth = SLIDER.offsetWidth;
  registerEventListener(BODY, {
    event: 'touchmove',
    callback: function(e) {
      SLIDER.style.width = startWidth + (e.changedTouches.item(0).pageX - startX) + 'px';
      if (SLIDER.offsetWidth >= BODY.offsetWidth) {
        clearHistory();
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
