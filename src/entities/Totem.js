import pop from '../../pop/'
const { entity, Texture, TileSprite, math, State } = pop
import Bullet from './Bullet'

const texture = new Texture('res/img/bravedigger-tiles.png')

const states = {
  IDLE: 0,
  WINDUP: 1
}

class Totem extends TileSprite {
  constructor(target, onFire) {
    super(texture, 48, 48)
    this.type = 'Totem'
    this.frame.x = 2
    this.frame.y = 1 // the y coor on the spritesheet
    this.target = target
    this.onFire = onFire
    this.fireIn = 0
    this.state = new State(states.IDLE)
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
    const { state, frame, target } = this

    let distance
    switch (state.get()) {
      case states.IDLE:
        distance = entity.distance(target, this)
        frame.x = distance < 300 ? 1 : 2
        if ((distance < 300) && math.randOneIn(200)) {
          state.set(states.WINDUP)
        }
        break
      
      case states.WINDUP:
        frame.x = [0, 1][((t / 0.1) | 0) % 2]
        if (state.time > 1) {
          this.fireAtTarget()
          state.set(states.IDLE)
        }
        break
    }

    state.update(dt)
  }
}

export default Totem