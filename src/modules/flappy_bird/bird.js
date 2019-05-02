import { Width, Height } from './setting.js'

export default class Bird {
  constructor() {
    // constants
    this._width = 20
    this._height = 20
    this._gravity = 35
    this._deltaSpeed = -8
    // variables
    this._x = Width / 3
    this._y = Height / 2
    this._speed = 0
    this._died = false
  }

  get x() { return this._x }

  get y() { return this._y }

  get width() { return this._width }

  get height() { return this._height }

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

  update(ms = 20) {
    // position change: x = v0 * t + 1/2 * a * t^2 ~= v0 * t
    // speed change: v = v0 + a * t
    const deltaT = ms / 1000
    const deltaY = this._speed + deltaT
    this._y += -deltaY
    this._speed = this._speed + this._gravity * deltaT

    if (this.reachedTop()) {
      this._y = Height - this._height / 2
      this._speed = 0
    }

    if (this.reachedBottom()) {
      this._y = this._height / 2
      this._speed = 0
    }
  }

  hit(pipe) {
    const [x, y, w, h] = [this._x, this._y, this._width, this._height]
    const rightBottomHit = ((x + w / 2) > pipe.left) && ((x + w / 2) < pipe.right) && ((y - h / 2) < pipe.bottom)
    const leftBottomHit  = ((x - w / 2) > pipe.left) && ((x - w / 2) < pipe.right) && ((y - h / 2) < pipe.bottom)
    const rightTopHit    = ((x + w / 2) > pipe.left) && ((x + w / 2) < pipe.right) && ((y + h / 2) > pipe.top)
    const leftTopHit     = ((x - w / 2) > pipe.left) && ((x - w / 2) < pipe.right) && ((y + h / 2) > pipe.top)
    return rightBottomHit || rightTopHit || leftBottomHit || leftTopHit
  }

  die() {
    this._died = true
    console.log("died")
  }

  reachedTop() {
    return this._y + this._height / 2 > Height
  }

  reachedBottom() {
    return this._y - this._height / 2 < 0
  }

  check() {
    console.log(this.y, this._speed)
  }
}
