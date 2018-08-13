export function angle(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const angle = Math.atan2(dy, dx)

  return angle
}

export function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max))
}

export function distance(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return Math.sqrt(dx * dx + dy * dy)
}

export function direction(angle) {
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }
}

export function rand(min, max) {
  return Math.floor(randf(min, max))
}

export function randf(min, max) {
  if (max == null) {
    max = min || 1
    min = 0
  }
  return Math.random() * (max - min) + min
}

export function randOneIn(max = 2) {
  return rand(0, max) === 0
}

export function randOneFrom(items) {
  return items[rand(items.length)]
}

export default {
  angle,
  clamp,
  distance,
  direction,
  rand,
  randf,
  randOneFrom,
  randOneIn
}