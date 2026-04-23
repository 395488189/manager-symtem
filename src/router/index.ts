import {createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
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
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '数据可视化' }
      },
      {
        path: 'patients',
        name: 'Patients',
        component: () => import('../views/Patient/PatientManager.vue'),
        meta: { title: '患者列表' }
      },
      {
        path: 'patients/:id',
        name: 'PatientDetail',
        component: () => import('../views/Patient/PatientDetail.vue'),
        meta: { title: '患者详情' }
      },
      {
        path: 'records',
        name: 'Records',
        component: () => import('../views/MedicalRecord/RecordManager.vue'),
        meta: { title: '就诊记录' }
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
      {
        path: 'appointments',
        name: 'Appointments',
        component: () => import('../views/Appointment/AppointmentManager.vue'),
        meta: { title: '预约管理' }
      },
      {
        path: 'departments',
        name: 'Departments',
        component: () => import('../views/Department/DepartmentManager.vue'),
        meta: { title: '科室管理' }
      },
      {
        path: 'medicines',
        name: 'Medicines',
        component: () => import('../views/Medicine/MedicineManager.vue'),
        meta: { title: '药品管理' }
      },
      {
        path: 'charges',
        name: 'Charges',
        component: () => import('../views/Charge/ChargeManager.vue'),
        meta: { title: '收费管理' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/User/UserManager.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('../views/Log/LogManager.vue'),
        meta: { title: '操作日志' }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router