import math from '../utils/math'

class SoundGroup {
  constructor(sounds) {
    this.sounds = sounds
  }

  /**
   * Play a random sound from the group.
   * @param {*} opts 
   */
  play(opts) {
    const { sounds } = this
    math.randOneFrom(sounds).play(opts)
  }

  /**
   * Stop all sounds from this group.
   */
  stop() {
    this.sounds.forEach(sound => sound.stop())
  }
}