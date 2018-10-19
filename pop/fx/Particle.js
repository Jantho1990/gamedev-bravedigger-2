import Container from "../Container";
import Vec from "../utils/Vec";
import Rect from "../Rect";
import math from '../utils/math'

class Particle extends Container {
  constructor(display, effects = {}) {
    super(8, 8, { fill: 'hsl(0, 100%, 100%)' })
    this.pos = new Vec()
    this.vel = new Vec()
    this.alpha = this.life = 0
    this.add(display || new Rect(10, 10, { fill: 'hsl(0, 50%, 50%)' }))
    this.effects = effects
  }

  reset() {
    const { effects: { life } } = this

    this.vel.set(math.randf(-5, 5), math.randf(-5, -10))
    this.life = life || math.randf(0.8, 1.5)
    this.pos.set(0, 0)
  }

  update(dt) {
    const { pos, vel, life, effects: { gravity } } = this
    if (life < 0) {
      return
    }
    this.life -= dt

    if (gravity) {
      vel.add({ x: 0, y: gravity * dt })
    }

    pos.add(vel)
    vel.add({ x: 0, y: 30 * dt }) // should be able to set impulse force
    this.alpha = life
  }
}

export default Particle