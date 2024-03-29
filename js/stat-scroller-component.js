window.customElements.define(
  'stat-scroller-component',
  class extends HTMLElement {
    connectedCallback() {
      var shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = `<style>${this.css()}</style>`

      var statContainer = document.createElement('stat-container')
      shadowRoot.prepend(statContainer)

      this.addStat = function (player, amount, type, commander) {
        var stat = document.createElement('stat')
        stat.innerHTML = amount

        if (commander) {
          stat.innerHTML += `<commanderDmg player="${commander}"> C</commanderDmg>`
        }
        if (type == 'heal') stat.setAttribute('heal', '')
        if (type == 'infect') stat.setAttribute('infect', '')
        stat.setAttribute('player', player)
        statContainer.prepend(stat)
      }

      this.removeStat = function () {
        if (statContainer.children[0]) statContainer.removeChild(statContainer.children[0])
      }
    }

    css() {
      return `
        stat-container {
          width: 0.5em;
          height: 50%;
          transform: translateY(50%);
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          overflow: hidden;
      
          border-style: solid;
          border-color: white;
          border-width: 0.01em;
          border-radius: 0.2em;
          background-color: rgba(0, 0, 0, 0.5);
          margin-left: 0.1em;
          padding-top: 0.02em;
        }
      
        stat {
          display: block;
          font-size: 0.2em;
          text-align: center;
          color: red;
          font-weight: bold;
          text-shadow: 0.05em 0.05em 0.02em black;
        }
      
        stat[heal] {
          color: lightgreen;
        }
      
        stat[infect] {
          color: darkgreen;
        }
      
        stat[player='0'] {
          background: radial-gradient(rgba(255, 0, 0, 0.5) 0%, rgba(255, 0, 0, 0.4) 40%, rgba(255, 0, 0, 0) 70%);
        }
      
        stat[player='1'] {
          background: radial-gradient(rgba(0, 0, 255, 0.5) 0%, rgba(0, 0, 255, 0.4) 40%, rgba(0, 0, 255, 0) 70%);
        }
      
        stat[player='2'] {
          background: radial-gradient(rgba(0, 255, 255, 0.5) 0%, rgba(0, 255, 255, 0.4) 40%, rgba(0, 255, 255, 0) 70%);
        }
      
        stat[player='3'] {
          background: radial-gradient(rgba(255, 165, 0, 0.5) 0%, rgba(255, 165, 0, 0.4) 40%, rgba(255, 165, 0, 0) 70%);
        }
      
        commanderDmg[player='0'] {
          color: rgb(255, 0, 0);
        }
      
        commanderDmg[player='1'] {
          color: rgb(0, 0, 255);
        }
      
        commanderDmg[player='2'] {
          color: rgb(0, 255, 255);
        }
      
        commanderDmg[player='3'] {
          color: rgb(255, 165, 0);
        }
      `
    }
  }
)
