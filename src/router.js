import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./components/Home.vue')
    },
    {
      path: '/genetic-algorithm',
      name: 'Genetic Algorithm',
      component: () => import('./components/GeneticAlgorithm.vue')
    }
  ]
})
