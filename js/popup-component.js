let popupCount = 0

window.customElements.define(
  'popup-component',
  class extends HTMLElement {
    connectedCallback() {
      this.id = `popup-component-${popupCount++}`

      this.style.cssText = `
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      `

      var shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = `<style>${this.css()}</style>`

      var popup = document.createElement('popup')
      popup.style.backgroundColor = this.getAttribute('color')
      shadowRoot.appendChild(popup)

      popup.addEventListener('animationend', function () {
        // Remove itself
        var element = document.getElementById(this.id)
        element.parentNode.removeChild(element)
      })
    }

    static get observedAttributes() {
      return ['color', 'message']
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case 'color':
          this.shadowRoot.querySelector('popup').style.backgroundColor = newValue
          break
        case 'message':
          this.shadowRoot.querySelector('popup').textContent = newValue
          break
      }
    }

    css() {
      return `
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
      `
    }
  }
)
