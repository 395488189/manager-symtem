<template>
  <div v-if="loading" class="global-loading">
    <div class="loading-content">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span class="loading-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Props {
  loading?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  text: '加载中...'
})
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: #fff;
  padding: 20px 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-icon {
  font-size: 24px;
  color: #667eea;
  animation: rotate 1s linear infinite;
}

.loading-text {
  color: #303133;
  font-size: 14px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>