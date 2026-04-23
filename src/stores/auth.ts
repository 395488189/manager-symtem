import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import type { LoginParams, User } from '@/types/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(params: LoginParams) {
    loading.value = true
    error.value = null
    try {
      const result = await loginApi(params)
      token.value = result.token
      userInfo.value = result.user
      localStorage.setItem('token', result.token)
      localStorage.setItem('userInfo', JSON.stringify(result.user))
      return result
    } catch (e: any) {
      error.value = e.message || '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  }

  function initUserInfo() {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        userInfo.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem('userInfo')
      }
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    token,
    userInfo,
    loading,
    error,
    isLoggedIn,
    login,
    logout,
    clearError,
    initUserInfo
  }
})