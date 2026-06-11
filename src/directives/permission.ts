import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

/**
 * 权限指令 v-permission="['admin', 'doctor']"
 * 用于控制元素的显示/隐藏
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string[]>) {
    const authStore = useAuthStore()
    const { value } = binding

    if (!value || !Array.isArray(value)) {
      return
    }

    const hasPermission = value.includes(authStore.userInfo?.role as UserRole)

    if (!hasPermission) {
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<string[]>) {
    const authStore = useAuthStore()
    const { value, oldValue } = binding

    if (JSON.stringify(value) === JSON.stringify(oldValue)) {
      return
    }

    if (!value || !Array.isArray(value)) {
      return
    }

    const hasPermission = value.includes(authStore.userInfo?.role as UserRole)
    el.style.display = hasPermission ? '' : 'none'
  }
}

/**
 * 权限检查函数
 */
export function checkPermission(roles: string[]): boolean {
  const authStore = useAuthStore()
  if (!authStore.userInfo?.role) return false
  return roles.includes(authStore.userInfo.role)
}