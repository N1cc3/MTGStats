(function() {
  var sliderBox = Object.create(HTMLElement.prototype);

  Object.defineProperty(sliderBox, 'callback', {
    value: '',
    writable: true
  });

  sliderBox.createdCallback = function() {
    var text = this.textContent;
    this.textContent = '';

    var slider = document.createElement('div');
    slider.textContent = text;
    this.appendChild(slider);

    slider.resetSlider = function() {
      slider.setAttribute('reset', '');
      slider.addEventListener('transitionend', function(e) {
        slider.removeAttribute('reset');
      });
      slider.style.removeProperty('width');
    }

    slider.addEventListener('mousedown', function(e) {
      if (event.which != 1) {
        return;
      }
      slider.removeAttribute('reset');
      var startX = e.pageX;
      var startWidth = slider.offsetWidth;
      document.body.onmousemove = function(e) {
        slider.style.width = startWidth + (e.pageX - startX) + 'px';
        if (slider.offsetWidth >= document.body.offsetWidth) {

          // callback
          window[e.srcElement.parentElement.getAttribute('callback')]();

          slider.resetSlider();
          document.body.onmousemove = null;
        }
      };

      document.body.addEventListener('mouseup', function(e) {
        if (event.which != 1) {
          return;
        }
        document.body.onmousemove = null;
        slider.resetSlider();
      });

      document.body.addEventListener('mouseleave', function(e) {
        document.body.onmousemove = null;
        slider.resetSlider();
      });
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
