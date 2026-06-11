<template>
  <div class="patient-page">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="searchForm.idCard" placeholder="请输入身份证" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="searchForm.phone" placeholder="请输入电话" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="正常" />
            <el-option label="住院中" value="住院中" />
            <el-option label="已出院" value="已出院" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="isSearching">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon> 新增患者
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon> 导出数据
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table
        :data="paginatedData"
        stripe
        border
        style="width: 100%"
        v-loading="patientStore.loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="address" label="地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          :current-page="pagination.currentPage"
          :total="filteredData.length"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formData.age" :min="0" :max="150" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" type="textarea" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" style="width: 100%">
            <el-option label="正常" value="正常" />
            <el-option label="住院中" value="住院中" />
            <el-option label="已出院" value="已出院" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="detailVisible" title="患者详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentRow?.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentRow?.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentRow?.age }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ currentRow?.idCard }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRow?.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ currentRow?.address }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow?.status || '')">{{ currentRow?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="建档时间">{{ currentRow?.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Download, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { usePatientStore } from '@/stores/patient'
import { useSearch } from '@/composables/useSearch'
import { useConfirm } from '@/composables/useConfirm'
import type { Patient } from '@/types'

const patientStore = usePatientStore()
const { confirm: confirmAction, showSuccess, showError } = useConfirm()

// 搜索
const { searchForm, isSearching, handleSearch, handleReset: handleSearchReset, getSearchParams } = useSearch({
  name: '',
  idCard: '',
  phone: '',
  status: ''
}, async (params) => {
  await patientStore.fetchList(params)
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 过滤后数据
const filteredData = computed(() => patientStore.list)

// 分页数据
const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

// 弹窗状态
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('新增患者')
const formRef = ref<FormInstance>()
const currentRow = ref<Patient | null>(null)
const isEdit = ref(false)
const submitLoading = ref(false)

// 表单数据
const formData = reactive<Partial<Patient>>({
  name: '',
  gender: '男',
  age: 18,
  idCard: '',
  phone: '',
  address: '',
  status: '正常'
})

// 表单验证
const formRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

// 状态颜色
function getStatusType(status: string) {
  const map: Record<string, string> = {
    '正常': 'success',
    '住院中': 'warning',
    '已出院': 'info'
  }
  return map[status] || 'info'
}

// 搜索
// function handleSearch() {
//   pagination.currentPage = 1
//   patientStore.fetchList({ ...getSearchParams(), page: 1 })
// }

// 重置
function handleReset() {
  handleSearchReset()
  pagination.currentPage = 1
  patientStore.fetchList({ page: 1, pageSize: pagination.pageSize })
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.currentPage = 1
}

function handlePageChange(page: number) {
  pagination.currentPage = page
  patientStore.fetchList({ ...getSearchParams(), page })
}

// 新增
function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增患者'
  resetForm()
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: Patient) {
  isEdit.value = true
  dialogTitle.value = '编辑患者'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看
function handleView(row: Patient) {
  currentRow.value = row
  detailVisible.value = true
}

// 删除
async function handleDelete(row: Patient) {
  const confirmed = await confirmAction.confirmDelete(row.name)
  if (confirmed) {
    const success = await patientStore.remove(row.id)
    if (success) {
      showSuccess('删除成功')
    } else {
      showError(patientStore.error || '删除失败')
    }
  }
}

// 提交
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      const success = await patientStore.update(formData.id!, formData)
      if (success) {
        showSuccess('修改成功')
        dialogVisible.value = false
      } else {
        showError(patientStore.error || '修改失败')
      }
    } else {
      const success = await patientStore.create(formData as Omit<Patient, 'id' | 'createTime'>)
      if (success) {
        showSuccess('新增成功')
        dialogVisible.value = false
      } else {
        showError(patientStore.error || '新增失败')
      }
    }
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
function resetForm() {
  formData.name = ''
  formData.gender = '男'
  formData.age = 18
  formData.idCard = ''
  formData.phone = ''
  formData.address = ''
  formData.status = '正常'
}

// 弹窗关闭
function handleDialogClose() {
  formRef.value?.resetFields()
}

// 导出
function handleExport() {
  showSuccess('导出功能开发中...')
}

// 初始化
onMounted(() => {
  patientStore.fetchList({ page: 1, pageSize: pagination.pageSize })
})
</script>

<style scoped>
.patient-page {
  padding: 16px;
}

.search-card {
  margin-bottom: 16px;
}

.search-card :deep(.el-card__body) {
  padding-bottom: 0;
}

.search-form {
  margin-bottom: -12px;
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}

.table-card :deep(.el-card__body) {
  padding: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
</style>