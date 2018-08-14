import pop from '../../pop/'
const { Texture, TileSprite, wallslide } = pop

const texture = new Texture('res/img/bravedigger-tiles.png')

let dbgFirst = true
let dbgCt = 0

class Player extends TileSprite {
  constructor(controls, map) {
    super(texture, 48, 48)
    this.controls = controls
    this.map = map
    this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    }
    this.speed = 210
    this.anchor = { x: 0, y: 0 }
    this.frame.x = 4
  }

  update(dt, t) {
    const { pos, controls, map, speed, gameOver } = this

    if (gameOver) {
      // TODO: Figure out why moving right prior to death causes this spiral to be exaggerated
      this.anchor.x = 0
      this.pivot.y = 24
      this.pivot.x = 24
      this.rotation += dt * 5
      if (dbgFirst) {
        if (dbgCt++ > 5) dbgFirst = false
        console.log('Anchor:', this.anchor, 'Pivot:', this.pivot, 'Rotation:', this.rotation)
      }
      return
    }

    let { x, y } = controls
    const xo = x * dt * speed
    const yo = y * dt * speed
    const r = wallslide(this, map, xo, yo)
    if (r.x !== 0 && r.y !== 0) {
      r.x /= Math.sqrt(2)
      r.y /= Math.sqrt(2)
    }
    pos.x += r.x
    pos.y += r.y

    // Animate
    if (r.x || r.y) {
      // Walking frames
      this.frame.x = ((t / 0.08) | 0) % 4
      // Walking left or right?
      if (r.x < 0) {
        this.scale.x = -1
        this.anchor.x = 48
      }
      if (r.x > 0) {
        this.scale.x = 1
        this.anchor.x = 0
      }
    } else {
      // Standing still
      this.frame.x = ((t / 0.2) | 0) % 2 + 4
    }
  }
}

export default Player