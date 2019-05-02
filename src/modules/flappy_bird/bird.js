const screenWidth = 600
const screenHeight = 400

export default class Bird {
  constructor(x, y) {
    // constants
    this._width = 20
    this._height = 20
    this._gravity = 35
    this._deltaSpeed = -8
    // variables
    this._x = x
    this._y = y
    this._speed = 0
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get style() {
    return {
      width: this._width + 'px',
      height: this._height + 'px',
      marginLeft: -this._width / 2 + 'px',
      marginBottom: -this._height / 2 + 'px',
      left: this._x + 'px',
      bottom: this._y + 'px'
    }
  }

  up() {
    this._speed = this._deltaSpeed
  }

  update(ms) {
    // position change: x = v0 * t + 1/2 * a * t^2 ~= v0 * t
    // speed change: v = v0 + a * t
    const deltaT = ms / 1000
    const deltaY = this._speed + deltaT
    this._y += -deltaY
    this._speed = this._speed + this._gravity * deltaT

    if (this._y + this._height / 2 > screenHeight) {
      this._y = screenHeight - this._height / 2
      this._speed = 0
    }

    if (this._y - this._height / 2 < 0) {
      this._y = this._height / 2
      this._speed = 0
    }
  }

  check() {
    console.log(this.y, this._speed)
  }
}
