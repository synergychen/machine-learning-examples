<template>
  <div class="board-container">
    <div class="board" :style="game.style">
      <div
        class="bird"
        v-for="(bird, i) in game.birds"
        :key="'bird-' + i"
        v-if="!bird.dead"
        :style="bird.style"
      ></div>

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
          >
            <td>{{ i }}</td>
            <td>{{ bird.fitness }}</td>
            <td>{{ bird.dead ? 'Dead' : 'Live' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { BirdNum } from '../modules/flappy_bird/setting.js'
import Game from '../modules/flappy_bird/game.js'

export default {
  data() {
    return {
      game: null
    }
  },
  created() {
    this.game = new Game(BirdNum)
    window.addEventListener('keyup', this.onKeydown)
  },
  methods: {
    onKeydown(e) {
      switch(e.code) {
        // case 'Space':
        //   if (!this.game.started) this.game.start()
        //   this.game.birds.forEach(bird => bird.up())
        //   break
        case 'Space':
          if (!this.game.started) this.game.start()
          break
        case 'Enter':
          this.game.paused ? this.game.resume() : this.game.pause()
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
.board-container {
  display: flex;
  flex-direction: row;
  height: 100%;
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
