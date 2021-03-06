(function() {
  var sliderComponent = Object.create(HTMLElement.prototype);

  Object.defineProperty(sliderComponent, 'callback', {
    value: '',
    writable: true
  });

  Object.defineProperty(sliderComponent, 'color', {
    value: '',
    writable: true
  });

  var css = `
    slider {
      width: 7.5em;
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

    slider[reset] {
      transition-property: width;
      transition-timing-function: ease-in;
      transition-duration: 0.5s;
    }
  `;

  sliderComponent.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    this.shadowRoot.querySelector('slider').style.backgroundColor = newValue;
  };

  sliderComponent.createdCallback = function() {
    this.style.width = '100%';

    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML =`<style>${css}</style>`;

    var text = this.textContent;
    this.textContent = '';

    var slider = document.createElement('slider');
    slider.textContent = text;
    slider.style.backgroundColor = this.getAttribute('color');
    shadowRoot.appendChild(slider);

    slider.reset = function() {
      slider.setAttribute('reset', '');
      slider.addEventListener('transitionend', function() {
        slider.removeAttribute('reset');
      });
      slider.style.removeProperty('width');
    }

    var callbackName = this.getAttribute('callback');

    // Computer
    slider.addEventListener('mousedown', function(event) {
      if (event.button != 0) return;
      slider.removeAttribute('reset');

      var startX = event.pageX;
      var startWidth = slider.offsetWidth;
      var sliderResetting = false;
      window.addEventListener('mousemove', function(event2) {
        if (sliderResetting) return;
        slider.style.width = Math.max(startWidth, startWidth + (event2.pageX - startX)) + 'px';
        if (slider.offsetWidth >= document.body.offsetWidth) {
          sliderResetting = true;
          slider.reset();
          window[callbackName]();
        }
      }, {passive: true});

      window.addEventListener('mouseup', function(event2) {
        if (event2.button != 0) return;
        sliderResetting = true;
        slider.reset();
      }, {passive: true, once: true});
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
      }, {passive: true});

      window.addEventListener('touchend', function() {
        sliderResetting = true;
        slider.reset();
      }, {passive: true, once: true});
    });
  };

  document.registerElement('slider-component', {prototype: sliderComponent});
}());
