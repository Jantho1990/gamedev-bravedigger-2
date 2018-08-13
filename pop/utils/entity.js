import math from './math'
import Rect from '../Rect'

export function addDebug(e) {
  e.children = e.children || []
  const bb = new Rect(e.w, e.h, { fill: 'hsla(0, 50%, 50%, 0.3)'})
  e.children.push(bb)
  if (e.hitBox) {
    const { x, y, w, h } = e.hitBox
    const hb = new Rect(w, h, { fill: 'hsla(0, 50%, 50%, 0.5)'})
    hb.pos.x = x
    hb.pos.y = y
    e.children.push(hb)
  }
  return e
}

/**
 * Get the direction for one entity to aim at another. 
 * @param {*} a 
 * @param {*} b
 * @return object
 */
export function aim(a, b) {
  const angle = math.angle(center(a), center(b))
  return math.direction(angle)
}

export function angle(a, b) {
  return math.angle(center(a), center(b))
}

export function bounds(entity) {
  const { w, h, pos, hitBox } = entity
  const hit = hitBox || { x: 0, y: 0, w, h }
  return {
    x: hit.x + pos.x,
    y: hit.y + pos.y,
    w: hit.w - 1,
    h: hit.h - 1
  }
}

export function center(entity) {
  const { pos, w, h } = entity
  return {
    x: pos.x + w / 2,
    y: pos.y + h / 2
  }
}

export function direction(angle) {
  return math.direction(angle)
}

export function distance(a, b) {
  return math.distance(center(a), center(b))
}

export function hit(e1, e2) {
  const a = bounds(e1)
  const b = bounds(e2)
  return a.x + a.w >= b.x && // e1 right edge overlaps e2 left edge
    a.x <= b.x + b.w && // e1 left edge overlaps e2 right edge
    a.y + a.h >= b.y && // e1 bottom edge overlaps e2 top edge
    a.y <= b.y + b.h // e1 top edge overlaps e2 bottom edge 
}

export function hits(entity, container, hitCallback) {
  const a = bounds(entity)
  container.map(e2 => {
    const b = bounds(e2)
    if (
      a.x + a.w >= b.x &&
      a.x <= b.x + b.w &&
      a.y + a.h >= b.y &&
      a.y <= b.y + b.h
    ) {
      hitCallback(e2)
    }
  })
}

export default {
  addDebug,
  aim,
  angle,
  bounds,
  center,
  direction,
  distance,
  hit,
  hits
}