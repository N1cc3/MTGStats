/*jshint esversion: 6 */

var matches = JSON.parse(localStorage.getItem('matches'));
var BODY = document.getElementById('body');
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
