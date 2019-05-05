<template>
  <div class="container">
    <div class="control-bar">
      <div>
        <v-btn color="warning" disabled>Speed: {{ speed }}</v-btn>
        <v-btn color="info" v-model="speed" @click="speed = 1">1x</v-btn>
        <v-btn color="info" v-model="speed" @click="speed = 2">2x</v-btn>
        <v-btn color="info" v-model="speed" @click="speed = 4">4x</v-btn>
        <v-btn color="info" v-model="speed" @click="speed = 8">8x</v-btn>
      </div>
      <div>
        <v-btn color="success" @click="loadJSON()">Load Pre-trained Model</v-btn>
        <v-btn color="success" @click="exportJSON()">Export Current Best Model</v-btn>
      </div>
    </div>
    <div class="board-container">
      <div class="board" :style="game.style">
        <div
          class="bird"
          v-for="(bird, i) in game.birds"
          :key="'bird-' + i"
          v-show="bird.live"
          :style="bird.style"
          >{{ i }}</div>

        <div
          class="pipe"
          v-for="(pipe, i) in game.pipes"
          :key="'pipe-' + i"
          :style="pipe.style"
        >
          <div class="pipe-top" :style="pipe.topStyle"></div>
          <div class="pipe-bottom" :style="pipe.bottomStyle"></div>
        </div>
      </div>

      <div class="status">
        <div class="status-info">
          Current Generation: {{ game.ga.generation }}
        </div>
        <div class="status-info">
          Best Generation: {{ game.ga.globalBestGeneration }}
        </div>
        <div class="status-info">
          Best Fitness: {{ game.ga.globalBestFitness }}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fitness</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bird-status"
              v-for="(bird, i) in game.birds"
              :key="'fitness-' + i"
              v-show="bird.live"
            >
              <td>{{ i }}</td>
              <td>{{ bird.fitness }}</td>
              <td>{{ bird.dead ? 'Dead' : 'Live' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { BirdNum, SpeedFactor } from '../modules/flappy_bird/setting.js'
import BrainJSON from '../modules/flappy_bird/best.json'
import Game from '../modules/flappy_bird/game.js'

export default {
  data() {
    return {
      speed: SpeedFactor,
      game: null
    }
  },
  created() {
    this.game = new Game(BirdNum)
    window.addEventListener('keyup', this.onKeydown)
  },
  watch: {
    speed(val) {
      this.game.speed = val
    }
  },
  methods: {
    onKeydown(e) {
      switch(e.code) {
        case 'Space':
          this.game.paused ? this.game.resume() : this.game.pause()
          break
        default:
          if (!this.game.started) this.game.start()
          break
      }
    },
    loadJSON() {
      this.game.load(BrainJSON)
      if (!this.game.started) this.game.start()
    },
    exportJSON() {
      const bestBird = this.game.bestBird
      console.log(bestBird.brain.toJSON(), bestBird.fitness)
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.control-bar {
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  display: flex;
}

.board-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.board {
  background-color: black;
  position: relative;
}

.status {
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  z-index: 1;
  background-color: white;
  padding: 0 20px;
}

.status-info {
  text-align: left;
}

.bird {
  border-radius: 50%;
  background-color: white;
  position: absolute;
}

.pipe {
  height: 100%;
  position: absolute;
}

.pipe-top {
  top: 0;
  position: absolute;
  background-color: white;
}

.pipe-bottom {
  bottom: 0;
  position: absolute;
  background-color: white;
}
</style>
