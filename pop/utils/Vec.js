class Vec {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  static from(v) {
    return new Vec().copy(v)
  }

  add({ x, y }) {
    this.x += x
    this.y += y
    return this
  }

  clone() {
    return Vec.from(this)
  }

  /**
   * Copy an object with x,y coordiantes and set those coordinates
   * as this vector's value.
   * @param {} param0 
   */
  copy({ x, y }) {
    this.x = x
    this.y = y
    return this
  }

  dot({ x, y }) {
    return this.x * x + this.y * y
  }

  /**
   * Magnitude of the vector.
   */
  mag() {
    const { x, y } = this
    return Math.sqrt(x * x + y * y)
  }

  multiply(s) {
    this.x *= s
    this.y *= s
    return this
  }

  divide(s) {
    this.x /= s
    this.y /= s
    return this
  }

  /**
   * Get unit vector, or the direction of this vector.
   */
  normalize() {
    const mag = this.mag()
    if (mag > 0) {
      this.x /= mag
      this.y /= mag
    }
    return this
  }

  set(x = 0, y = 0) {
    this.x = x
    this.y = y
    return this
  }

  subtract({ x, y }) {
    this.x -= x
    this.y -= y
    return this
  }
}

export default Vec