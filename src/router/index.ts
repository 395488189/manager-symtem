import {createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

// 路由配置
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: 'dashboard'
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
        meta: { title: '数据可视化', roles: ['admin', 'doctor', 'nurse'] }
      },
      {
        path: 'patients',
        name: 'Patients',
        component: () => import('../views/Patient/PatientManager.vue'),
        meta: { title: '患者列表', roles: ['admin', 'doctor', 'nurse'] }
      },
      {
        path: 'patients/:id',
        name: 'PatientDetail',
        component: () => import('../views/Patient/PatientDetail.vue'),
        meta: { title: '患者详情', roles: ['admin', 'doctor', 'nurse'] }
      },
      {
        path: 'records',
        name: 'Records',
        component: () => import('../views/MedicalRecord/RecordManager.vue'),
        meta: { title: '就诊记录', roles: ['admin', 'doctor'] }
      },
      {
        path: 'doctor',
        name: 'Doctor',
        component: () => import('../views/Doctor/DoctorManager.vue'),
        meta: { title: '医生管理', roles: ['admin'] }
      },
      {
        path: 'doctor/:id',
        name: 'DoctorDetail',
        component: () => import('../views/Doctor/DoctorDetail.vue'),
        meta: { title: '医生详情', roles: ['admin', 'doctor'] }
      },
      {
        path: 'doctor/:id/schedule',
        name: 'DoctorSchedule',
        component: () => import('../views/Doctor/DoctorSchedule.vue'),
        meta: { title: '医生排班', roles: ['admin', 'doctor'] }
      },
      {
        path: 'appointments',
        name: 'Appointments',
        component: () => import('../views/Appointment/AppointmentManager.vue'),
        meta: { title: '预约管理', roles: ['admin', 'doctor', 'nurse'] }
      },
      {
        path: 'departments',
        name: 'Departments',
        component: () => import('../views/Department/DepartmentManager.vue'),
        meta: { title: '科室管理', roles: ['admin'] }
      },
      {
        path: 'medicines',
        name: 'Medicines',
        component: () => import('../views/Medicine/MedicineManager.vue'),
        meta: { title: '药品管理', roles: ['admin', 'pharmacist'] }
      },
      {
        path: 'charges',
        name: 'Charges',
        component: () => import('../views/Charge/ChargeManager.vue'),
        meta: { title: '收费管理', roles: ['admin', 'cashier'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/User/UserManager.vue'),
        meta: { title: '用户管理', roles: ['admin'] }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('../views/Log/LogManager.vue'),
        meta: { title: '操作日志', roles: ['admin'] }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 检查是否需要登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }

  // 已登录访问登录页则跳转到首页
  if (to.path === '/login' && authStore.isLoggedIn) {
    next('/')
    return
  }

  // 检查角色权限
  if (to.meta.roles && authStore.userInfo) {
    const allowedRoles = to.meta.roles as string[]
    if (!allowedRoles.includes(authStore.userInfo.role)) {
      // 无权限，跳转到首页或 403 页面
      ElMessage.warning('您没有权限访问该页面')
      next('/')
      return
    }
  }

  next()
})

export default router