import {createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue'

const routes = [ // 路由定义
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '数据可视化' }
      },
      {
        path: 'doctor',
        name: 'Doctor',
        component: () => import('../views/Doctor.vue'),
        meta: { title: '医生管理' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;