import Container from "../Container";
import Vec from "../utils/Vec";
import Particle from "./Particle";

class ParticleEmitter extends Container {
  constructor(numParticles = 20, display, effects = {}) {
    super()
    this.pos = new Vec()

    this.particles = Array.from(new Array(numParticles), () =>
      this.add(new Particle(display, effects))
    )

    this.lastPlay = 0
  }

  play(pos) {
    const now = Date.now()
    if (now - this.lastPlay < 300) return
    this.lastPlay = now

    this.pos.copy(pos)
    this.particles.forEach(p => p.reset())
  }
}

export default ParticleEmitter