import pop from '../../pop/'
const { Texture, TileSprite, deadInTracks } = pop

const texture = new Texture('res/img/bravedigger-tiles.png')

class Player extends TileSprite {
  constructor(controls, map) {
    super(texture, 48, 48)
    this.controls = controls
    this.map = map
    this.speed = 210
    this.anchor = { x: 0, y: 0 }
  }

  update(dt, t) {
    const { pos, controls, map, speed } = this

    let { x, y } = controls
    const xo = x * dt * speed
    const yo = y * dt * speed
    const r = deadInTracks(this, map, xo, yo)
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