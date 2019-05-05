import { Width, Height, PipeDeltaT, Interval, BirdX, SpeedFactor } from './setting.js'
import Bird from './bird.js'
import Pipe from './pipe.js'

export default class Game {
  constructor(birdNum = 1) {
    this._birdNum = birdNum
    this._started = false
    this._birds = []
    this._pipes = []
    this._pipeThread = null
    this._refreshProcessId = null
    this.constructor.speedFactor = SpeedFactor
  }

  get started() { return this._started }

  get paused() { return !this._refreshProcessId }

  get birds() { return this._birds }

  get pipes() { return this._pipes }

  get style() {
    return {
      width: Width + 'px',
      height: Height + 'px'
    }
  }

  get gameover() {
    return this._birds.every(bird => bird.dead)
  }

  set speed(factor) {
    clearInterval(this._pipeThread)
    this._pipeThread = null
    this.constructor.speedFactor = factor
    this._initializePipes()
  }

  start() {
    this._started = true
    this._initializeBirds(this._birdNum)
    this._initializePipes()
    this._initializeRefreshProcess()
  }

  restart() {
    this.pause()
    // reset birds and pipes
    this._birds.forEach(bird => bird.rebirth())
    this._pipes = []
    this._initializePipes()
    this._initializeRefreshProcess()
  }

  pause() {
    clearInterval(this._refreshProcessId)
    clearInterval(this._pipeThread)
    this._refreshProcessId = null
    this._pipeThread = null
  }

  resume() {
    this._initializePipes()
    this._initializeRefreshProcess()
  }

  _initializeBirds(birdNum) {
    this._birds = [...new Array(birdNum)].map(() => new Bird())
  }

  _initializePipes() {
    const timeBetweenPipes = PipeDeltaT / this.constructor.speedFactor
    this._pipeThread = setInterval(() => {
      let pipe = new Pipe()
      this._pipes.push(pipe)
    }, timeBetweenPipes)
  }

  _initializeRefreshProcess() {
    this._refreshProcessId = setInterval(() => {
      this._update(Interval)
    }, Interval)
  }

  _update(ms) {
    if (this._pipes.length === 0) return

    if (this.gameover) {
      this.restart()
      return
    }

    let closestPipe = this._getClosestPipe()
    // update birds
    this._birds.forEach(bird => {
      if (bird.dead) return
      if (bird.hit(closestPipe)) {
        bird.die()
        return
      }
      bird.think(closestPipe)
      bird.update(ms)
    })
    // update pipes
    this._pipes.forEach(pipe => {
      pipe.update(ms)
    })
  }

  _getClosestPipe() {
    let closest = null
    let minDistance = 10000
    this._pipes.forEach(pipe => {
      let distance = pipe.right - BirdX
      if (distance > 0 && distance < minDistance) {
        closest = pipe
        minDistance = distance
      }
    })
    return closest
  }
}
