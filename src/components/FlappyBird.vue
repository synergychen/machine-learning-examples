<template>
  <div class="board-container">
    <div class="board" :style="boardStyle">
      <div
        class="bird"
        v-for="(bird, key) in birds"
        :key="key"
        :style="bird.style"
      >
      </div>
    </div>
  </div>
</template>

<script>
import Bird from '../modules/flappy_bird/bird.js'

export default {
  data() {
    return {
      width: 600,
      height: 400,
      birds: [],
      started: false
    }
  },
  computed: {
    boardStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  created() {
    let bird = new Bird(this.width / 4, this.height / 2)
    this.birds.push(bird)
    window.addEventListener('keyup', this.onKeydown)
  },
  methods: {
    onKeydown(e) {
      if (e.code === 'Space') {
        this.birds.forEach(bird => bird.up())
        if (!this.started) {
          this.refreshFrame()
        }
        this.started = true
      }
    },
    refreshFrame() {
      const interval = 20
      const id = setInterval(() => {
        this.birds.forEach(bird => bird.update(20))
        this.birds.forEach(bird => bird.check())
      }, interval)
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
</style>
