import pop from '../../pop'
const { Camera, Container, entity, State, Text } = pop
import TiledLevel from '../TiledLevel'
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
import Assets from '../../pop/Assets';

const texture = new Texture("res/img/bravedigger-tiles.png")

const states = {
  READY: 0,
  PLAYING: 1,
  GAMEOVER: 2,
  LOADING: 3
}

class GameScreen extends Container {
  constructor(game, controls, gameState, screens) {
    const { LOADING } = states
    super()
    this.w = game.w
    this.h = game.h
    this.game = game
    this.controls = controls
    this.gameState = gameState
    this.screens = screens

    this.state = new State(LOADING)

    this.time = 0

    this.camera = this.add(new Camera(null, { w: game.w, h: game.h }))

    /* const camera = new Camera(
      player,
      { w: game.w, h: game.h },
      { w: map.w, h: map.h }
    )
    this.camera = this.add(camera) */

    // Score
    this.score = 0
    this.scoreText = this.add(
      new Text('0', {
        font: '40pt "Luckiest Guy", sans-serif',
        fill: 'hsl(0, 100%, 100%)',
        align: 'center'
      })
    )
    this.scoreText.pos = {
      x: game.w / 2,
      y: game.h / 2 - 40
    }

    // Either load from url or memory
    const levelUrl = `res/levels/l${gameState.level}a.json?c=${Date.now()}`
    const serialized = gameState.data[gameState.level]
    const level = serialized ?
      Promise.resolve(serialized) :
      Assets.json(levelUrl)

    level.then(json => this.setupLevel(json, !!serialized)).then(() => {
      // Level is loaded
      this.loaded = true
      if (gameState.spawn) {
        this.player.pos.copy(this.map.mapToPixelPos(gameState.spawn))
      }
    })
  }

  setupLevel(json, parsed) {
    const { camera, controls, gameState } = this
    // debugger
    // Map, player, camera
    const map = new TiledLevel(json, parsed)
    const player = new Player(controls, map, gameState.hp)
    player.pos.x = map.spawns.player.x
    player.pos.y = map.spawns.player.y

    camera.worldSize = { w: map.w, h: map.h }
    camera.setSubject(player)
    // debugger
    
    /* this.map = camera.add(map)
    this.pickups = camera.add(new Container())
    this.player = camera.add(player)
    this.fx = camera.add(new Container()) */

    // Add the layers in the correct Z order
    this.map = camera.add(map)
    this.triggers = camera.add(new Container())
    this.pickups = camera.add(new Container())
    this.player = camera.add(player)
    this.baddies = camera.add(new Container())
    this.bullets = camera.add(new Container())
    this.fx = camera.add(new Container())
    // debugger

    // Add level pickups
    map.spawns.pickups.forEach(p => {
      const pickup = this.pickups.add(new Pickup())
      pickup.pos.copy(p)
    })

    // Add level bad guys
    map.spawns.baddies.forEach(data => {
      const { type, x, y, properties = {} } = data
      const b = this.baddies.add(this.makeBaddie(type))
      if (properties.speed) {
        b.vel.x = properties.speed
      }
      b.pos.set(x, y)
    })

    // Bats
    // const baddies = new Container()
    /* map.spawns.bats.forEach(spawn => {
      const bat = baddies.add(new Bat(player))
      bat.pos.copy(spawn)
    })
    this.baddies = camera.add(baddies) */
      // Totems
    /* map.spawns.totems.forEach(({ x, y }) => {
      const t = camera.add(new Totem(player, b => baddies.add(b)))
      t.pos.x = x
      t.pos.y = y
    }) */

    // Pickups
    // this.populate()

    // Heart Particles
    const p = new TileSprite(texture, 48, 48)
    p.scale.x = 0.4
    p.scale.y = 0.4
    p.frame.x = 6
    p.frame.y = 2

    this.pe = this.fx.add(new ParticleEmitter(25, p, { life: 2 }))
  }

  makeBaddie(type) {
    const { baddies, player, map } = this
    let e
    switch (type) {
      case "Totem":
        e = new Totem(player, b => {
          this.addAfter.push(b)
          return b //return baddies.add(b);
        });
        break;
      case "Ghost":
        e = new Ghost(map)
        break;
      case "Spikes":
        e = new Spikes()
        break;
      case "Bat":
        e = new Bat(player)
        break;
      default:
        console.warn("Sorry, I don't know that bad guy:", type)
    }
    return e
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
    const { LOADING, READY, PLAYING, GAMEOVER } = states

    switch (state.get()) {
      case LOADING:
        this.scoreText.text = '...'
        if (this.loaded) {
          state.set(READY)
        } else {
          console.log('not ready')
        }
        break;
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
        if (player.gameOver && controls.keys.action) {
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
    const one = this.fx.add(new OneUp(coin))
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