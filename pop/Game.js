import Container from './Container'
import CanvasRenderer from './renderer/CanvasRenderer'

const STEP = 1 / 60
const MAX_FRAME = STEP * 5
const MULTIPLIER = 1
const SPEED = STEP * MULTIPLIER

class Game {
  constructor(w, h, parent = "#board") {
    this.w = w
    this.h = h
    this.renderer = new CanvasRenderer(w, h)
    document.querySelector(parent).appendChild(this.renderer.view)
    this.scene = new Container()
  }

  run(gameUpdate = () => {}) {
    let dt = 0
    let last = 0
    const loop = ms => {
      requestAnimationFrame(loop)

      const t = ms / 1000 // Convert to seconds
      dt += Math.min(t - last, MAX_FRAME)
      last = t

      while (dt >= STEP) {
        this.scene.update(STEP, t / MULTIPLIER)
        gameUpdate(STEP, t / MULTIPLIER)
        dt -= SPEED
      }
      this.renderer.render(this.scene)
    }
    const init = ms => {
      last = ms / 1000
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(init)
  }
}

export default Game