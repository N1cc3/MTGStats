var matches = JSON.parse(localStorage.getItem('matches'));

addMatches(matches);

function addMatches(matches) {
  if (matches == null) return;

  var historyBox = document.getElementById('historyBox');

  var matchGroupElements = [];
  var matchGroupIds = [];

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
    var date = new Date(match.millis);
    if (date == 'Invalid Date') date = null;
    var matchGroupId = getDateGroup(match.millis).getTime();
    console.log(matchGroupId);
    var matchGroupElement = matchGroupElements[matchGroupIds.indexOf(matchGroupId)];
    if (matchGroupElement) {
      matchGroupElement.appendChild(matchElement);
    } else {
      matchGroupElement = document.createElement('accordion-component');
      matchGroupElement.setAttribute('id', date != null ? `matchGroup-${date.getTime()}` : 'matchGroup-noDate');
      matchGroupElement.appendChild(matchElement);
      matchGroupElements.push(matchGroupElement);
      matchGroupIds.push(matchGroupId);
    }
  }

  for (var matchGroupElement2 of matchGroupElements) {
    historyBox.appendChild(matchGroupElement2);
    var date2 = new Date(matchGroupIds[matchGroupElements.indexOf(matchGroupElement2)]);
    matchGroupElement2.title = date2 != null ? `${date2.getDate()}.${date2.getMonth() + 1}.${date2.getFullYear()}` : 'No date';
  }
  var lastMatchElement = matchGroupElements[matchGroupElements.length - 1];
  if (lastMatchElement) lastMatchElement.setAttribute('open', '');
}

function getDateGroup(millis) {
  var date = new Date(millis);
  var simpleDate = new Date(0);
  simpleDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  return simpleDate;
}

function clearHistory() { // eslint-disable-line no-unused-vars
  var matchesString = "[]";
  localStorage.setItem('matches', matchesString);

  var matchElements = document.getElementById('historyBox').children;
  while (matchElements.length > 0) {
    matchElements[0].parentNode.removeChild(matchElements[0]);
  }

  var popup = document.createElement('popup-component');
  popup.setAttribute('color', 'rgba(200, 200, 70, 0.8)');
  popup.setAttribute('message', 'History cleared');
  document.body.appendChild(popup);
}
