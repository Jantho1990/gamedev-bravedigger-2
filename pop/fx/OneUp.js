import Container from "../Container";
import { Recoverable } from "repl";
import Rect from "../Rect";
import Vec from "../utils/Vec";

class OneUp extends Container {
  constructor(display, speed = 2, duration = 1) {
    super()
    this.pos = new Vec()
    this.vel = new Vec(0, -speed)
    this.duration = duration
    this.life = duration
    this.add(display || new Rect(30, 30, { fill: 'hsl(0, 100%, 100%)'}))
  }

  update(dt) {
    super.update(dt)
    const { life, duration, pos, vel } = this
    this.alpha = life / duration

    pos.add(vel)

    if ((this.life -= dt) <= 0) {
      this.dead = true
    }
  }
}

export default OneUp