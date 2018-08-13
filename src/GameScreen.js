import pop from '../pop/'
const { Container } = pop
import Level from './Level'
import Player from './entities/Player'

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
  }
}

export default GameScreen