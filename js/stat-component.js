(function() {
  var statComponent = Object.create(HTMLElement.prototype);

  var DRAG_SENSITIVITY = -0.6;

  Object.defineProperty(statComponent, 'isMobile', {
    value: '',
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
    this.init = function(isMobile) {
      var DRAW = initDraw(document.body);
      var COMPUTED_FONT_SIZE = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
      var DRAG_CIRCLE_SIZE = Number(COMPUTED_FONT_SIZE.substring(0, COMPUTED_FONT_SIZE.length - 2)) / 2;
      var DRAG_TRIGGER_DISTANCE = Number(COMPUTED_FONT_SIZE.substring(0, COMPUTED_FONT_SIZE.length - 2));

      var CUMULATIVE = this.getAttribute('cumulative');
      this.valueChange = window[this.getAttribute('value-change')];
      if (!this.valueChange) this.valueChange = () => {};

      var diffElement = document.createElement('div');
      diffElement.style.cssText = `
        position: absolute;
        font-size: 0.5em;
        color: yellow;
        z-index: 2;
      `;

      this.addEventListener('click', function() {
        var value = Number(this.innerHTML);
        new Audio('mp3/click.mp3').play();
        if (CUMULATIVE) {
          this.innerHTML = value + 1;
          this.valueChange(this, 1);
        } else {
          this.innerHTML = value - 1;
          this.valueChange(this, -1);
        }
      });

      this.addEventListener(isMobile ? 'touchstart' : 'mousedown', handlePointerDown);

      function handlePointerDown(e) {
        if (!isMobile && e.button != 0) return;

        var triggered = false;
        var diff = 0;
        var anchorAngle;
        var startX = this.offsetLeft + this.offsetWidth / 2;
        var startY = this.offsetTop + this.offsetHeight / 2;
        var startValue = Number(this.innerHTML);
        var source = this;

        var pointerX = isMobile ? e.changedTouches.item(0).pageX : e.pageX;
        var pointerY = isMobile ? e.changedTouches.item(0).pageY : e.pageY;

        DRAW.show();
        var line = DRAW.createLine('lightblue', 2);
        DRAW.modifyLine(line, startX, startY, pointerX, pointerY);
        var circle = DRAW.createCircle('lightblue', 2, 'lightblue', 0.2);
        var triggerCircle = DRAW.createCircle('darkgrey', 2, '', 0);
        DRAW.modifyCircle(triggerCircle, startX, startY, DRAG_TRIGGER_DISTANCE);
        var texts = [];
        var textOffsets = [-4, -3, -2, -1, 1, 2, 3, 4];
        if (CUMULATIVE) textOffsets = [1, 2, 3, 4];
        for (var textOffset of textOffsets) {
          texts.push(DRAW.createText(textOffset, '6vmin'));
        }

        window.addEventListener(isMobile ? 'touchmove' : 'mousemove', handlePointerMove);

        window.addEventListener(isMobile ? 'touchend' : 'mouseup', function(e) {
          if (!isMobile && e.button != 0) return;

          window.removeEventListener(isMobile ? 'touchmove' : 'mousemove', handlePointerMove);

          DRAW.hide();
          if (triggered) {
            document.body.removeChild(diffElement);
            source.valueChange(source, diff);
          }
        }, {'once': true});

        function handlePointerMove(e) {
          var pointerX = isMobile ? e.changedTouches.item(0).pageX : e.pageX;
          var pointerY = isMobile ? e.changedTouches.item(0).pageY : e.pageY;

          var distance = getDistance(startX, startY, pointerX, pointerY);
          var currentAngle = getAngle(startX, startY, pointerX, pointerY);

          if (!triggered) {
            DRAW.modifyLine(line, startX, startY, pointerX, pointerY);
            if (distance > DRAG_TRIGGER_DISTANCE) {
              triggered = true;
              anchorAngle = getAngle(startX, startY, pointerX, pointerY);
              currentAngle = anchorAngle;
              new Audio('mp3/click.mp3').play();
              triggerCircle.setAttribute('visibility', 'hidden');

              document.body.appendChild(diffElement);
              diffElement.innerHTML = diff;
              diffElement.style.color = getColor(-diff);
              diffElement.style.left = (pointerX - diffElement.offsetWidth / 2) + 'px';
              diffElement.style.top = (pointerY - diffElement.offsetHeight / 2) + 'px';
            } else return;
          }
          var lineX = pointerX + DRAG_CIRCLE_SIZE * Math.cos(currentAngle - Math.PI / 2);
          var lineY = pointerY + DRAG_CIRCLE_SIZE * Math.sin(currentAngle + Math.PI / 2);
          DRAW.modifyLine(line, startX, startY, lineX, lineY);

          DRAW.modifyCircle(circle, startX, startY, distance + DRAG_CIRCLE_SIZE);
          for (var i = 0; i < textOffsets.length; i++) {
            var offsetAngle = angleWrap(textOffsets[i] * DRAG_SENSITIVITY - Math.PI / 2);
            var angle = -angleWrap(anchorAngle + offsetAngle);
            var x = startX - 20 + 0.9 * distance * Math.cos(angle);
            var y = startY + 10 + 0.9 * distance * Math.sin(angle);
            var textContent = CUMULATIVE ? diff + textOffsets[i] : diff - textOffsets[i];
            DRAW.modifyText(texts[i], x, y, getColor(textContent), Math.abs(textContent));
          }

          var angleDiff = angleWrap(currentAngle - anchorAngle);
          var snap = Math.floor((angleDiff + DRAG_SENSITIVITY / 2) / DRAG_SENSITIVITY);

          diffElement.style.left = (pointerX - diffElement.offsetWidth / 2) + 'px';
          diffElement.style.top = (pointerY - diffElement.offsetHeight / 2) + 'px';

          if (snap === 0 || CUMULATIVE && diff == 0 && snap < 0) return;

          diff += CUMULATIVE ? snap : -snap;

          diffElement.style.color = getColor(diff);
          diffElement.innerHTML = Math.abs(diff);

          anchorAngle = angleWrap(anchorAngle + snap * DRAG_SENSITIVITY);
          new Audio('mp3/click.mp3').play();
          source.innerHTML = startValue + diff;
        }
      }
    }

  }

  statComponent.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    switch (attributeName) {
      case 'value-change':
        this.valueChange = window[newValue];
        if (!this.valueChange) this.valueChange = () => {};
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
    if (angle > Math.PI) angle -= 2 * Math.PI;
    if (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }

  function getColor(value) {
    if (value > 0) return 'green';
    else if (value < 0) return 'darkred';
    else return 'yellow';
  }

  function initDraw(parent) {
    var SVG_URL = 'http://www.w3.org/2000/svg';
    var SVG = document.createElementNS(SVG_URL, 'svg');
    SVG.style = 'position: absolute; top: 0; left: 0; pointer-events: none;';
    SVG.setAttribute('width', '100%');
    SVG.setAttribute('height', '100%');
    SVG.setAttribute('version', '1.1');

    var DRAW = {};

    DRAW.show = function() {
      if (parent) {
        parent.appendChild(SVG);
      } else {
        console.error("Call setParent on DRAW first.");
      }
    };

    DRAW.hide = function() {
      if (parent) {
        if (SVG.parentNode == parent) {
          parent.removeChild(SVG);
        }
        while (SVG.firstChild) {
          SVG.removeChild(SVG.firstChild);
        }
      }
    };

    DRAW.createLine = function(color, width) {
      var line = document.createElementNS(SVG_URL, 'line');
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', width);
      line.setAttribute('visibility', 'hidden');
      SVG.appendChild(line);
      return line;
    };

    DRAW.modifyLine = function(line, x1, y1, x2, y2) {
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('visibility', 'visible');
    };

    DRAW.createCircle = function(color, width, fill, fillOpacity) {
      var circle = document.createElementNS(SVG_URL, 'circle');
      circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-width', width);
      circle.setAttribute('fill', fill);
      circle.setAttribute('fill-opacity', fillOpacity);
      circle.setAttribute('visibility', 'hidden');
      SVG.appendChild(circle);
      return circle;
    };

    DRAW.modifyCircle = function(circle, cx, cy, r) {
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('visibility', 'visible');
    };

    DRAW.createText = function(content, fontSize) {
      var text = document.createElementNS(SVG_URL, 'text');
      text.setAttribute('font-size', fontSize);
      text.textContent = content;
      text.setAttribute('visibility', 'hidden');
      SVG.appendChild(text);
      return text;
    };

    DRAW.modifyText = function(text, x, y, fill, content) {
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('fill', fill);
      text.setAttribute('visibility', 'visible');
      if (content !== null) {
        text.textContent = content;
      }
    };

    return DRAW;
  }

  document.registerElement('stat-component', {prototype: statComponent});
}());
