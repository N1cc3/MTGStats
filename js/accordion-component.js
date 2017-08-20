(function() {
  var accordionComponent = Object.create(HTMLElement.prototype);

  Object.defineProperty(accordionComponent, 'open', {
    value: '',
    writable: true
  });

  Object.defineProperty(accordionComponent, 'title', {
    value: '',
    writable: true
  });

  var css = `
    .title {
      color: white;
    }

    .content {
      display: none;
    }
  `;

  accordionComponent.createdCallback = function() {
    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML =`<style>${css}</style>`;

    this.titleElement = document.createElement('div');
    this.titleElement.className = 'title';
    this.titleElement.innerHTML = this.getAttribute('title');
    shadowRoot.appendChild(this.titleElement);

    this.contentElement = document.createElement('div');
    this.contentElement.className = 'content';
    shadowRoot.appendChild(this.contentElement);
  };

  accordionComponent.attachedCallback = function() {
    this.contentElement.innerHTML = this.innerHTML;
    this.innerHTML = null;
    this.addEventListener('click', function() {
      this.toggle();
    });
  };

  accordionComponent.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    switch (attributeName) {
      case 'open':
        newValue;
        break;
      case 'title':
        newValue;
        break;
    }
  };

  accordionComponent.toggle = function() {
    if (this.getAttribute('open') != null) {
      this.removeAttribute('open');
      this.close();
    } else {
      this.setAttribute('open', '');
      this.open();
    }
  }

  accordionComponent.open = function() {
    this.shadowRoot.querySelector('.content').style.display = 'block';
  }

  accordionComponent.close = function() {
    this.shadowRoot.querySelector('.content').style.display = 'none';
  }

  document.registerElement('accordion-component', {prototype: accordionComponent});
}());