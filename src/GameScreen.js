import pop from '../pop/'
const { Container, entity, math } = pop
import Level from './Level'
import Bat from './entities/Bat'
import Player from './entities/Player'
import Pickup from './entities/Pickup'

class GameScreen extends Container {
  constructor(game, controls) {
    super()
    this.w = game.w
    this.h = game.h
    const map = new Level(game.w, game.h)
    const player = new Player(controls, map)
    player.pos = map.findFreeSpot()

    this.map = this.add(map)
    this.player = this.add(player)

    const bats = this.add(new Container())
    for (let i = 0; i < 5; i++) {
      this.randoBat(bats.add(new Bat()))
    }
    this.bats = this.add(bats)

    this.pickups = this.add(new Container())
    this.populate()
  }

  randoBat(bat) {
    bat.pos.x = this.w * math.randf(1, 2)
    bat.pos.y = math.rand(10) * 32
    bat.speed = math.rand(150, 230)
    return bat
  }

  populate() {
    const { pickups, map } = this
    for (let i = 0; i < 5; i++) {
      const p = pickups.add(new Pickup())
      p.pos = map.findFreeSpot()
    }
  }

  update(dt, t) {
    super.update(dt, t)
    const { bats, player, pickups } = this

    bats.map(bat => {
      if (entity.hit(player, bat)) {
        player.gameOver = true
      }
      if (bat.pos.x < -32) {
        this.randoBat(bat)
      }
    })

    // Collect pickup!
    entity.hits(player, pickups, pickup => {
      pickup.dead = true
      if (pickups.children.length === 1) {
        this.populate()
      }
    })
  }
}

export default GameScreen