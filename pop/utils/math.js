/**
 * Get the angle between two entities.
 * 
 * @param {*} a 
 * @param {*} b 
 */
export function angle(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const angle = Math.atan2(dy, dx)

  return angle
}

export function clamp(x, min = 0, max = 1) {
  return Math.max(min, Math.min(x, max))
}

/**
 * Get the distance between two positions.
 * 
 * @param {*} a 
 * @param {*} b 
 */
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

// Robert Penner's Easing Functions
export const ease = {
  quadIn (x) {
    return x * x
  },
  quadOut (x) {
    return 1 - this.quadIn(1 - x)
  },
  cubicIn (x) {
    return x * x * x
  },
  cubicInOut (p) {
    if (p < 0.5) return this.cubicIn(p * 2) / 2
    return 1 - this.cubicIn((1 - p) * 2) / 2
  },
  elasticOut (x) {
    const p = 0.4
    return Math.pow(2, -10 * x) *
      Math.sin((x - p / 4) *
      (Math.PI * 2) / p) + 1
  }
}

export function lerp(x, min = 0, max = 1) {
  return (x - min) / (max - min)
}

export function mix(a, b, p) {
  return a * (1 - p) + b * p
}

let random = Math.random
export function rand(min, max) {
  return Math.floor(randf(min, max))
}

export function randf(min, max) {
  if (max == null) {
    max = min || 1
    min = 0
  }
  return random() * (max - min) + min
}

export function randOneIn(max = 2) {
  return rand(0, max) === 0
}

export function randOneFrom(items) {
  return items[rand(items.length)]
}

let seed = 42;
function randomSeed(s) {
  if (!isNaN(s)) {
    seed = s
  }
  return seed
}

function randomSeeded() {
  // https://en.wikipedia.org/wiki/Linear_congruential_generator
  seed = (seed * 16807 + 0) % 2147483647
  return seed / 2147483647
}

function useSeededRandom(blnUse = true) {
  randomSeeded()
  random = blnUse ? randomSeeded : Math.random
}

export default {
  angle,
  clamp,
  distance,
  direction,
  ease,
  lerp,
  mix,
  rand,
  randf,
  randOneFrom,
  randOneIn,
  randomSeed,
  useSeededRandom
}