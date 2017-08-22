(function() {
  var accordionComponent = Object.create(HTMLElement.prototype);

  var content;

  accordionComponent.attachedCallback = function() {
    content = this.innerHTML;
    this.innerHTML = null;

    this.titleElement = document.createElement('div');
    this.titleElement.className = 'accordion-component-title';
    this.titleElement.innerHTML = this.getAttribute('title');
    this.appendChild(this.titleElement);

    this.contentElement = document.createElement('div');
    this.contentElement.className = 'content';
    this.appendChild(this.contentElement);

    this.contentElement.innerHTML = content;
    this.contentElement.style.display = 'none';
    this.addEventListener('click', function() {
      this.toggle();
    });
  };

  accordionComponent.attributeChangedCallback = function(attributeName, oldValue, newValue) {
    switch (attributeName) {
      case 'open':
        if (this.getAttribute('open') != null) {
          this.open();
        } else {
          this.close();
        }
        break;
      case 'title':
        this.titleElement.innerHTML = newValue;
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
    this.querySelector('.content').style.display = 'block';
  }

  accordionComponent.close = function() {
    this.querySelector('.content').style.display = 'none';
  }

  document.registerElement('accordion-component', {prototype: accordionComponent});
}());
