import Sound from './Sound'

class SoundPool {
  constructor(src, options = {}, poolSize = 3) {
    this.count = 0
    this.sounds = [...Array(poolSize)]
      .map(() => new Sound(src, options))
  }

  play(options) {
    const { sounds } = this
    const index = this.count++ % sounds.length
    sounds[index].play(options)
  }

  stop() {
    this.sounds.forEach(sound => sound.stop())
  }
}

export default SoundPool