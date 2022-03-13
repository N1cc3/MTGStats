window.customElements.define(
  'stat-component',
  class extends HTMLElement {
    connectedCallback() {
      this.init = function (isMobile) {
        window.DRAW.setParent(document.body)
        var COMPUTED_FONT_SIZE = window.getComputedStyle(document.body, null).getPropertyValue('font-size')
        var DRAG_CIRCLE_SIZE = Number(COMPUTED_FONT_SIZE.substring(0, COMPUTED_FONT_SIZE.length - 2)) / 2
        var DRAG_TRIGGER_DISTANCE = Number(COMPUTED_FONT_SIZE.substring(0, COMPUTED_FONT_SIZE.length - 2))

        var CUMULATIVE = this.getAttribute('cumulative')
        this.valueChange = window[this.getAttribute('value-change')]
        if (!this.valueChange) this.valueChange = () => {}

        var diffElement = document.createElement('div')
        diffElement.style.cssText = `
        position: absolute;
        font-size: 0.5em;
        color: yellow;
        z-index: 2;
      `

        this.addEventListener('click', function () {
          var value = Number(this.innerHTML)
          window.playClickSound()
          if (CUMULATIVE) {
            this.innerHTML = value + 1
            this.valueChange(this, 1)
          } else {
            this.innerHTML = value - 1
            this.valueChange(this, -1)
          }
        })

        this.addEventListener(isMobile ? 'touchstart' : 'mousedown', handlePointerDown)

        function handlePointerDown(e) {
          if (!isMobile && e.button != 0) return

          var triggered = false
          var diff = 0
          var anchorAngle
          var startX = this.offsetLeft + this.offsetWidth / 2
          var startY = this.offsetTop + this.offsetHeight / 2
          var startValue = Number(this.innerHTML)
          var source = this

          var pointerX = isMobile ? e.changedTouches.item(0).pageX : e.pageX
          var pointerY = isMobile ? e.changedTouches.item(0).pageY : e.pageY

          window.DRAW.show()
          var line = window.DRAW.createLine('lightblue', 2)
          window.DRAW.modifyLine(line, startX, startY, pointerX, pointerY)
          var circle = window.DRAW.createCircle('lightblue', 2, 'lightblue', 0.2)
          var triggerCircle = window.DRAW.createCircle('darkgrey', 2, '', 0)
          window.DRAW.modifyCircle(triggerCircle, startX, startY, DRAG_TRIGGER_DISTANCE)
          var texts = []
          var textOffsets = [-4, -3, -2, -1, 1, 2, 3, 4]
          if (CUMULATIVE) textOffsets = [1, 2, 3, 4]
          for (var textOffset of textOffsets) {
            texts.push(window.DRAW.createText(textOffset, '6vmin'))
          }

          window.addEventListener(isMobile ? 'touchmove' : 'mousemove', handlePointerMove)

          window.addEventListener(
            isMobile ? 'touchend' : 'mouseup',
            function (e) {
              if (!isMobile && e.button != 0) return

              window.removeEventListener(isMobile ? 'touchmove' : 'mousemove', handlePointerMove)

              window.DRAW.hide()
              if (triggered) {
                document.body.removeChild(diffElement)
                source.valueChange(source, diff)
              }
            },
            { once: true }
          )

          function handlePointerMove(e) {
            var pointerX = isMobile ? e.changedTouches.item(0).pageX : e.pageX
            var pointerY = isMobile ? e.changedTouches.item(0).pageY : e.pageY

            var distance = getDistance(startX, startY, pointerX, pointerY)
            var currentAngle = getAngle(startX, startY, pointerX, pointerY)

            if (!triggered) {
              window.DRAW.modifyLine(line, startX, startY, pointerX, pointerY)
              if (distance > DRAG_TRIGGER_DISTANCE) {
                triggered = true
                anchorAngle = getAngle(startX, startY, pointerX, pointerY)
                currentAngle = anchorAngle
                window.playClickSound()
                triggerCircle.setAttribute('visibility', 'hidden')

                document.body.appendChild(diffElement)
                diffElement.innerHTML = diff
                diffElement.style.color = getColor(-diff)
                diffElement.style.left = pointerX - diffElement.offsetWidth / 2 + 'px'
                diffElement.style.top = pointerY - diffElement.offsetHeight / 2 + 'px'
              } else return
            }
            var lineX = pointerX + DRAG_CIRCLE_SIZE * Math.cos(currentAngle - Math.PI / 2)
            var lineY = pointerY + DRAG_CIRCLE_SIZE * Math.sin(currentAngle + Math.PI / 2)
            window.DRAW.modifyLine(line, startX, startY, lineX, lineY)

            window.DRAW.modifyCircle(circle, startX, startY, distance + DRAG_CIRCLE_SIZE)
            for (var i = 0; i < textOffsets.length; i++) {
              var offsetAngle = angleWrap(textOffsets[i] * DRAG_SENSITIVITY - Math.PI / 2)
              var angle = -angleWrap(anchorAngle + offsetAngle)
              var x = startX - 20 + 0.9 * distance * Math.cos(angle)
              var y = startY + 10 + 0.9 * distance * Math.sin(angle)
              var textContent = CUMULATIVE ? diff + textOffsets[i] : diff - textOffsets[i]
              window.DRAW.modifyText(
                texts[i],
                x,
                y,
                CUMULATIVE ? getColor(-textContent) : getColor(textContent),
                Math.abs(textContent)
              )
            }

            var angleDiff = angleWrap(currentAngle - anchorAngle)
            var snap = Math.floor((angleDiff + DRAG_SENSITIVITY / 2) / DRAG_SENSITIVITY)

            diffElement.style.left = pointerX - diffElement.offsetWidth / 2 + 'px'
            diffElement.style.top = pointerY - diffElement.offsetHeight / 2 + 'px'

            if (snap === 0 || (CUMULATIVE && diff == 0 && snap < 0)) return

            diff += CUMULATIVE ? snap : -snap

            diffElement.style.color = CUMULATIVE ? getColor(-diff) : getColor(diff)
            diffElement.innerHTML = Math.abs(diff)

            anchorAngle = angleWrap(anchorAngle + snap * DRAG_SENSITIVITY)

            window.playClickSound()

            source.innerHTML = startValue + diff
          }
        }
      }
    }
  }
)

const DRAG_SENSITIVITY = -0.6

function getAngle(x1, y1, x2, y2) {
  return Math.atan2(x2 - x1, y2 - y1)
}

function getDistance(x1, y1, x2, y2) {
  var dx = x2 - x1
  var dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

function angleWrap(angle) {
  if (angle > Math.PI) angle -= 2 * Math.PI
  if (angle < -Math.PI) angle += 2 * Math.PI
  return angle
}

function getColor(value) {
  if (value > 0) return 'green'
  else if (value < 0) return 'darkred'
  else return 'yellow'
}
