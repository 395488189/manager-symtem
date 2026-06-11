import { ref, computed, type Ref } from 'vue'

export interface UsePaginationOptions {
  page?: number
  pageSize?: number
  total?: number
  layout?: string
  pageSizes?: number[]
}

export interface UsePaginationReturn {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  paginatedData: Ref<any[]>
  setTotal: (total: number) => void
  setData: (data: any[]) => void
  handleSizeChange: (size: number) => void
  handlePageChange: (page: number) => void
  reset: () => void
}

/**
 * 分页逻辑 composable
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    page = 1,
    pageSize = 10,
    total = 0,
    pageSizes = [10, 20, 50, 100]
  } = options

  const currentPage = ref(page)
  const pageSizeRef = ref(pageSize)
  const totalRef = ref(total)
  const dataSource = ref<any[]>([])

  // 分页后的数据
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSizeRef.value
    return dataSource.value.slice(start, start + pageSizeRef.value)
  })

  function setTotal(total: number) {
    totalRef.value = total
  }

  function setData(data: any[]) {
    dataSource.value = data
  }

  function handleSizeChange(size: number) {
    pageSizeRef.value = size
    currentPage.value = 1
  }

  function handlePageChange(page: number) {
    currentPage.value = page
  }

  function reset() {
    currentPage.value = 1
    pageSizeRef.value = pageSize
    totalRef.value = 0
    dataSource.value = []
  }

  return {
    currentPage,
    pageSize: pageSizeRef,
    total: totalRef,
    paginatedData,
    setTotal,
    setData,
    handleSizeChange,
    handlePageChange,
    reset
  }
}

/**
 * 服务端分页 composable
 * 适用于 API 返回分页数据的场景
 */
export function useServerPagination<T>(
  fetchFn: (params: { page: number; pageSize: number }) => Promise<{ list: T[]; total: number }>
) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const list = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  async function loadData() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchFn({
        page: currentPage.value,
        pageSize: pageSize.value
      })
      list.value = result.list
      total.value = result.total
    } catch (e: any) {
      error.value = e.message || '加载数据失败'
    } finally {
      loading.value = false
    }
  }

  function handleSizeChange(size: number) {
    pageSize.value = size
    currentPage.value = 1
    loadData()
  }

  function handlePageChange(page: number) {
    currentPage.value = page
    loadData()
  }

  // 初始加载
  loadData()

  return {
    loading,
    error,
    list,
    total,
    currentPage,
    pageSize,
    loadData,
    handleSizeChange,
    handlePageChange
  }
}