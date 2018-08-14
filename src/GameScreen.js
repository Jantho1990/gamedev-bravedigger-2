import pop from '../pop/'
const { Container, entity, math, State, Text } = pop
import Level from './Level'
import Bat from './entities/Bat'
import Player from './entities/Player'
import Pickup from './entities/Pickup'
import Totem from './entities/Totem'

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super()
    this.w = game.w
    this.h = game.h
    this.controls = controls
    this.onGameOver = onGameOver
    const map = new Level(game.w, game.h)
    const player = new Player(controls, map)
    player.pos = map.findFreeSpot()
    player.pos.y -= 1

    this.state = new State('READY')

    this.map = this.add(map)
    this.player = this.add(player)
    this.pickups = this.add(new Container())

    const baddies = new Container()
    for (let i = 0; i < 3; i++) {
      this.randoBat(baddies.add(new Bat(player)))
    }
    this.baddies = this.add(baddies)

    // Add some totems
    for (let i = 0; i < 2; i++) {
      const t = this.add(new Totem(player, b => baddies.add(b)))
      const { x, y } = map.findFreeSpot(false) // not free
      t.pos.x = x
      t.pos.y = y
    }

    this.populate()
    this.score = 0
    this.scoreText = this.add(
      new Text('0', {
        font: '40pt "Luckiest Guy", sans-serif',
        fill: 'hsl(0, 100%, 100%)',
        align: 'center'
      })
    )
    this.scoreText.pos = { x: game.w / 2, y: 180 }
  }

  randoBat(bat) {
    const { w, h } = this
    const angle = math.randf(Math.PI * 2)
    bat.pos.x = Math.cos(angle) * 300 + w / 2
    bat.pos.y = Math.sin(angle) * 300 + h / 2
    bat.speed = math.rand(100, 150)
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
    const { controls, player, state } = this

    switch (state.get()) {
      case 'READY':
        if (state.first) {
          this.scoreText.text = 'GET READY'
        }
        if (state.time > 2) {
          this.scoreText.text = '0'
          state.set('PLAYING')
        }
        break
      
      case 'PLAYING':
        super.update(dt, t)
        this.updatePlaying()
        break
      
      case 'GAME OVER':
        if (state.first) {
          player.gameOver = true
          this.scoreText.text = `DEAD. Score: ${this.score}`
        }
        if (this.controls.action) {
          this.onGameOver()
        }
        super.update(dt, t)
    }

    state.update(dt)
  }

  updatePlaying() {
    const { baddies, player, pickups, state } = this

    baddies.map(baddie => {
      if (entity.hit(player, baddie)) {
        state.set('GAME OVER')
        baddie.dead = true
      }
    })

    // Collect pickup!
    entity.hits(player, pickups, pickup => {
      pickup.dead = true
      this.score++
      if (pickups.children.length === 1) {
        this.populate()
        this.score += 5
      }
      this.scoreText.text = this.score
    })
  }
}

export default GameScreen