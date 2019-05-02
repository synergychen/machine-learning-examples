import { Width, Height, PipeDeltaT, Interval, BirdX } from './setting.js'
import Bird from './bird.js'
import Pipe from './pipe.js'

export default class Game {
  constructor(birdNum = 1) {
    this._birdNum = birdNum
    this._started = false
    this._birds = []
    this._pipes = []
    this._refreshProcessId = null
    this.constructor.speedFactor = 1
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

  update(ms) {
    this._birds.forEach(bird => {
      bird.update(ms)
      let closestPipe = this._getClosestPipe()
      if (closestPipe && bird.hit(closestPipe)) {
        bird.die()
      }
    })
    this._pipes.forEach(pipe => {
      pipe.update(ms)
    })
  }

  pause() {
    clearInterval(this._refreshProcessId)
    this._refreshProcessId = null
  }

  resume() {
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
      this.update(Interval)
    }, Interval)
  }

  _getClosestPipe() {
    if (this._pipes.length === 0) return null

    let closest = null
    let minDistance = 10000
    this._pipes.forEach(pipe => {
      let distance = Math.abs(pipe.x - BirdX)
      if (distance < minDistance) {
        closest = pipe
        minDistance = distance
      }
    })
    return closest
  }
}
