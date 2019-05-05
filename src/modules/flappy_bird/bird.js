import {
  BirdHeight,
  BirdWidth,
  BirdX,
  DeltaSpeed,
  Gravity,
  Height,
  Width,
  NetworkInputs,
  NetworkHidden,
  NetworkOutputs
} from './setting.js'
import Game from './game.js'
import { Network, Architect } from 'synaptic'

export default class Bird {
  constructor(brain = null) {
    this._x = BirdX
    this._y = Height / 2
    this._speed = 0
    this._died = false
    this._fitness = 0
    this._brain = this._initializeBrain(brain)
  }

  get x() { return this._x }

  get y() { return this._y }

  get width() { return BirdWidth }

  get height() { return BirdHeight }

  get brain() { return this._brain }

  get style() {
    return {
      width: BirdWidth + 'px',
      height: BirdHeight + 'px',
      marginLeft: -BirdWidth / 2 + 'px',
      marginBottom: -BirdHeight / 2 + 'px',
      lineHeight: BirdHeight + 'px',
      left: this._x + 'px',
      bottom: this._y + 'px'
    }
  }

  get dead() { return this._died }

  get live() { return !this._died }

  get fitness() { return this._fitness }

  set fitness(val) { this._fitness = val }

  up() {
    this._speed = DeltaSpeed
  }

  think(pipe) {
    const inputs = [
      // vertical distance
      (this._y - pipe.yMiddle) / Height,
      // horizontal distance
      (pipe.right - this._x) / Width
    ]
    const outputs = this._brain.activate(inputs)
    if (outputs[0] > 0.5) {
      this.up()
    }
  }

  rebirth() {
    this._x = BirdX
    this._y = Height / 2
    this._speed = 0
    this._died = false
    this._fitness = 0
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
    // update fitness
    this._fitness += Game.speedFactor
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
  }

  // genetic algorithm
  crossover(bird) {
    let brain1JSON = this._brain.toJSON()
    let brain2JSON = bird.brain.toJSON()
    const neuronLength = brain1JSON.neurons.length
    const cutPoint = Math.floor(Math.random() * neuronLength)
    for (let i = cutPoint; i < neuronLength; i++) {
      [brain1JSON.neurons[i].bias, brain2JSON.neurons[i].bias] =
        [brain2JSON.neurons[i].bias, brain1JSON.neurons[i].bias]
    }
    const childBrainJSON = Math.random() > 0.5 ? brain1JSON : brain2JSON
    const childBrain = Network.fromJSON(childBrainJSON)
    return new Bird(childBrain)
  }

  mutate(chance) {
    if (Math.random() > chance) return

    let brainJSON = this._brain.toJSON()
    for (let i = 0; i < brainJSON.neurons.length; i++) {
      brainJSON.neurons[i].bias *= this._mutationFactor()
    }
    for (let i = 0; i < brainJSON.connections.length; i++) {
      brainJSON.connections[i].weight *= this._mutationFactor()
    }
    this._brain = Network.fromJSON(brainJSON)
  }

  clone() {
    let bird = new Bird(this._brain)
    bird.fitness = this._fitness
    return bird
  }

  _initializeBrain(brain = null) {
    if (brain) {
      return Network.fromJSON(brain.toJSON())
    } else {
      return new Architect.Perceptron(
        NetworkInputs, NetworkHidden, NetworkOutputs
      )
    }
  }

  _reachedTop() {
    return this._y + BirdHeight / 2 > Height
  }

  _reachedBottom() {
    return this._y - BirdHeight / 2 < 0
  }

  _mutationFactor() {
    return 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5))
  }
}
