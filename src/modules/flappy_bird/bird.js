import {
  BirdHeight,
  BirdWidth,
  BirdX,
  DeltaSpeed,
  Gravity,
  Height,
  Width
} from './setting.js'
import Game from './game.js'

export default class Bird {
  constructor() {
    this._x = BirdX
    this._y = Height / 2
    this._speed = 0
    this._died = false
  }

  get x() { return this._x }

  get y() { return this._y }

  get width() { return BirdWidth }

  get height() { return BirdHeight }

  get style() {
    return {
      width: BirdWidth + 'px',
      height: BirdHeight + 'px',
      marginLeft: -BirdWidth / 2 + 'px',
      marginBottom: -BirdHeight / 2 + 'px',
      left: this._x + 'px',
      bottom: this._y + 'px'
    }
  }

  up() {
    this._speed = DeltaSpeed
  }

  update(ms = 20) {
    // position change: x = v0 * t + 1/2 * a * t^2 ~= v0 * t
    // speed change: v = v0 + a * t
    const deltaT = ms / 1000 * Game.speedFactor
    const deltaY = this._speed * deltaT
    this._y += -deltaY
    this._speed = this._speed + Gravity * deltaT

    if (this._reachedTop()) {
      this._y = Height - BirdHeight / 2
      this._speed = 0
    }

    if (this._reachedBottom()) {
      this._y = BirdHeight / 2
      this._speed = 0
    }
  }

  hit(pipe) {
    const [x, y, w, h] = [this._x, this._y, BirdWidth, BirdHeight]
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

  check() {
    console.log(this.y, this._speed)
  }

  _reachedTop() {
    return this._y + BirdHeight / 2 > Height
  }

  _reachedBottom() {
    return this._y - BirdHeight / 2 < 0
  }
}
