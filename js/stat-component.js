(function() {
  var statComponent = Object.create(HTMLElement.prototype);

  var DRAG_SENSITIVITY = -0.6;
  var DRAG_TRIGGER_DISTANCE = 100;

  Object.defineProperty(statComponent, 'player', {
    value: 0,
    writable: true
  });

  Object.defineProperty(statComponent, 'mobile', {
    value: false,
    writable: true
  });

  Object.defineProperty(statComponent, 'cumulative', {
    value: false,
    writable: true
  });

  Object.defineProperty(statComponent, 'value-change', {
    value: '',
    writable: true
  });

  statComponent.createdCallback = function() {

    // var PLAYER = this.getAttribute('player');
    // var MOBILE = this.getAttribute('mobile');
    var CUMULATIVE = this.getAttribute('cumulative');
    var VALUE_CHANGE = window[this.getAttribute('value-change')];

    this.addEventListener('click', function() {
      var value = Number(this.innerHTML);
      if (CUMULATIVE) {
        this.innerHTML = value + 1;
        new Audio('mp3/click.mp3').play();
        VALUE_CHANGE(this, 1);
      } else {
        this.innerHTML = value - 1;
        new Audio('mp3/click.mp3').play();
        VALUE_CHANGE(this, -1);
      }
    });

    this.addEventListener('mousedown', function(e) {
      if (e.button != 0) return;

      var triggered = false;
      var valueDiff = 0;
      var anchorAngle;
      var startX = this.offsetLeft + this.offsetWidth / 2;
      var startY = this.offsetTop + this.offsetHeight / 2;
      var startValue = Number(this.innerHTML);
      var source = this;

      window.addEventListener('mousemove', handleMouseMove);

      window.addEventListener('mouseup', function() {
        if (e.button != 0) return;
        window.removeEventListener('mousemove', handleMouseMove);
        if (triggered) {
          VALUE_CHANGE(this, valueDiff);
        }
      }, {'once': true});

      function handleMouseMove(e) {
        var distance = getDistance(startX, startY, e.pageX, e.pageY);
        var currentAngle;

        if (!triggered) {
          if (distance > DRAG_TRIGGER_DISTANCE) {
            triggered = true;
            anchorAngle = getAngle(startX, startY, e.pageX, e.pageY);
            currentAngle = anchorAngle;
            new Audio('mp3/click.mp3').play();
          } else return;
        }

        currentAngle = getAngle(startX, startY, e.pageX, e.pageY);
        var angleDiff = angleWrap(currentAngle - anchorAngle);
        var snap = Math.floor((angleDiff + DRAG_SENSITIVITY / 2) / DRAG_SENSITIVITY);
        if (snap === 0) return;
        if (CUMULATIVE && snap < 0) return;

        valueDiff += snap;
        anchorAngle = angleWrap(anchorAngle + snap * DRAG_SENSITIVITY);
        new Audio('mp3/click.mp3').play();
        source.innerHTML = startValue + valueDiff;
      }
    });

  }

  statComponent.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    switch (attributeName) {
      case 'mobile':
      newValue;
        break;
    }
  };

  function getAngle(x1, y1, x2, y2) {
    return Math.atan2(x2 - x1, y2 - y1);
  }

  function getDistance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
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

  document.registerElement('stat-component', {prototype: statComponent});
}());
