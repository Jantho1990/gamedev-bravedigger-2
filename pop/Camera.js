import Container from './Container'
import math from './utils/math'
import Vec from './utils/Vec';

class Camera extends Container {
  constructor(subject, viewport, worldSize = viewport) {
    super()
    this.pos = new Vec()
    this.w = viewport.w
    this.h = viewport.h
    this.worldSize = worldSize

    this.shakePower = 0
    this.shakeDecay = 0
    this.shakeLast = new Vec()

    this.setSubject(subject)
  }

  setSubject(e) {
    this.subject = e ? e.pos || e : this.pos
    this.offset = { x: 0, y: 0 }

    // Center on the entity
    if (e && e.w) {
      this.offset.x += e.w / 2
      this.offset.y += e.h / 2
    }
    if (e && e.anchor) {
      this.offset.x -= e.anchor.x
      this.offset.y -= e.anchor.y
    }
    this.focus()
  }

  shake(power = 8, duration = 0.5) {
    this.shakePower = power
    this.shakeDecay = power / duration
  }

  _shake(dt) {
    const { pos, shakePower, shakeLast } = this
    if (shakePower <= 0) {
      shakeLast.set(0, 0)
      return
    }
    shakeLast.set(
      math.randf(-shakePower, shakePower),
      math.randf(-shakePower, shakePower)
    )

    pos.add(shakeLast)
    this.shakePower -= this.shakeDecay * dt
  }

  _unShake() {
    const { pos, shakeLast } = this
    pos.subtract(shakeLast)
  }

  focus() {
    const { pos, w, h, worldSize, subject, offset } = this

    const centeredX = subject.x + offset.x - w / 2
    const maxX = worldSize.w - w
    const x = -math.clamp(centeredX, 0, maxX)

    const centeredY = subject.y + offset.y - h / 2
    const maxY = worldSize.h - h
    const y = -math.clamp(centeredY, 0, maxY)

    pos.x = x
    pos.y = y
  }

  update(dt, t) {
    super.update(dt, t)
    this._unShake()
    if (this.subject) {
      this.focus()
    }
    this._shake(dt)
  }
}

export default Camera
