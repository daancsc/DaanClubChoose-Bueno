import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Choose from '@/components/Choose'
import Result from '@/components/Result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/choose',
      name: 'choose',
      component: Choose,
      beforeEnter (to, from, next) {
        if (window.localStorage.getItem('token') !== null) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/result',
      name: 'result',
      component: Result,
      beforeEnter (to, from, next) {
        if (window.localStorage.getItem('token') !== null) {
          next()
        } else {
          next('/')
        }
      }
    }
  ]
})
