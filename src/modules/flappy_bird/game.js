import {
  BirdX,
  Height,
  Interval,
  PipeDeltaT,
  PipeDistance,
  SpeedFactor,
  Width
} from './setting.js'
import { Network } from 'synaptic'
import Bird from './bird.js'
import GeneticAlgorithm from './genetic-algorithm.js'
import Pipe from './pipe.js'

export default class Game {
  constructor(birdNum = 1) {
    this._started = false
    this._birds = this._initializeBirds(birdNum)
    this._pipes = []
    this._bestBird = null
    this._refreshProcessId = null
    this._ga = new GeneticAlgorithm(this._birds)
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

  get ga() { return this._ga }

  get gameover() {
    return this._birds.every(bird => bird.dead)
  }

  get bestBird() {
    return this._ga.globalBest
  }

  set speed(factor) {
    this.constructor.speedFactor = factor
  }

  load(json) {
    const brain = Network.fromJSON(json)
    const bird = new Bird(brain)
    this._birds.push(bird)
  }

  start() {
    this._started = true
    this._initializeRefreshProcess()
  }

  pause() {
    clearInterval(this._refreshProcessId)
    this._refreshProcessId = null
  }

  resume() {
    this._initializeRefreshProcess()
  }

  _initializeBirds(birdNum) {
    return [...new Array(birdNum)].map(() => new Bird())
  }

  _initializeRefreshProcess() {
    this._refreshProcessId = setInterval(() => {
      this._update(Interval)
    }, Interval)
  }

  _update(ms) {
    if (this.gameover) {
      this._evolve()
      this._restart()
      return
    }

    this._updatePipes(ms)
    this._updateBirds(ms)
  }

  _updatePipes(ms) {
    // initialize pipe
    if (this._pipes.length === 0) {
      this._pipes.push(new Pipe(Width - PipeDistance))
      this._pipes.push(new Pipe())
    }
    // create pipe
    const lastPipe = this._pipes[this._pipes.length - 1]
    if (Width - lastPipe.x >= PipeDistance) {
      this._pipes.push(new Pipe())
    }
    // remove pipe
    const firstPipe = this._pipes[0]
    if (firstPipe.right <= 0) {
      this.pipes.shift()
    }
    // update pipes
    this._pipes.forEach(pipe => {
      pipe.update(ms)
    })
  }

  _updateBirds(ms) {
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
  }

  _evolve() {
    this._ga.generate()
    this._birds = this._ga.individuals
  }

  _restart() {
    this.pause()
    // reset birds and pipes
    this._birds.forEach(bird => bird.rebirth())
    this._pipes = []
    this._initializeRefreshProcess()
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
