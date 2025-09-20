import { createRouter, createWebHistory } from 'vue-router'
import TheWelcome from '../components/TheWelcome.vue'
import Login from '@/components/login.vue'
const About = { template: '<div>关于我们页面</div>' }

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: TheWelcome
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router