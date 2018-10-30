import Container from './Container'
import CanvasRenderer from './renderer/CanvasRenderer'
import Assets from './Assets'

const STEP = 1 / 60
const MAX_FRAME = STEP * 5
let MULTIPLIER = 1
let SPEED = STEP * MULTIPLIER

class Game {
  constructor(w, h, parent = "#board") {
    this.w = w
    this.h = h
    this.renderer = new CanvasRenderer(w, h)
    document.querySelector(parent).appendChild(this.renderer.view)
    this.scene = new Container()

    this.fadeTime = 0
    this.fadeDuration = 0
  }

  setScene(scene, duration = 0.5) {
    if (!duration) {
      this.scene = scene
      return
    }
    this.destination = scene
    this.fadeTime = duration
    this.fadeDuration = duration
  }

  run(gameUpdate = () => {}) {
    Assets.onReady(() => {
      let dt = 0
      let last = 0
      const loop = ms => {
        const { scene, renderer, fadeTime } = this
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

        // Screen transition
        if (fadeTime > 0) {
          const { fadeDuration, destination } = this
          const ratio = fadeTime / fadeDuration
          this.scene.alpha = ratio
          destination.alpha = 1 - ratio
          renderer.render(destination, false)
          if ((this.fadeTime -= STEP) <= 0) {
            this.scene = destination
            this.destination = null
          }
        }
      }
      const init = ms => {
        last = ms / 1000
        requestAnimationFrame(loop)
      }
      requestAnimationFrame(init)
    })
  }

  get speed() {
    return MULTIPLIER
  }

  set speed(speed) {
    MULTIPLIER = speed
    SPEED = STEP * MULTIPLIER
  }
}

export default Game