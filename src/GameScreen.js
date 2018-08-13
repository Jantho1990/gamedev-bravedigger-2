import pop from '../pop/'
const { Container, entity } = pop
import Level from './Level'
import Player from './entities/Player'
import Pickup from './entities/Pickup'

class GameScreen extends Container {
  constructor(game, controls) {
    super()
    this.w = game.w
    this.h = game.h
    const map = new Level(game.w, game.h)
    const player = new Player(controls, map)
    player.pos.x = 48
    player.pos.y = 48

    this.map = this.add(map)
    this.player = this.add(player)
    this.pickups = this.add(new Container())
    this.populate()
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
    const { player, pickups } = this
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