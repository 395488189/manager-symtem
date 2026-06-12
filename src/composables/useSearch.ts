import { ref, reactive, computed, type Ref, type Reactive } from 'vue'

export interface SearchField {
  key: string
  label?: string
  type?: 'input' | 'select' | 'date' | 'daterange'
  placeholder?: string
  options?: { label: string; value: any }[]
  width?: string | number
}

export interface UseSearchReturn<T> {
  searchForm: Reactive<T>
  isSearching: Ref<boolean>
  hasSearchParams: Ref<boolean>
  handleSearch: () => void
  handleReset: (defaultValues?: Partial<T>) => void
  getSearchParams: () => T
}

/**
 * 搜索逻辑 composable
 */
export function useSearch<T extends Record<string, any>>(
  defaultValues: T,
  onSearch?: (params: T) => void,
  onReset?: () => void
): UseSearchReturn<T> {
  const searchForm = reactive<T>({ ...defaultValues }) as Reactive<T>
  const isSearching = ref(false)

  // 是否有搜索参数
  const hasSearchParams = computed(() => {
    return Object.values(searchForm).some(v => {
      if (v === '' || v === null || v === undefined) return false
      return true
    })
  })

  function handleSearch() {
    isSearching.value = true
    onSearch?.(getSearchParams())
    // 模拟搜索延迟
    setTimeout(() => {
      isSearching.value = false
    }, 300)
  }

  function handleReset(newDefaults?: Partial<T>) {
    Object.keys(searchForm).forEach(key => {
      (searchForm as any)[key] = (newDefaults as any)?.[key] ?? (defaultValues as any)[key] ?? ''
    })
    onReset?.()
  }

  function getSearchParams(): T {
    return { ...searchForm } as T
  }

  return {
    searchForm,
    isSearching,
    hasSearchParams,
    handleSearch,
    handleReset,
    getSearchParams
  }
}

/**
 * 防抖搜索 composable
 */
export function useDebounceSearch<T extends Record<string, any>>(
  defaultValues: T,
  onSearch: (params: T) => void,
  delay = 300
) {
  const searchForm = reactive<T>({ ...defaultValues }) as Reactive<T>
  let timer: ReturnType<typeof setTimeout> | null = null

  function debouncedSearch() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      onSearch({ ...searchForm } as T)
    }, delay)
  }

  function handleReset() {
    Object.keys(searchForm).forEach(key => {
      (searchForm as any)[key] = (defaultValues as any)[key] ?? ''
    })
    onSearch({ ...searchForm } as T)
  }

  function getSearchParams(): T {
    return { ...searchForm } as T
  }

  return {
    searchForm,
    debouncedSearch,
    handleReset,
    getSearchParams
  }
}