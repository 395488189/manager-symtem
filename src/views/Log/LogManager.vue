<template>
  <div class="log-page">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="操作人">
          <el-input v-model="searchForm.operator" placeholder="请输入操作人" clearable />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 120px">
            <el-option label="新增" value="新增" />
            <el-option label="编辑" value="编辑" />
            <el-option label="删除" value="删除" />
            <el-option label="登录" value="登录" />
            <el-option label="退费" value="退费" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="paginatedData" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="type" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeType(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="操作模块" width="120" />
        <el-table-column prop="content" label="操作内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="userAgent" label="浏览器" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createTime" label="操作时间" width="160" />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          :current-page="pagination.currentPage"
          :total="filteredData.length"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

interface Log {
  id: number
  operator: string
  type: string
  module: string
  content: string
  ip: string
  userAgent: string
  createTime: string
}

const searchForm = reactive({ operator: '', type: '', dateRange: '' })
const pagination = reactive({ currentPage: 1, pageSize: 10 })

const allData = reactive<Log[]>([
  { id: 1, operator: 'admin', type: '登录', module: '系统', content: '用户登录成功', ip: '192.168.1.100', userAgent: 'Chrome/120.0', createTime: '2024-04-20 09:30:00' },
  { id: 2, operator: 'admin', type: '新增', module: '患者管理', content: '新增患者：张三', ip: '192.168.1.100', userAgent: 'Chrome/120.0', createTime: '2024-04-20 09:35:00' },
  { id: 3, operator: '陈晓燕', type: '编辑', module: '患者管理', content: '编辑患者李四的病历信息', ip: '192.168.1.101', userAgent: 'Firefox/120.0', createTime: '2024-04-20 10:00:00' },
  { id: 4, operator: '李博文', type: '新增', module: '预约管理', content: '为患者王五创建预约', ip: '192.168.1.102', userAgent: 'Chrome/120.0', createTime: '2024-04-20 10:15:00' },
  { id: 5, operator: 'admin', type: '删除', module: '科室管理', content: '删除科室：临时科室', ip: '192.168.1.100', userAgent: 'Chrome/120.0', createTime: '2024-04-20 11:00:00' },
  { id: 6, operator: '孙晓丽', type: '退费', module: '收费管理', content: '为患者孙八退费 ¥120', ip: '192.168.1.103', userAgent: 'Chrome/120.0', createTime: '2024-04-20 11:30:00' },
  { id: 7, operator: '王可欣', type: '编辑', module: '医生管理', content: '修改医生排班信息', ip: '192.168.1.104', userAgent: 'Safari/17.0', createTime: '2024-04-20 14:00:00' },
  { id: 8, operator: 'admin', type: '新增', module: '用户管理', content: '新增用户：test', ip: '192.168.1.100', userAgent: 'Chrome/120.0', createTime: '2024-04-20 15:00:00' },
  { id: 9, operator: '刘建明', type: '登录', module: '系统', content: '用户登录成功', ip: '192.168.1.105', userAgent: 'Edge/120.0', createTime: '2024-04-20 08:00:00' },
  { id: 10, operator: '郭伟', type: '编辑', module: '患者管理', content: '更新患者赵六的诊断信息', ip: '192.168.1.106', userAgent: 'Chrome/120.0', createTime: '2024-04-20 09:45:00' },
])

const filteredData = computed(() => {
  return allData.filter(item => {
    const opMatch = !searchForm.operator || item.operator.includes(searchForm.operator)
    const typeMatch = !searchForm.type || item.type === searchForm.type
    return opMatch && typeMatch
  })
})

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function getTypeType(type: string) {
  const map: Record<string, string> = { '新增': 'success', '编辑': 'warning', '删除': 'danger', '登录': 'info', '退费': 'warning' }
  return map[type] || 'info'
}

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { Object.assign(searchForm, { operator: '', type: '', dateRange: '' }); pagination.currentPage = 1 }
function handleSizeChange(size: number) { pagination.pageSize = size; pagination.currentPage = 1 }
function handlePageChange(page: number) { pagination.currentPage = page }
</script>

<style scoped>
.log-page { padding: 16px; }
.search-card { margin-bottom: 16px; }
.search-card :deep(.el-card__body) { padding-bottom: 0; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px; }
</style>
