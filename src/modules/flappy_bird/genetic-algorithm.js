import { MutationChance } from './setting.js'
export default class GeneticAlgorithm {
  constructor(individuals) {
    this._generation = 1
    this._individuals = individuals
    this._localBest = null
    this._globalBest = null
    this._globalBestGenration = 0
  }

  get individuals() { return this._individuals }

  get generation() { return this._generation }

  get localBest() { return this._localBest }

  get localBestFitness() { return this._localBest && this._localBest.fitness || 0 }

  get globalBest() { return this._globalBest }

  get globalBestFitness() { return this._globalBest && this._globalBest.fitness || 0 }

  get globalBestGeneration() { return this._globalBestGenration }

  get sumOfFitness() {
    let sum = 0
    this._individuals.forEach(individual => {
      sum += individual.fitness
    })
    return sum
  }

  generate() {
    let parent1, parent2, child
    let newIndividuals = []
    this._calculateFitness()
    const topPercent = 10
    const topN = Math.floor(this._individuals.length * topPercent / 100)

    this._individuals.sort((a, b) => a.fitness - b.fitness)
    // select top n individual and pass to next generation
    for (let i = 0; i < topN; i++) {
      newIndividuals[i] = this._individuals[i].clone()
    }
    // select best individual, have n copy and pass to next generation
    for (let i = topN; i < 2 * topN; i++) {
      newIndividuals[i] = this._individuals[0].clone()
    }
    // randomly generate rest using accept reject
    for (let i = 2 * topN; i < this._individuals.length; i++) {
      // selection
      [parent1, parent2] = this._selection()
      // crossover
      child = parent1.crossover(parent2)
      // mutation
      child.mutate(MutationChance)
      // add offspring to new population
      newIndividuals[i] = child
    }
    this._individuals = newIndividuals
    this._generation += 1
  }

  _calculateFitness() {
    this._individuals.forEach(individual => {
      if (individual.fitness > this.localBestFitness) {
        this._localBest = individual
      }
      if (individual.fitness > this.globalBestFitness) {
        this._globalBest = individual
        this._globalBestGenration = this._generation
      }
    })
  }

  _selection() {
    return [this._acceptReject(), this._acceptReject()]
  }

  _acceptReject() {
    for (;;) {
      const individual = this._individuals[Math.floor(Math.random() * this._individuals.length)]
      if (Math.random() * this.sumOfFitness <= individual.fitness) {
        return individual.clone()
      }
    }
  }
}
