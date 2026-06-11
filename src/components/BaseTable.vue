<template>
  <div class="base-table">
    <el-table
      :data="data"
      :loading="loading"
      stripe
      border
      style="width: 100%"
      v-bind="$attrs"
    >
      <slot></slot>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-wrapper">
      <el-pagination
        background
        :layout="paginationLayout"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: any[]
  loading?: boolean
  showPagination?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  paginationLayout?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showPagination: true,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper'
})

const emit = defineEmits<{
  'update:pageSize': [size: number]
  'update:currentPage': [page: number]
  'page-change': [page: number]
  'size-change': [size: number]
}>()

function handleSizeChange(size: number) {
  emit('update:pageSize', size)
  emit('size-change', size)
}

function handlePageChange(page: number) {
  emit('update:currentPage', page)
  emit('page-change', page)
}
</script>

<style scoped>
.base-table {
  width: 100%;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
</style>