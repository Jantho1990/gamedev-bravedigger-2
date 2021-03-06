import pop from "../../pop/index.js"
const { Container, Sprite, Text, Texture, TileSprite, math } = pop
import ui from "../ui.js"
import Timer from "../../pop/Timer.js";

const textures = {
  tiles: new Texture("res/img/bravedigger-tiles.png"),
  wave: new Texture("res/img/bravedigger-wave.png"),
  title: new Texture("res/img/bravedigger-title.png"),
  two: new Texture("res/img/two-title.png")
}

class TitleScreen extends Container {
  constructor(game, controls, onStart) {
    super()
    this.onStart = onStart
    this.starting = false
    this.controls = controls

    this.sprites = this.add(new Container())

    this.drawBackground(game.w, game.h)

    const { ease: { elasticOut } } = math

    // Main title
    const title = new Sprite(textures.title)
    title.pos.set(200, -150)
    this.title = this.add(title)

    // Do title lerp, with easing
    this.add(new Timer(1, p => {
      title.pos.y = 320 * elasticOut(p) - 150
    }, null, 1))

    // Sub heading
    const t = new Text("press fire to begin", ui.title)
    t.pos.set(game.w / 2 + 50, 400)
    t.alpha = 0
    this.pressStart = this.add(t)

    // II
    const two = this.add(new Sprite(textures.two))
    two.pos.set(980, game.h)
    two.rotation = 20 / 180 * Math.PI
    two.scale.x = 0.5
    two.scale.y = 0.5
    this.add(
      new Timer(
        1,
        p => (two.pos.y = game.h - elasticOut(p) * 330 - 190),
        null,
        0.8
      )
    )

    // Bravedigger
    const bd = new TileSprite(textures.wave, 48 * 5, 48 * 5)
    bd.pos.set(170, game.h / 2 - 100)
    this.add(
      new Timer(
        2,
        p => (bd.pos.y = elasticOut(p) * game.h - game.h / 1.6)
      )
    )
    this.bd = this.add(bd)

    controls.keys.reset()
  }

  start() {
    const { bd, starting, onStart } = this
    if (starting) {
      return
    }
    this.starting = true
    const yo = bd.pos.y
    this.add(
      new Timer(
        0.6,
        p => {
          bd.pos.y = math.smoothstep(p) * -850 + yo;
        },
        onStart
      )
    )
  }

  update(dt, t) {
    super.update(dt, t)
    const { controls, pressStart, sprites, bd, title } = this
    const { keys } = controls
    if (keys.action) {
      this.start()
    }

    // Lerp into position (from -150 to (-150+320) after one second, for one second.)
    // title.pos.y = 320 * math.clamp(math.lerp(t, 1, 2)) - 150

    // Move around the background sprites
    sprites.pos.x = Math.cos(t / 2) * 30
    sprites.pos.y = Math.sin(t / 2) * 30

    // Flash the subheading
    pressStart.alpha = Math.abs(Math.sin(t / 1 - 0.2))

    // Animate BD.
    bd.frame.x = (t / 0.2 % 2) | 0
  }

  drawBackground(w, h) {
    const { sprites } = this
    // Background sprites
    const tw = 48
    const tx = Math.floor(w / tw) + 4
    const ty = Math.floor(h / tw) + 4
    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        const s = sprites.add(new TileSprite(textures.tiles, 48, 48))
        const frame = [0, 2]
        if (math.randOneIn(5)) frame[0] = 1
        if (math.randOneIn(50)) {
          frame[0] = 3
          frame[1] = 3
          s.alpha = 0.5
        }
        s.frame.x = frame[0]
        s.frame.y = frame[1]
        s.pos.set(x * tw - tw * 2, y * tw - tw * 2)
      }
    }
  }
}

export default TitleScreen