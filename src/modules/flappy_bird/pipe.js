import {
  Height,
  PipeGap,
  PipeSpeed,
  PipeWidth,
  Width
} from './setting.js'
import Game from './game.js'

export default class Pipe {
  constructor() {
    this._x = Width
    const pipe = this._initializePipe()
    this._top = pipe.top
    this._bottom = pipe.bottom
  }

  get x() { return this._x }

  get top() { return this._top }

  get bottom() { return this._bottom }

  get left() { return this._x }

  get right() { return this._x + PipeWidth }

  get style() {
    return {
      left: this._x + 'px'
    }
  }

  get topStyle() {
    return {
      height: (Height - this._top) + 'px',
      width: PipeWidth + 'px'
    }
  }

  get bottomStyle() {
    return {
      height: this._bottom + 'px',
      width: PipeWidth + 'px'
    }
  }

  update(ms = 20) {
    const deltaT = ms / 1000 * Game.speedFactor
    this._x -= PipeSpeed * deltaT
  }

  _initializePipe() {
    const center = (Math.random() - 0.5) * Height / 2 + Height / 2
    return {
      top: center + PipeGap / 2,
      bottom: center - PipeGap / 2
    }
  }
}
