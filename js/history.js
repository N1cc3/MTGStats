var debugMatches = [
  {
    redName: "Maick",
    blueName: "Nicce",
    winner: "red"
  }
];

COOKIE.set("matches", debugMatches, 1);

var matches = COOKIE.get("matches");

for (match of matches) {
  addMatch(match);
}

function addMatch(match) {
  var matchesElement = document.getElementById('matches');
  var fragment = 
}
    <div id="matches" class="historyBox">
<div class="match">
  <div class="playerName red winner">
    Nicce
  </div>
  <div class="playerName blue">
    Maick
  </div>
</div>
