import TileMap from '../pop/TileMap'
import tiledParser from '../pop/utils/tiledParser'
import Texture from '../pop/Texture';

const texture = new Texture("res/img/bravedigger-tiles.png")

class TiledLevel extends TileMap {
  constructor(data, parsed) {
    if (!parsed) {
      data = tiledParser(data)
    }
    const { tileW, tileH, mapW, mapH, tiles } = data
    super(tiles, mapW, mapH, tileH, tileW, texture)

    this.completed = false
    this.timeTaken = 0
    this.bestTime = -1

    this.spawns = parsed ? data.spawns : this.getSpawnLocations(data)
    this.data = data
  }

  getSpawnLocations(data) {
    return {
      player: data.getObjectByName('Hero', true),
      baddies: [
        // ...data.getObjectsByType('Ghost'),
        // ...data.getObjectsByType('Spikes'),
        ...data.getObjectsByType('Bat'),
        // ...data.getObjectsByType('Totem')
      ],
      pickups: data.getObjectsByType('Pickup'),
      // doors: data.getObjectsByType('Door')
    }
  }

  makeDisappearingTile(t, duration = 1) {
    if (!t.frame.bridge || t.frame.counter > 0) {
      // not a bridge or disappearing
      return
    }
    const getTileByType = name => {
      return this.data.tiles.find(tile => Object.keys(tile).find(prop => prop === name) !== undefined)
    }

    t.frame.counter = duration // how long until tile disappears
    t._update = t.update
    t.update = function(dt, t) {
      const { frame } = this
      this._update.call(this, dt, t)
      frame.counter -= dt
      if (frame.counter < duration * 0.33) {
        // debugger
        frame.x = 6 // getTileByType('bridge').x + 1
      }
      if (frame.counter <= 0) {
        // switch to empty tile
        this.frame = { x: 0, y: 2, walkable: true } // Object.assign({}, getTemplate('empty'))
        this.update = this._update
        delete this._update
      }
    }
  }

  complete(time) {
    this.complete = true
    this.timeTaken = time
  }

  serialize(game) {
    const { player, pickups, baddies, triggers } = game
    const { mapW, mapH, tileW, tileH, children } = this
    const tiles = children.map(({ frame }) => Object.assign({}, frame))
    const spawns = {
      baddies: baddies.children
        .filter(b => b.serialize)
        .map(b => b.serialize()),
      pickups: pickups.children.map(({ pos: { x, y }}) => ({ x, y })),
      doors: triggers.children.map(t => t.serialize()),
      player: { x: player.pos.x, y: player.pos.y }
    }
  }
}

export default TiledLevel