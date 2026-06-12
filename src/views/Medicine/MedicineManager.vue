<template>
  <div class="medicine-page">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="药品名称">
          <el-input v-model="searchForm.name" placeholder="请输入药品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="全部" clearable style="width: 120px">
            <el-option label="西药" value="西药" />
            <el-option label="中成药" value="中成药" />
            <el-option label="中药" value="中药" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="正常" />
            <el-option label="库存不足" value="库存不足" />
            <el-option label="已停用" value="已停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon> 新增药品
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="paginatedData" stripe border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="药品名称" width="150" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            <span :class="{ 'low-stock': row.stock < row.minStock }">{{ row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" width="100" />
        <el-table-column prop="manufacturer" label="生产厂家" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row)">{{ row.stock < row.minStock ? '库存不足' : row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 20, 50]"
          :page-size="pagination.pageSize"
          :current-page="pagination.currentPage"
          :total="filteredData.length"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入药品名称" />
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="formData.spec" placeholder="如：0.5g*10片" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择" style="width: 100%">
            <el-option label="西药" value="西药" />
            <el-option label="中成药" value="中成药" />
            <el-option label="中药" value="中药" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="formData.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="formData.stock" :min="0" />
        </el-form-item>
        <el-form-item label="最低库存" prop="minStock">
          <el-input-number v-model="formData.minStock" :min="0" />
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="formData.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Medicine {
  id: number
  name: string
  spec: string
  category: string
  price: number
  stock: number
  minStock: number
  manufacturer: string
  status: string
}

const searchForm = reactive({ name: '', category: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 10 })
const dialogVisible = ref(false)
const dialogTitle = ref('新增药品')
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const formData = reactive<{ id?: number; name: string; spec: string; category: string; price: number; stock: number; minStock: number; manufacturer: string }>({
  name: '', spec: '', category: '', price: 0, stock: 0, minStock: 10, manufacturer: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
  spec: [{ required: true, message: '请输入规格', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
}

const allData = reactive<Medicine[]>([
  { id: 1, name: '阿司匹林肠溶片', spec: '100mg*30片', category: '西药', price: 15.5, stock: 500, minStock: 100, manufacturer: '拜耳医药保健有限公司', status: '正常' },
  { id: 2, name: '布洛芬缓释胶囊', spec: '0.3g*20粒', category: '西药', price: 18.0, stock: 80, minStock: 100, manufacturer: '中美天津史克制药有限公司', status: '正常' },
  { id: 3, name: '感冒灵颗粒', spec: '10g*9袋', category: '中成药', price: 12.0, stock: 300, minStock: 50, manufacturer: '三九医药股份有限公司', status: '正常' },
  { id: 4, name: '板蓝根颗粒', spec: '10g*20袋', category: '中成药', price: 16.0, stock: 200, minStock: 50, manufacturer: '广州白云山制药总厂', status: '正常' },
  { id: 5, name: '六味地黄丸', spec: '200丸', category: '中成药', price: 22.0, stock: 150, minStock: 30, manufacturer: '北京同仁堂股份有限公司', status: '正常' },
  { id: 6, name: '头孢克肟分散片', spec: '0.1g*6片', category: '西药', price: 35.0, stock: 20, minStock: 50, manufacturer: '石药集团欧意药业有限公司', status: '正常' },
  { id: 7, name: '复方甘草片', spec: '100片', category: '西药', price: 8.0, stock: 400, minStock: 100, manufacturer: '西南药业股份有限公司', status: '正常' },
  { id: 8, name: '黄芪颗粒', spec: '10g*12袋', category: '中药', price: 28.0, stock: 100, minStock: 20, manufacturer: '四川江中制药股份有限公司', status: '正常' },
])

const filteredData = computed(() => {
  return allData.filter(item => {
    const nameMatch = !searchForm.name || item.name.includes(searchForm.name)
    const catMatch = !searchForm.category || item.category === searchForm.category
    const statusMatch = !searchForm.status || (item.stock < item.minStock ? '库存不足' : item.status) === searchForm.status
    return nameMatch && catMatch && statusMatch
  })
})

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function getStatusType(row: Medicine) {
  if (row.stock < row.minStock) return 'danger'
  return 'success'
}

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { Object.assign(searchForm, { name: '', category: '', status: '' }); pagination.currentPage = 1 }
function handleSizeChange(size: number) { pagination.pageSize = size; pagination.currentPage = 1 }
function handlePageChange(page: number) { pagination.currentPage = page }

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增药品'
  Object.assign(formData, { name: '', spec: '', category: '', price: 0, stock: 0, minStock: 10, manufacturer: '' })
  dialogVisible.value = true
}

function handleEdit(row: Medicine) {
  isEdit.value = true
  dialogTitle.value = '编辑药品'
  Object.assign(formData, row)
  dialogVisible.value = true
}

function handleDelete(row: Medicine) {
  ElMessageBox.confirm(`确定要删除药品「${row.name}」吗？`, '删除确认').then(() => {
    const index = allData.findIndex(m => m.id === row.id)
    if (index > -1) { allData.splice(index, 1); ElMessage.success('删除成功') }
  }).catch(() => {})
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      if (isEdit.value && formData.id) {
        const index = allData.findIndex(m => m.id === formData.id)
        if (index > -1) {
          const target = allData[index]
          if (target) {
            Object.assign(target, formData)
            ElMessage.success('修改成功')
          }
        }
      } else {
        const newId = Math.max(...allData.map(m => m.id)) + 1
        allData.push({ id: newId, status: '正常', ...formData })
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.medicine-page { padding: 16px; }
.search-card { margin-bottom: 16px; }
.search-card :deep(.el-card__body) { padding-bottom: 0; }
.toolbar { margin-bottom: 16px; display: flex; gap: 10px; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px; }
.low-stock { color: #F56C6C; font-weight: 600; }
</style>
