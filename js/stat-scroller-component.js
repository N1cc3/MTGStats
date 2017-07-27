(function() {
  var statScrollerComponent = Object.create(HTMLElement.prototype);

  var css = `
    stat {
      display: block;
      font-size: 0.2em;
      text-align: center;
      color: #fff;
    }
  `;

  statScrollerComponent.createdCallback = function() {

    this.style.cssText = `
      width: 0.5em;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    `;

    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML =`<style>${css}</style>`;

    setInterval(function() {
      var stat = document.createElement('stat');
      stat.innerHTML = Math.floor(Math.random() * 100);
      shadowRoot.prepend(stat);
    }, 1000);
  };

  statScrollerComponent.attachedCallback = function() {};

  document.registerElement('stat-scroller-component', {prototype: statScrollerComponent});
}());
