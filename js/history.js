/*jshint esversion: 6 */

var matches = JSON.parse(localStorage.getItem('matches'));

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

  var popup = document.createElement('popup-component');
  popup.setAttribute('color', 'rgba(200, 200, 70, 0.8)');
  popup.setAttribute('message', 'History cleared');
  document.body.appendChild(popup);
}
