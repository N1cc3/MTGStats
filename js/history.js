/*jshint esversion: 6 */

var matches = JSON.parse(localStorage.getItem('matches'));

function addMatches(matches) {
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

addMatches(matches);
