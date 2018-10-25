import pop from '../../pop/'
import physics from '../../pop/utils/physics';
import entity from '../../pop/utils/entity'
import Vec from '../../pop/utils/Vec';
const { Texture, TileSprite, wallslide } = pop

const texture = new Texture('res/img/bravedigger-tiles.png')

const GRAVITY = 2900
const JUMP_FORGIVENESS = 0.08
const JUMP_IMPULSE = 780
const STEER_FORCE = 2000
const MAX_VEL = 300
const MIN_VEL = 200
const FRICTION_GROUND = 1800

let dbgFirst = true
let dbgCt = 0

class Player extends TileSprite {
  constructor(controls, map) {
    super(texture, 48, 48)
    this.controls = controls
    this.map = map
    this.frame.x = 4
    this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    }
    this.anchor = {
      x: 0,
      y: 0
    }
    this.speed = 210
    this.vel = new Vec()
    this.acc = new Vec()

    this.jumpedAt = 0
    this.falling = true
    this.fallingTimer = 0

    this.hp = 5
    this.invincible = 0

    this.dir = -1
  }

  hitBy(e) {
    if (this.invincible > 0) {
      return false
    }
    this.knockback(e)
    this.hp -= 1
    if (this.hp <= 0) {
      this.gameOver = true
    } else {
      this.invincible = 1.0
    }
    return true
  }

  knockback(e) {
    const { vel, acc } = this
    const angle = entity.angle(this, e)
    const power = 400

    vel.set(0, 0)
    acc.set(0, 0)

    const dir = new Vec(Math.cos(angle), -1).multiply(power)
    physics.applyImpulse(this, dir, 1 / 60)
  }

  update(dt, t) {
    const { pos, controls, speed, map, gameOver, vel } = this

    if (gameOver) {
      this.rotation += dt * 5 * this.scale.x
      this.pivot.y = 24 * this.scale.y
      this.pivot.x = 24 * this.scale.x
      return
    }

    const { keys } = controls
    const { x, action } = keys

    if (!this.falling && action) {
      physics.applyImpulse(
        this,
        { x: 0, y: -JUMP_IMPULSE },
        dt
      )
    }

    if (this.falling) {
      physics.applyForce(this, { x: 0, y: GRAVITY })  
    }

    // So you can jump and change direction (even though moving fast)
    const changingDirection = (x > 0 && vel.x < 0) || (x < 0 && vel.x > 0)

    // Instant speed up
    if (x != 0 && Math.abs(vel.x) < MIN_VEL) {
      physics.applyForce(this, { x: x * STEER_FORCE  * 2, y: 0 }, dt)
    } else if (changingDirection || (x && vel.mag() < MAX_VEL)) {
      physics.applyForce(this, { x: x * STEER_FORCE, y: 0 }, dt)
    }

    physics.applyHorizontalFriction(this, FRICTION_GROUND)

    let r = physics.integrate(this, dt)

    // Stop friction when really small (prevents gliding)
    if (vel.mag() <= 10) {
      vel.set(0, 0)
    }
    r = wallslide(this, map, r.x, r.y)
    pos.add(r)

    if (x && !this.falling) {
      this.frame.x = ((t / 100) | 0) % 2
    }

    if (r.hits.down) {
      this.falling = false
      vel.y = 0
    }
    if (r.hits.up) {
      vel.set(0, 0)
    }
    if (r.hits.left || r.hits.right) {
      vel.x = 0
    }

    // Check if falling
    if (!this.falling && !r.hits.down) {
      // check if UNDER current is empty...
      const e = entity.bounds(this)
      const leftFoot = map.pixelToMapPos({ x: e.x, y: e.y + e.h + 1 })
      const rightFoot = map.pixelToMapPos({x: e.x + e.w, y: e.y + e.h + 1 })
      const left = map.tileAtMapPos(leftFoot)
      const right = map.tileAtMapPos(rightFoot)
      if (left.frame.walkable && right.frame.walkable) {
        if (this.fillingTimer <= 0) {
          this.fallingTimer = JUMP_FORGIVENESS
        } else {
          if ((this.fallingTimer -= dt) <= 0) {
            this.falling = true
          }
        }
      }
      /* if (left && right) {
        this.falling = true
      } */
    }

    // Animations
    if ((this.invincible -= dt) > 0) {
      this.alpha = (t * 10 % 2) | 0 ? 0 : 1
      // this.visible = this.alpha > 0 ? 1 : 0
    } else {
      this.alpha = 1
    }

    if (x && !this.jumping) {
      this.frame.x = ((t / 0.1) | 0) % 4
      if (x > 0) {
        this.anchor.x = 0
        this.scale.x = 1
      } else if (x < 0) {
        this.anchor.x = this.w
        this.scale.x = -1
      }
    }
  }
}

export default Player