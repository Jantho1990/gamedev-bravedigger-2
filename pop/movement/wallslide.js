import entity from '../utils/entity'

/*
  Expects:
  * an entity (with pos vector, w & h)
  * a Pop TileMap
  * The x and y amount *requesting* to move (no checks if 0)
*/

const TL = 0
const TR = 1
const BL = 2
const BR = 3

export default function wallslide(ent, map, x = 0, y = 0) {
  let tiles
  let tileEdge
  const bounds = entity.bounds(ent)
  const hits = {
    up: false,
    down: false,
    left: false,
    right: false
  }

  // Final amounts of movement to allow
  let xo = x
  let yo = y

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo) // temporarily assume no horizontal movement
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable)

    // Hit your head
    if (y < 0 && !(tl && tr)) {
      hits.up = true
      tileEdge = tiles[0].pos.y + tiles[0].h // top-left tile y-coordinate plus height of tile
      yo = tileEdge - bounds.y // edge minus entity top y-coordinate
    }

    const isCloud = tiles[BL].frame.cloud || tiles[BR].frame.cloud

    // Hit your feet
    // No need to check y > 0 because if we get here y must be > 0
    if (!(bl && br) || isCloud) {
      tileEdge = tiles[BL].pos.y - 1 // bottom-left tile y-coordinate minus 1 pixel
      const dist = tileEdge - (bounds.y + bounds.h) // minus offset of bounds because we calculate from top-left
      if (!isCloud || dist > -10) {
        hits.down = true
        yo = dist
      }
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo)
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable)

    // Hit left edge
    if (x < 0 && !(tl && bl)) {
      hits.left = true
      tileEdge = tiles[0].pos.x + tiles[0].w // top-left tile x-coordinate plus width of tile
      xo = tileEdge - bounds.x // right edge of top-left tile minus left edge of entity bounds
    }

    // Hit right edge
    if (x > 0 && !(tr && br)) {
      hits.right = true
      tileEdge = tiles[1].pos.x - 1 // top-right tile x-coordinate minus 1 pixel
      xo = tileEdge - (bounds.x + bounds.w) // tile edge minus offset of entity bounds width
    }
  }

  // xo and yo contain the amount we're allowed to move by
  return {
    x: xo,
    y: yo,
    hits
  }
}