<template>
  <div class="error-view">
    <div class="error-content">
      <el-icon class="error-icon" :color="color">
        <component :is="icon" />
      </el-icon>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-desc">{{ description }}</p>
      <slot>
        <el-button type="primary" @click="handleRetry" v-if="showRetry">
          重试
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'

interface Props {
  type?: 'error' | 'warning' | '403' | '404' | '500'
  title?: string
  description?: string
  showRetry?: boolean
  onRetry?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  title: '出错了',
  description: '请稍后重试或联系管理员',
  showRetry: false
})

const iconMap: Record<string, any> = {
  error: CircleCloseFilled,
  warning: WarningFilled,
  '403': WarningFilled,
  '404': WarningFilled,
  '500': WarningFilled
}

const titleMap: Record<string, string> = {
  '403': '无权限访问',
  '404': '页面不存在',
  '500': '服务器错误'
}

const descriptionMap: Record<string, string> = {
  '403': '您没有权限访问该页面，请联系管理员',
  '404': '您访问的页面不存在或已被删除',
  '500': '服务器发生错误，请稍后重试'
}

const icon = computed(() => iconMap[props.type] || CircleCloseFilled)
const color = computed(() => props.type === 'warning' ? '#E6A23C' : '#F56C6C')

function handleRetry() {
  props.onRetry?.()
}
</script>

<style scoped>
.error-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 20px;
}

.error-content {
  text-align: center;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.error-desc {
  font-size: 14px;
  color: #909399;
  margin: 0 0 24px;
}
</style>