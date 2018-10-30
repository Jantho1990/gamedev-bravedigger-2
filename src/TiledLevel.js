import TileMap from '../pop/TileMap'

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
  }

  getSpawnLocations(data) {
    return {
      player: data.getObjectByName('Hero', true),
      baddies: [
        ...data.getObjectByType('Ghost'),
        ...data.getObjectByType('Spikes'),
        ...data.getObjectByType('Bat'),
        ...data.getObjectByType('Totem')
      ],
      pickups: data.getObjectByType('Pickup'),
      doors: data.getObjectsByType('Door')
    }
  }

  
}

export default TiledLevel