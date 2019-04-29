<template>
  <v-layout fluid column fill-height>
    <v-form>
      <v-container>
        <v-layout row wrap>
          <v-flex xs4>
            <v-text-field
              v-model="target"
              label="Target"
              required
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model="populationSize"
              label="Population Size"
              required
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model="mutationChance"
              label="Mutation Chance"
              required
            />
          </v-flex>
          <v-flex xs3>
            <div>Generation Result</div>
            <div v-for="(individual, key) in population.individuals" :key="key">
              {{ key }}: {{ individual.geneString }}
            </div>
          </v-flex>
          <v-flex xs9>
            <line-chart :chart-data="chartData" :options="options"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-layout>
</template>

<script>
import Population from '../modules/genetic_algorithm/population.js'
import LineChart from '../modules/charts/line-chart.js'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      target: 'hello world',
      populationSize: 50,
      mutationChance: 0.1,
      population: null,
      generations: [],
      fitnesses: [],
      options: {}
    }
  },
  created () {
    this.population = new Population(
      this.target,
      this.populationSize,
      this.mutationChance
    )
    this.population.simulate()
  },
  computed: {
    chartData () {
      if (!this.population) return
      const xData = this.population.history.map(e => e.generation)
      const yData = this.population.history.map(e => e.fitness)
      const label = 'Generation vs. Fitness'
      return {
        labels: xData,
        datasets: [
          {
            label: label,
            data: yData
          }
        ]
      }
    }
  },
  methods: {
  }
}
</script>
