import pop from '../../pop/'
const { entity, Texture, TileSprite, math } = pop
import Bullet from './Bullet'

const texture = new Texture('res/img/bravedigger-tiles.png')

class Totem extends TileSprite {
  constructor(target, onFire) {
    super(texture, 48, 48)
    this.type = 'Totem'
    this.frame.x = 2
    this.frame.y = 1 // the y coor on the spritesheet
    this.target = target
    this.onFire = onFire
    this.fireIn = 0
  }

  fireAtTarget() {
    const { target, onFire } = this
    const totemPos = entity.center(this)
    
    const aim = entity.aim(target, this)
    const bullet = new Bullet(aim, 300)
    bullet.pos.x = totemPos.x - bullet.w / 2
    bullet.pos.y = totemPos.y - bullet.h / 2

    onFire(bullet)
  }

  update(dt, t) {
    if (math.randOneIn(250)) {
      this.fireIn = 1
    }
    if (this.fireIn > 0) {
      this.fireIn -= dt // dt = 1, delta, current step
      // Telegraph to the player
      this.frame.x = [1, 0][((t / 0.1) | 0) % 2]
      if (this.fireIn < 0) {
        this.fireAtTarget()
      }
    }
  }
}

export default Totem