import { defineStore } from 'pinia'
import { ref } from 'vue'
import { patientApi } from '@/api/modules/patient'
import type { Patient, PatientQuery } from '@/types'

export const usePatientStore = defineStore('patient', () => {
  // 状态
  const list = ref<Patient[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // 查询参数
  const queryParams = ref<PatientQuery>({
    page: 1,
    pageSize: 10,
    name: '',
    idCard: '',
    phone: '',
    status: undefined as any
  })

  // 加载数据
  async function fetchList(params?: Partial<PatientQuery>) {
    // 合并参数
    if (params) {
      queryParams.value = { ...queryParams.value, ...params }
    }

    loading.value = true
    error.value = null

    try {
      const result = await patientApi.getList(queryParams.value)
      list.value = result.list
      total.value = result.total
    } catch (e: any) {
      error.value = e.message || '获取患者列表失败'
      list.value = []
    } finally {
      loading.value = false
    }
  }

  // 获取详情
  async function fetchById(id: number): Promise<Patient | null> {
    try {
      return await patientApi.getById(id)
    } catch {
      return null
    }
  }

  // 新增
  async function create(data: Omit<Patient, 'id' | 'createTime'>): Promise<Patient | null> {
    try {
      const newPatient = await patientApi.create(data)
      list.value.unshift(newPatient)
      total.value++
      return newPatient
    } catch (e: any) {
      error.value = e.message || '新增失败'
      return null
    }
  }

  // 更新
  async function update(id: number, data: Partial<Patient>): Promise<Patient | null> {
    try {
      const updated = await patientApi.update(id, data)
      const index = list.value.findIndex(p => p.id === id)
      if (index > -1) {
        list.value[index] = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.message || '更新失败'
      return null
    }
  }

  // 删除
  async function remove(id: number): Promise<boolean> {
    try {
      await patientApi.delete(id)
      const index = list.value.findIndex(p => p.id === id)
      if (index > -1) {
        list.value.splice(index, 1)
        total.value--
      }
      return true
    } catch (e: any) {
      error.value = e.message || '删除失败'
      return false
    }
  }

  // 重置查询参数
  function resetQuery() {
    queryParams.value = {
      page: 1,
      pageSize: 10,
      name: '',
      idCard: '',
      phone: '',
      status: undefined as any
    }
  }

  // 设置分页
  function setPage(page: number) {
    queryParams.value.page = page
  }

  function setPageSize(size: number) {
    queryParams.value.pageSize = size
    queryParams.value.page = 1
  }

  return {
    // 状态
    list,
    loading,
    error,
    total,
    queryParams,
    // 方法
    fetchList,
    fetchById,
    create,
    update,
    remove,
    resetQuery,
    setPage,
    setPageSize
  }
})