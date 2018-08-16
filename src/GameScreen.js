import pop from '../pop/'
const { Camera, Container, entity, State, Text } = pop
import LevelMap from './Level'
import Player from './entities/Player'
import Pickup from './entities/Pickup'
import Bat from './entities/Bat'
import Totem from './entities/Totem'
import { stat } from 'fs';

const states = {
  READY: 0,
  PLAYING: 1,
  GAMEOVER: 2
}

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    const { READY } = states
    super()
    this.w = game.w
    this.h = game.h
    this.controls = controls
    this.onGameOver = onGameOver
    this.state = new State(READY)

    // Map, player, camera
    const map = new LevelMap(game.w, game.h)
    const player = new Player(controls, map)
    player.pos.x = map.spawns.player.x
    player.pos.y = map.spawns.player.y

    const camera = new Camera(
      player,
      { w: game.w, h: game.h },
      { w: map.w, h: map.h }
    )
    this.camera = this.add(camera)
    this.map = camera.add(map)
    this.pickups = camera.add(new Container())
    this.player = camera.add(player)

    // Bats
    const bats = new Container()
    map.spawns.bats.forEach(({ x, y }) => {
      const bat = bats.add(new Bat(player))
      bat.pos.x = x
      bat.pos.y = y
    })
    this.bats = camera.add(bats)

    // Totems
    map.spawns.totems.forEach(({ x, y }) => {
      const t = camera.add(new Totem(player, b => bats.add(b)))
      t.pos.x = x
      t.pos.y = y
    })

    // Pickups
    this.populate()

    // Score
    this.score = 0
    this.scoreText = this.add(
      new Text('0', {
        font: '40pt "Luckiest Guy", sans-serif',
        fill: 'hsl(0, 100%, 100%)',
        align: 'center'
      })
    )
    this.scoreText.pos = { x: game.w / 2, y: game.h / 2 - 40 }
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
    const { READY, PLAYING, GAMEOVER } = states

    switch (state.get()) {
      case READY:
        if (state.first) {
          this.scoreText.text = 'GET READY'
        }
        if (state.time > 2) {
          this.scoreText.text = '0'
          state.set(PLAYING)
        }
        break
      case PLAYING:
        super.update(dt, t)
        this.updatePlaying()
        break
      case GAMEOVER:
        if (state.first) {
          player.gameOver = true
        }
        super.update(dt, t)

        // Wait for space bar to restart
        if (player.gameOver && controls.action) {
          this.onGameOver()
        }
        break
    }

    state.update(dt)
  }

  updatePlaying() {
    const { bats, player, pickups, state } = this
    const { GAMEOVER } = states
    bats.map(bat => {
      if (entity.hit(player, bat)) {
        state.set(GAMEOVER)
      }
    })

    // Collect pickup
    entity.hits(player, pickups, p => {
      p.dead = true
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