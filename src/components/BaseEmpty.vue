<template>
  <div class="base-empty">
    <el-empty :image-size="imageSize" :description="description">
      <slot></slot>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description?: string
  imageSize?: number
}

withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  imageSize: 120
})
</script>

<style scoped>
.base-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 0;
}
</style>