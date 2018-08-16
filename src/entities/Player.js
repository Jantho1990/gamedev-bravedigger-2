import pop from '../../pop/'
const { Texture, TileSprite, wallslide } = pop

const texture = new Texture('res/img/bravedigger-tiles.png')

let dbgFirst = true
let dbgCt = 0

class Player extends TileSprite {
  constructor(controls) {
    super(texture, 48, 48)
    this.controls = controls
    this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    }
    this.speed = 210
    this.jumping = true
    this.vel = 0
    this.frame.x = 4
  }

  update(dt, t) {
    const { pos, controls, speed } = this

    const { x } = controls
    const xo = x * dt * speed
    let yo = 0

    if (!this.jumping && controls.action) {
      this.vel = -10
      this.jumping = true
    }

    if (this.jumping) {
      this.vel += 32 * dt
      yo += this.vel
    }

    if (x && !this.jumping) {
      this.frame.x = ((t / 0.1) | 0) % 2
    }

    pos.x += xo
    pos.y += yo
  }
}

export default Player