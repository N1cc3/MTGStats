(function() {
  var sliderBox = Object.create(HTMLElement.prototype);

  Object.defineProperty(sliderBox, 'callback', {
    value: '',
    writable: true
  });

  Object.defineProperty(sliderBox, 'color', {
    value: '',
    writable: true
  });

  sliderBox.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    this.children[0].backgroundColor = newValue;
  };

  sliderBox.createdCallback = function() {
    var text = this.textContent;
    this.textContent = '';

    var slider = document.createElement('div');
    slider.textContent = text;
    slider.style.backgroundColor = this.getAttribute('color');
    this.appendChild(slider);

    slider.reset = function() {
      slider.setAttribute('reset', '');
      slider.addEventListener('transitionend', function(e) {
        slider.removeAttribute('reset');
      });
      slider.style.removeProperty('width');
    }

    var callbackName = this.getAttribute('callback');

    // Computer
    slider.addEventListener('mousedown', function(e) {
      if (event.which != 1) return;
      slider.removeAttribute('reset');

      var startX = e.pageX;
      var startWidth = slider.offsetWidth;
      var sliderResetting = false;
      window.addEventListener('mousemove', function(e) {
        if (sliderResetting) return;
        slider.style.width = Math.max(startWidth, startWidth + (e.pageX - startX)) + 'px';
        if (slider.offsetWidth >= document.body.offsetWidth) {
          sliderResetting = true;
          slider.reset();
          window[callbackName]();
        }
      });

      window.addEventListener('mouseup', function(e) {
        if (event.which != 1) return;
        sliderResetting = true;
        slider.reset();
      }, {once: true});
    });

    // Mobile
    slider.addEventListener('touchstart', function(e) {
      slider.removeAttribute('reset');

      var startX = e.changedTouches.item(0).pageX;
      var startWidth = slider.offsetWidth;
      var sliderResetting = false;
      window.addEventListener('touchmove', function(e) {
        if (sliderResetting) return;
        slider.style.width = Math.max(startWidth, startWidth + (e.changedTouches.item(0).pageX - startX)) + 'px';
        if (slider.offsetWidth >= document.body.offsetWidth) {
          sliderResetting = true;
          slider.reset();
          window[callbackName]();
        }
      });

      window.addEventListener('touchend', function(e) {
        sliderResetting = true;
        slider.reset();
      }, {once: true});
    });
  };

  var css = `
    slider-component {
      width: 100%;
    }

    slider-component > div {
      width: 7em;
      float: left;
      text-align: right;
      font-size: 0.2em;
      font-style: italic;
      white-space: nowrap;
      padding: 0.2em;
      border-radius: 0.4em;
      color: white;
      background-color: rgba(70, 200, 200, 0.8);
      cursor: ew-resize;
      user-select: none;
    }

    slider-component > div[reset] {
      transition-property: width;
      transition-timing-function: ease-in;
      transition-duration: 0.5s;
    }
  `;
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var sliderBoxElement = document.registerElement('slider-component', {prototype: sliderBox});
}());
