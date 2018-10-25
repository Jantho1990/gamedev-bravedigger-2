import pop from '../../pop'
const { Camera, Container, entity, State, Text } = pop
import LevelMap from '../Level'
import Player from '../entities/Player'
import Pickup from '../entities/Pickup'
import Bat from '../entities/Bat'
import Totem from '../entities/Totem'
import { stat } from 'fs';
import Vec from '../../pop/utils/Vec';
import TileSprite from '../../pop/TileSprite';
import OneUp from '../../pop/fx/OneUp';
import Texture from '../../pop/Texture';
import Timer from '../../pop/Timer';
import ParticleEmitter from '../../pop/fx/ParticleEmitter';

const texture = new Texture("res/img/bravedigger-tiles.png")

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
    this.game = game
    this.controls = controls
    this.onGameOver = onGameOver
    this.state = new State(READY)

    this.time = 0

    // Dummy code
    /* const vec = new Vec(5, 0)
    console.log(vec.mag())
    vec.multiply(2)
    console.log(vec.mag()) */

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
    this.fx = camera.add(new Container())

    // Bats
    const baddies = new Container()
    map.spawns.bats.forEach(spawn => {
      const bat = baddies.add(new Bat(player))
      bat.pos.copy(spawn)
    })
    this.baddies = camera.add(baddies)

    // Totems
    map.spawns.totems.forEach(({ x, y }) => {
      const t = camera.add(new Totem(player, b => baddies.add(b)))
      t.pos.x = x
      t.pos.y = y
    })

    // Pickups
    this.populate()

    // Heart Particles
    const p = new TileSprite(texture, 48, 48)
    p.scale.x = 0.4
    p.scale.y = 0.4
    p.frame.x = 6
    p.frame.y = 2

    this.pe = this.fx.add(new ParticleEmitter(25, p, { life: 2 }))

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

  playerWasHit(baddie) {
    const { player, pe, game, camera } = this

    if (player.hitBy(baddie)) {
      pe.play(entity.center(player))

      if (player.gameOver) {
        this.state.set(states.GAMEOVER)
      }

      camera.shake(9)
    }

    switch (baddie.type) {
      case 'Bullet':
        baddie.dead = true
        break;
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
        this.updatePlaying(dt)
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

  gotPickup(pickup) {
    const { camera, pickups, player } = this
    this.score++
    pickup.dead = true

    camera.shake(100)
    camera.flash()

    // Make coin to OneUp
    const coin = new TileSprite(texture, 48, 48)
    coin.anims.add('spin', [5, 6, 7, 8].map(x => ({ x, y: 4 })), 0.1)
    coin.anims.play('spin')
    // OneUp it!
    const one = this.add(new OneUp(coin))
    one.pos.copy(player.pos)

    if (pickups.children.length === 1) {
      camera.shake(16, 3)
      camera.flash()
      this.populate()
      this.score += 5

      // Coin Particles
      this.ce = this.fx.add(new ParticleEmitter(this.score, coin, { life: 2, gravity: -20 }))
      this.ce.play(player.pos)

      // spawn one coin for each score point
      /* for (let i = 0; i < this.score; i++) {
        this.add(new Timer(0.1, null, () => {
          const newCoin = this.add(new OneUp(coin))
          newCoin.pos.copy(player.pos)
          console.log('one upped', i)
          alert('stop')
        }, i * 0.1))
      } */
    }

    this.scoreText.text = this.score
  }

  updatePlaying(dt) {
    const { baddies, player, pickups, pe, game, state } = this
    const { GAMEOVER } = states
    baddies.map(b => {
      if (entity.hit(player, b)) {
        this.playerWasHit(b)
        // pe.play(entity.center(player))
        //state.set(GAMEOVER)
      }
    })

    /* this.time += dt
    game.speed = Math.max(0.8, game.speed + Math.sin(this.time / 0.3) * 0.05)
    this.scoreText.text = game.speed.toFixed(2) */

    // Collect pickup
    entity.hits(player, pickups, pickup => this.gotPickup(pickup))
  }
}

export default GameScreen