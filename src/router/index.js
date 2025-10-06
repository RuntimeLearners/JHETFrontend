import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/login.vue'
import Firstpage from '@/pages/firstpage.vue'
import Feedbackpage from '@/pages/feedbackpage.vue'
import InformationPage from '@/pages/information.vue'  // 修正这里！
import info from '@/pages/info.vue'
import AdminPage from '@/pages/admin.vue'  // 修正这里！
import MainPage from '@/pages/mainpage.vue'  // 修正这里！


// 简单的关于页面组件
const About = { 
  template: '<div style="padding: 20px; text-align: center;"><h1>关于我们</h1><p>这是关于我们页面</p></div>' 
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/firstpage',
    name: 'Firstpage',
    component: Firstpage
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedbackpage
  },
  {
    path: '/user', 
    name: 'User', 
    component: InformationPage  
  },
   {
    path: '/mainpage', 
    name: 'mainpage', 
    component: AdminPage  
  },
   {
    path: '/admin', 
    name: 'admin', 
    component: MainPage  
  },
  {
    path: '/info',
    name: 'info',
    component: info // 确保你已经导入了 info 组件
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router