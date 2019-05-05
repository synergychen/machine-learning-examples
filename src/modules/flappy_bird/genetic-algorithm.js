import { MutationChance } from './setting.js'
export default class GeneticAlgorithm {
  constructor(individuals) {
    this._generation = 1
    this._individuals = individuals
    this._bestFitness = 0
  }

  get individuals() { return this._individuals }

  get generation() { return this._generation }

  get bestFitness() { return this._bestFitness }

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
    for (let i = 0; i < this._individuals.length; i++) {
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
    this._bestFitness = Math.max(...this._individuals.map(idv => idv.fitness))
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
