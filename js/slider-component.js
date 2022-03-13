window.customElements.define(
  'slider-component',
  class extends HTMLElement {
    connectedCallback() {
      this.style.width = '100%'

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = `<style>${this.css()}</style>`

      requestAnimationFrame(() => {
        const slider = document.createElement('slider')
        slider.textContent = this.textContent
        this.textContent = ''
        slider.style.backgroundColor = this.getAttribute('color')
        this.shadowRoot.appendChild(slider)

        slider.reset = function () {
          slider.setAttribute('reset', '')
          slider.addEventListener('transitionend', function () {
            slider.removeAttribute('reset')
          })
          slider.style.removeProperty('width')
        }

        const callbackName = this.getAttribute('callback')

        // Computer
        slider.addEventListener('mousedown', function (event) {
          if (event.button != 0) return
          slider.removeAttribute('reset')

          const startX = event.pageX
          const startWidth = slider.offsetWidth
          let sliderResetting = false
          window.addEventListener(
            'mousemove',
            function (event2) {
              if (sliderResetting) return
              slider.style.width = Math.max(startWidth, startWidth + (event2.pageX - startX)) + 'px'
              if (slider.offsetWidth >= document.body.offsetWidth) {
                sliderResetting = true
                slider.reset()
                window[callbackName]()
              }
            },
            { passive: true }
          )

          window.addEventListener(
            'mouseup',
            function (event2) {
              if (event2.button != 0) return
              sliderResetting = true
              slider.reset()
            },
            { passive: true, once: true }
          )
        })

        // Mobile
        slider.addEventListener('touchstart', function (e) {
          slider.removeAttribute('reset')

          const startX = e.changedTouches.item(0).pageX
          const startWidth = slider.offsetWidth
          let sliderResetting = false
          window.addEventListener(
            'touchmove',
            function (e) {
              if (sliderResetting) return
              slider.style.width = Math.max(startWidth, startWidth + (e.changedTouches.item(0).pageX - startX)) + 'px'
              if (slider.offsetWidth >= document.body.offsetWidth) {
                sliderResetting = true
                slider.reset()
                window[callbackName]()
              }
            },
            { passive: true }
          )

          window.addEventListener(
            'touchend',
            function () {
              sliderResetting = true
              slider.reset()
            },
            { passive: true, once: true }
          )
        })
      })
    }

    static get observedAttributes() {
      return ['color']
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case 'color':
          this.shadowRoot.querySelector('slider').style.backgroundColor = newValue
          break
      }
    }

    css() {
      return `
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
      `
    }
  }
)
