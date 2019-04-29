import Individual from './individual.js'

export default class Population {
  constructor(target, size, mutationChance) {
    this._size = size
    this._mutationChance = mutationChance
    this._generation = 0
    this._largestFitness = 0
    this._history = []

    this.setIndividualTarget(target)
    this._individuals = this.initializeIndividuals()
  }

  initializeIndividuals() {
    return [...Array(this._size)].map(() => {
      return new Individual()
    })
  }

  setIndividualTarget(target) {
    Individual.prototype.target = target
  }

  async simulate(individuals) {
    this.calculateFitness()
    while (this._largestFitness < Individual.maxFitness) {
      this.generate()
      this.updateHistory()
      await this.sleep(10)
    }
  }

  updateHistory() {
    this._history.push({
      generation: this._generation,
      fitness: this._largestFitness
    })
  }

  get history() {
    return this._history
  }

  get individuals() {
    return this._individuals
  }

  get generation() {
    return this._generation
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generate() {
    let parent1, parent2, child
    let newPopulation = []
    for (let i = 0; i < this._individuals.length; i++) {
      // selection
      [parent1, parent2] = this.selection()
      // crossover
      child = parent1.crossover(parent2)
      // mutate
      child.mutate(this._mutationChance)
      // add offspring to new population
      newPopulation[i] = child
    }
    // update population
    this._individuals = newPopulation
    // calculate fitness
    this.calculateFitness()
    this._generation += 1
  }

  calculateFitness() {
    this._largestFitness = 0
    this._individuals.forEach(individual => {
      individual.calculateFitness()
      this._largestFitness = Math.max(...[individual.fitness, this._largestFitness])
    })
  }

  selection() {
    return [this.acceptReject(), this.acceptReject()]
  }

  acceptReject() {
    while (true) {
      const individual = this._individuals[Math.floor(Math.random() * this._individuals.length)]
      if (Math.random() * Individual.maxFitness <= individual.fitness) {
        return individual.clone()
      }
    }
  }
}
