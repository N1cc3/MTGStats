window.customElements.define(
  'accordion-component',
  class extends HTMLElement {
    connectedCallback() {
      const content = this.innerHTML
      this.innerHTML = null

      this.titleElement = document.createElement('div')
      this.titleElement.className = 'accordion-component-title'
      this.titleElement.innerHTML = this.getAttribute('title')
      this.appendChild(this.titleElement)

      this.contentElement = document.createElement('div')
      this.contentElement.className = 'content'
      this.appendChild(this.contentElement)

      this.contentElement.innerHTML = content
      this.contentElement.style.display = 'none'
      this.addEventListener('click', function () {
        this.toggle()
      })
    }

    static get observedAttributes() {
      return ['open', 'title']
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case 'open':
          if (this.getAttribute('open') != null) this.open()
          else this.close()
          break
        case 'title':
          this.titleElement.innerHTML = newValue
          break
      }
    }

    toggle() {
      if (this.getAttribute('open') != null) {
        this.removeAttribute('open')
        this.close()
      } else {
        this.setAttribute('open', '')
        this.open()
      }
    }

    open() {
      this.querySelector('.content').style.display = 'block'
    }

    close() {
      this.querySelector('.content').style.display = 'none'
    }
  }
)
