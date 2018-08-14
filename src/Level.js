import pop from '../pop/'
const { TileMap, Texture, math } = pop
import EasyStar from 'easystarjs'

const texture = new Texture('../res/img/bravedigger-tiles.png')

class Level extends TileMap {
  constructor(w, h) {
    const tileSize = 48
    const mapW = Math.floor(w / tileSize)
    const mapH = Math.floor(h / tileSize)

    const tileIndexes = [
      { id: 'empty', x: 1, y: 2, walkable: true },
      { id: 'wall', x: 2, y: 2 },
      { id: 'wall_end', x: 3, y: 2 }
    ]
    const getTile = id => tileIndexes.find(t => t.id == id)
    const getIdx = id => tileIndexes.indexOf(getTile(id))

    // Make a random dungeon
    const level = Array(mapW * mapH).fill(getIdx('empty'))
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        // Map borders
        if (y === 0 || x === 0 || y === mapH - 1 || x === mapW - 1) {
          level[y * mapW + x] = getIdx('wall') // y coordinate * mapWidth + x coordinate offset = one-dimensional level index
          continue
        }

        // Grid points - randomly skip some to make "rooms"
        if (y % 2 || x % 2 || math.randOneIn(4)) continue // Skip any even tile coordinates, and randomly skip some odd tiles
        level[y * mapW + x] = getIdx('wall') // Draw a grid post

        // Side walls -- pick a random direction
        const [xo, yo] = math.randOneFrom([
          [0, -1], // north
          [0, 1], // south
          [1, 0], // east
          [-1, 0] // west
        ])
        level[(y + yo) * mapW + (x + xo)] = getIdx('wall')
      }
    }

    // Add 3D wall effect if no wall below a tile
    for (let y = 0; y < mapH - 1; y++) {
      for (let x = 0; x < mapW; x++) {
        const below = level[(y + 1) * mapW + x]
        const me = level[y * mapW + x]
        if (me === getIdx('wall') && below !== getIdx('wall')) {
          level[y * mapW + x] = getIdx('wall_end')
        }
      }
    }

    super(
      level.map(i => tileIndexes[i]),
      mapW,
      mapH,
      tileSize,
      tileSize,
      texture
    )

    // Translate 1D level into 2D pathfinder array
    const grid = []
    for (let i = 0; i < level.length; i+= mapW) {
      grid.push(level.slice(i, i + mapW))
    }

    // Create path finding
    const path = new EasyStar.js()
    path.setGrid(grid)
    // Get walkable tiles index
    const walkables = tileIndexes
      .map(({ walkable }, i) => (walkable ? i : -1))
      .filter(i => i !== -1)
    path.setAcceptableTiles(walkables)

    this.path = path
  }

  findFreeSpot(isFree = true) {
    const { mapW, mapH } = this
    let found = false
    let x, y
    let failsafe = 0
    while (!found) {
      x = math.rand(mapW)
      y = math.rand(mapH)
      const { frame } = this.tileAtMapPos({ x, y })
      if (!!frame.walkable == isFree) {
        found = true
      } else if (failsafe++ > 5000) {
        break
      }
    }
    return this.mapToPixelPos({ x, y })
  }
}

export default Level