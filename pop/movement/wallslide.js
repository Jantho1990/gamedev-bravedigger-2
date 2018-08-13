import entity from '../utils/entity'

export default function wallslide(ent, map, x = 0, y = 0) {
  let tiles
  const bounds = entity.bounds(ent)

  // Final amounts of movement to allow
  let xo = x
  let yo = y

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo) // temporarily assume no horizontal movement
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable)

    // Hit your head or your feet
    if (
      (y < 0 && !(tl && tr)) ||
      (y > 0 && !(bl && br))
    ) {
      yo = 0
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo)
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable)

    // Hit left or right edge
    if (
      (x < 0 && !(tl && bl)) ||
      (x > 0 && !(tr && br))
    ) {
      xo = 0
    }
  }

  // xo and yo contain the amount we're allowed to move by
  return {
    x: xo,
    y: yo
  }
}