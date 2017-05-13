/*jshint esversion: 6 */

var DRAW = (function() {
  var SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  SVG.style = 'position: absolute; top: 0; left: 0;';
  SVG.setAttribute('width', '100%');
  SVG.setAttribute('height', '100%');
  SVG.setAttribute('version', '1.1');

  var parent;

  var DRAW = {};

  DRAW.setParent = function(element) {
    parent = element;
  };

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
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', width);
    SVG.appendChild(line);
    return line;
  };

  DRAW.modifyLine = function(line, x1, y1, x2, y2) {
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
  };


  DRAW.createCircle = function(color, width, fill, fillOpacity) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', width);
    circle.setAttribute('fill', fill);
    circle.setAttribute('fill-opacity', fillOpacity);
    SVG.appendChild(circle);
    return circle;
  };

  DRAW.modifyCircle = function(circle, cx, cy, r) {
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
  };


  return DRAW;
})();
