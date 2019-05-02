<template>
  <div class="board-container">
    <div class="board" :style="boardStyle">
      <div
        class="bird"
        v-for="bird in birds"
        :style="bird.style"
      ></div>

      <div
        class="pipe"
        v-for="pipe in pipes"
        :style="pipe.style"
      >
        <div class="pipe-top" :style="pipe.topStyle"></div>
        <div class="pipe-bottom" :style="pipe.bottomStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Width, Height } from '../modules/flappy_bird/setting.js'
import Bird from '../modules/flappy_bird/bird.js'
import Pipe from '../modules/flappy_bird/pipe.js'

export default {
  data() {
    return {
      birds: [],
      pipes: [],
      closestPipe: null,
      started: false,
      interval: 20
    }
  },
  computed: {
    boardStyle() {
      return {
        width: Width + 'px',
        height: Height + 'px'
      }
    }
  },
  created() {
    let bird = new Bird()
    this.birds.push(bird)
    this.initializePipes()
    window.addEventListener('keyup', this.onKeydown)
  },
  methods: {
    initializePipes() {
      let pipe = new Pipe()
      this.pipes.push(pipe)
      setInterval(() => {
        let pipe = new Pipe()
        this.pipes.push(pipe)
      }, 3000)
    },
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
      const id = setInterval(() => {
        this.birds.forEach((bird, i) => {
          bird.update(this.interval)
          this.closestPipe = this.getClosestPipe()
          if (bird.hit(this.closestPipe)) {
            bird.die()
          }
        })
        this.pipes.forEach(pipe => {
          pipe.update(this.interval)
        })
      }, this.interval)
    },
    getClosestPipe() {
      const x = (new Bird()).x
      let closest = this.pipes[0]
      let distance = Math.abs(closest.x - x)
      this.pipes.forEach(pipe => {
        if (Math.abs(pipe.x - x) < distance) {
          closest = pipe
        }
      })
      return closest
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
