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
        path: 'patients',
        name: 'Patients',
        component: () => import('../views/Patient/PatientManager.vue'),
        meta: { title: '患者管理' }
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
        component: () => import('../views/Doctor/DoctorManager.vue'),
        meta: { title: '医生管理' }
      },
      {
        path: 'doctor/:id',
        name: 'DoctorDetail',
        component: () => import('../views/Doctor/DoctorDetail.vue'),
        meta: { title: '医生详情' }
      },
      {
        path: 'doctor/:id/schedule',
        name: 'DoctorSchedule',
        component: () => import('../views/Doctor/DoctorSchedule.vue'),
        meta: { title: '医生排班' }
      },
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