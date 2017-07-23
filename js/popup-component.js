(function() {
  var popupComponent = Object.create(HTMLElement.prototype);

  Object.defineProperty(popupComponent, 'color', {
    value: '',
    writable: true
  });

  Object.defineProperty(popupComponent, 'message', {
    value: '',
    writable: true
  });

  var css = `
    @keyframes visible {
      0% { opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }

    popup {
      display: block;
      opacity: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(200, 200, 70, 0.8);
      font-size: 0.5em;
      text-align: center;
      color: #fff;
      border-style: solid;
      border-radius: 0.2em;
      padding: 0.2em;
      animation: visible 2.5s ease;
    }
  `;

  var id = 0;
  popupComponent.createdCallback = function() {
    this.id = `popup-component-${id++}`;

    this.style.cssText = `
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    `;

    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML =`<style>${css}</style>`;

    var popup = document.createElement('popup');
    popup.style.backgroundColor = this.getAttribute('color');
    shadowRoot.appendChild(popup);
  };

  popupComponent.attachedCallback = function() {
    var id = this.id;
    var popup = this.shadowRoot.querySelector('popup');
    popup.addEventListener('animationend', function(e) {
      // Remove itself
      var element = document.getElementById(id);
      element.parentNode.removeChild(element);
    });
  };

  popupComponent.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    switch (attributeName) {
      case 'color':
        this.shadowRoot.querySelector('popup').style.backgroundColor = newValue;
        break;
      case 'message':
        this.shadowRoot.querySelector('popup').textContent = newValue;
        break;
    }
  };

  document.registerElement('popup-component', {prototype: popupComponent});
}());
