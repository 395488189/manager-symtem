<template>
  <div class="layout">
    <aside class="sidebar">
      <!-- Logo 区域 -->
      <div class="logo-area">
        <div class="logo-icon">
          <el-icon><House /></el-icon>
        </div>
        <div class="logo-text">
          <span class="logo-title">医院管理系统</span>
          <span class="logo-subtitle">Hospital MS</span>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="user-area" v-if="authStore.userInfo">
        <el-avatar :size="40" :src="authStore.userInfo.avatar || undefined">
          {{ authStore.userInfo.nickname?.charAt(0) }}
        </el-avatar>
        <div class="user-info">
          <span class="user-name">{{ authStore.userInfo.nickname }}</span>
          <span class="user-role">{{ getRoleName(authStore.userInfo.role) }}</span>
        </div>
      </div>

      <!-- 菜单区域 -->
      <nav class="menu-area">
        <div class="menu-title">导航菜单</div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          :collapse="false"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>数据看板</template>
          </el-menu-item>

          <el-sub-menu index="patient">
            <template #title>
              <el-icon><User /></el-icon>
              <span>患者管理</span>
            </template>
            <el-menu-item index="/patients">患者列表</el-menu-item>
            <el-menu-item index="/records">就诊记录</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="doctor">
            <template #title>
              <el-icon><Stamp /></el-icon>
              <span>诊疗管理</span>
            </template>
            <el-menu-item index="/doctor">医生管理</el-menu-item>
            <el-menu-item index="/appointments">预约管理</el-menu-item>
            <el-menu-item index="/departments">科室管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="resource">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>物资管理</span>
            </template>
            <el-menu-item index="/medicines">药品管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="finance">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>财务统计</span>
            </template>
            <el-menu-item index="/charges">收费管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/users">用户管理</el-menu-item>
            <el-menu-item index="/logs">操作日志</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </nav>

      <!-- 底部版本信息 -->
      <div class="sidebar-footer">
        <span>v1.0.0</span>
      </div>
    </aside>

    <div class="main">
      <!-- 头部 -->
      <header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-tooltip content="全屏" placement="bottom">
            <el-icon class="header-icon"><FullScreen /></el-icon>
          </el-tooltip>
          <el-tooltip content="消息通知" placement="bottom">
            <el-badge :value="3" :max="99" class="header-badge">
              <el-icon class="header-icon"><Bell /></el-icon>
            </el-badge>
          </el-tooltip>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="authStore.userInfo?.avatar || undefined">
                {{ authStore.userInfo?.nickname?.charAt(0) }}
              </el-avatar>
              <span class="username">{{ authStore.userInfo?.nickname || '用户' }}</span>
              <el-icon class="arrow"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区域 -->
      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  House, DataAnalysis, User, Stamp, Box, Money, Setting,
  FullScreen, Bell, ArrowDown
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const activeMenu = computed(() => route.path)

const roleMap: Record<string, string> = {
  admin: '系统管理员',
  doctor: '医生',
  nurse: '护士'
}

function getRoleName(role: string) {
  return roleMap[role] || role
}

function handleCommand(command: string) {
  if (command === 'logout') {
    authStore.logout()
    ElMessage.success('已退出登录')
  } else if (command === 'profile') {
    ElMessage.info('个人中心开发中')
  } else if (command === 'settings') {
    ElMessage.info('系统设置开发中')
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

/* ============ 侧边栏 ============ */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 顶部装饰圆 */
.sidebar::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -80px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.sidebar::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -60px;
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

/* Logo 区域 */
.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  backdrop-filter: blur(10px);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logo-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  margin-top: 2px;
  letter-spacing: 1px;
}

/* 用户信息 */
.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 16px 20px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.user-role {
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  margin-top: 2px;
}

/* 菜单区域 */
.menu-area {
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  padding: 0 12px;
}

.menu-title {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 16px;
  margin-bottom: 4px;
}

/* 自定义滚动条 */
.menu-area::-webkit-scrollbar {
  width: 4px;
}

.menu-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* 菜单样式 */
.sidebar-menu {
  border: none;
  background: transparent;
  --el-menu-text-color: rgba(255, 255, 255, 0.75);
  --el-menu-hover-text-color: #fff;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.1);
  --el-menu-active-color: #fff;
  --el-menu-active-bg-color: rgba(255, 255, 255, 0.2);
  --el-menu-bg-color: transparent;
  --el-menu-item-height: 48px;
  --el-menu-sub-menu-title-height: 48px;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.75);
  border-radius: 10px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 500;
}

.sidebar-menu :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: #fff;
  border-radius: 0 3px 3px 0;
}

.sidebar-menu :deep(.el-sub-menu .el-menu-item) {
  padding-left: 52px !important;
  font-size: 13px;
  height: 42px;
  line-height: 42px;
}

.sidebar-menu :deep(.el-sub-menu__icon-arrow) {
  color: rgba(255, 255, 255, 0.5);
}

.sidebar-menu :deep(.el-icon) {
  font-size: 18px;
}

/* 底部版本 */
.sidebar-footer {
  padding: 16px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  position: relative;
  z-index: 1;
}

/* ============ 主内容区 ============ */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}

/* 头部 */
.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  transition: color 0.2s;
}

.header-icon:hover {
  color: #667eea;
}

.header-badge {
  cursor: pointer;
}

.header-badge :deep(.el-badge__content) {
  background: #f56c6c;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  color: #303133;
  font-size: 14px;
}

.arrow {
  font-size: 12px;
  color: #909399;
}

/* 内容区 */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
