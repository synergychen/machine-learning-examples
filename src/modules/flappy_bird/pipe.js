import { Width, Height } from './setting.js'

export default class Pipe {
  constructor() {
    // constants
    this._width = 50
    this._gap = 100
    // variables
    this._x = Width
    const pipe = this.initializePipe()
    this._top = pipe.top
    this._bottom = pipe.bottom
    this._speed = 70
  }

  get x() { return this._x }

  get top() { return this._top }

  get bottom() { return this._bottom }

  get left() { return this._x }

  get right() { return this._x + this._width }

  get style() {
    return {
      left: this._x + 'px'
    }
  }

  get topStyle() {
    return {
      height: (Height - this._top) + 'px',
      width: this._width + 'px'
    }
  }

  get bottomStyle() {
    return {
      height: this._bottom + 'px',
      width: this._width + 'px'
    }
  }

  initializePipe() {
    const center = (Math.random() - 0.5) * Height / 2 + Height / 2
    return {
      top: center + this._gap / 2,
      bottom: center - this._gap / 2
    }
  }

  update(ms = 20) {
    const deltaT = 20 / 1000
    this._x -= this._speed * deltaT
  }

  check() {
    console.log(this._x)
  }
}
