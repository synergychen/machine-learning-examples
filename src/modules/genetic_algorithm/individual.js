import Gene from './gene.js'

export default class Individual {
  constructor(genes = []) {
    this._geneLength = this.target.length
    this._genes = this.initializeGenes(genes)
    this._fitness = 0
  }

  initializeGenes(genes = []) {
    if (genes.length > 0) return genes
    return [...Array(this._geneLength)].map(() => {
      return new Gene()
    })
  }

  calculateFitness() {
    let sum = 0
    this._genes.forEach((gene, i) => {
      sum += (gene.data === this.target[i])
    })
    this._fitness = sum
  }

  crossover(individual) {
    const randPoint = this.randomPoint()
    for (let i = 0; i < this._genes.length; i++) {
      if (i < randPoint) {
        [this._genes[i], individual.genes[i]] = [individual.genes[i], this._genes[i]]
      }
    }
    this.calculateFitness
    individual.calculateFitness
    return this.fitness > individual.fitness ? this.clone() : individual.clone()
  }

  mutate(chance) {
    if (Math.random() > chance) return
    this._genes[this.randomPoint()] = new Gene()
  }

  clone() {
    return new Individual(this._genes.slice(0))
  }

  static get maxFitness() {
    return this.prototype.target.length
  }

  randomPoint() {
    return Math.floor(Math.random() * this._geneLength)
  }

  get genes() {
    return this._genes
  }

  get fitness() {
    return this._fitness
  }

  get normalizedFitness() {
    return this._fitness / Individual.maxFitness
  }

  get geneString() {
    return this._genes.map(gene => gene.data).join('')
  }
}
