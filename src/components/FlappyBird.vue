<template>
  <div class="board-container">
    <div class="board" :style="game.style">
      <div
        class="bird"
        v-for="(bird, i) in game.birds"
        :key="'bird-' + i"
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
  </div>
</template>

<script>
import Game from '../modules/flappy_bird/game.js'

export default {
  data() {
    return {
      birdNum: 1,
      game: new Game(this.birdNum)
    }
  },
  created() {
    window.addEventListener('keyup', this.onKeydown)
  },
  methods: {
    onKeydown(e) {
      switch(e.code) {
        case 'Space':
          if (!this.game.started) this.game.start()
          this.game.birds.forEach(bird => bird.up())
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
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.board {
  background-color: black;
  position: relative;
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
