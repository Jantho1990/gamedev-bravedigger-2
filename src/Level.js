import pop from '../pop/'
const { TileMap, Texture, math } = pop
import EasyStar from 'easystarjs'

const texture = new Texture('../res/img/bravedigger-tiles.png')

class Level extends TileMap {
  constructor(w, h) {
    const tileSize = 48
    const tileIndexes = [
      { id: 'empty', x: 0, y: 2, walkable: true },
      { id: 'wall', x: 1, y: 3 },
      { id: 'wall3d', x: 3, y: 3 }
    ]
    const getTile = id => tileIndexes.find(t => t.id == id)
    const getIdx = id => tileIndexes.indexOf(getTile(id))

    const ascii = `
#########################
#####                ####
###                B  ###
##                ###  ##
#       ########       ##
#   ##       ###        #
#B            ####      #
###             ##      T
####   ##T##    ####    #
#####        #         ##
###                  ####
##    ##      #         #
#   #####        ########
# ########    T##########
#X          #############
#########################`

    const spawns = {
      player: null,
      totems: [],
      bats: [],
      pickups: []
    }

    // Turn ascii into cells
    const cells = ascii.split('\n').slice(1).map(row => {
      return row.split('')
    })
    const mapH = cells.length
    const mapW = cells.reduce((max, row) => Math.max(max, row.length), 0)

    // "pad out" the rows so they are all the same length
    const padded = cells.map(row => {
      const extra = mapW - row.length
      return [...row, ...Array(extra).fill(' ')]
    })

    // Find spawns, and replace with correct tiles
    const level = padded
      .map((row, y) =>
        row.map((cell, x) => {
          switch (cell) {
            case '#':
              return getIdx('wall')
            case 'T':
              spawns.totems.push({ x, y })
              return getIdx('wall')
            case 'B':
              spawns.bats.push({ x, y })
              return getIdx('empty')
            case 'X':
              spawns.player = { x, y }
              return getIdx('empty')
            default:
              return getIdx('empty')
          }
        })
      ).reduce((ac, el) => [...ac, ...el])

    // Add 3D wall effect if no wall below a tile
    for (let y = 1; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const above = level[(y - 1) * mapW + x]
        const me = level[y * mapW + x]
        if (me === getIdx('wall') && tileIndexes[above].walkable) {
          level[y * mapW + x] = getIdx('wall3d')
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

    // Map spawn points to physical locations
    this.spawns = {
      player: this.mapToPixelPos(spawns.player),
      bats: spawns.bats.map(b => this.mapToPixelPos(b)),
      totems: spawns.totems.map(t => this.mapToPixelPos(t)),
      pickups: spawns.pickups.map(p => this.mapToPixelPos(p))
    }
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