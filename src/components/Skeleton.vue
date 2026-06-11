<template>
  <div class="skeleton" :style="{ height: height }">
    <div v-for="i in count" :key="i" class="skeleton-item" :style="{ width: width, marginBottom: gap }">
      <div class="skeleton-line" :style="{ height: lineHeight }"></div>
      <div v-if="showParagraph" class="skeleton-paragraph">
        <div class="skeleton-line short" :style="{ height: lineHeight }"></div>
        <div class="skeleton-line" :style="{ height: lineHeight }"></div>
        <div class="skeleton-line medium" :style="{ height: lineHeight }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  width?: string
  height?: string
  lineHeight?: string
  gap?: string
  showParagraph?: boolean
}

withDefaults(defineProps<Props>(), {
  count: 1,
  width: '100%',
  height: 'auto',
  lineHeight: '16px',
  gap: '12px',
  showParagraph: false
})
</script>

<style scoped>
.skeleton {
  width: 100%;
}

.skeleton-item {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-line {
  width: 100%;
  background: linear-gradient(90deg, #f0f2f5 25%, #e6e8eb 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-line.medium {
  width: 80%;
}

.skeleton-paragraph {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>