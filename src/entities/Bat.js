import pop from '../../pop/'
const { Texture, TileSprite, math } = pop

const texture = new Texture('res/img/bravedigger-tiles.png')

class Bat extends TileSprite {
  constructor(findWaypoint) {
    super(texture, 48, 48)
    this.hitBox = {
      x: 6,
      y: 6,
      w: 30,
      h: 26
    }
    this.frame.x = 3 // x location on spritesheet
    this.frame.y = 1 // y location on spritesheet
    this.dir = {
      x: -1,
      y: 0
    }
    this.speed = math.rand(180, 300)
    this.findWaypoint = findWaypoint
    this.waypoint = findWaypoint()
  }

  update(dt, t) {
    const { pos, dir, speed, waypoint } = this

    // Move in the direction of the path
    const xo = waypoint.x - pos.x + 4
    const yo = waypoint.y - pos.y - 1

    const step = speed * dt // amount to move
    const xIsClose = Math.abs(xo) <= step
    const yIsClose = Math.abs(yo) <= step

    if (!xIsClose) {
      pos.x += speed * (xo > 0 ? 1 : -1) * dt // keep going in the same direction, or change if entity overshot the waypoint
    }
    if (!yIsClose) {
      pos.y += speed * (yo > 0 ? 1 : -1) * dt // keep going in the same direction, or change if entity overshot the waypoint
    }

    if (xIsClose && yIsClose) {
      // New waypoint
      this.waypoint = this.findWaypoint()
    }
    pos.y += Math.sin((t + speed) * 10) * speed * dt

    this.frame.x = ((t / 0.1) | 0) % 2 + 3 // animation for bat
  }
}

export default Bat