<template>
  <div class="patient-page">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="searchForm.idCard" placeholder="请输入身份证" clearable />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="searchForm.phone" placeholder="请输入电话" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="正常" />
            <el-option label="住院中" value="住院中" />
            <el-option label="已出院" value="已出院" />
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
        v-loading="loading"
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
        <el-button type="primary" @click="handleSubmit">确定</el-button>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Patient {
  id: number
  name: string
  gender: string
  age: number
  idCard: string
  phone: string
  address: string
  status: string
  createTime: string
}

const loading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('新增患者')
const formRef = ref<FormInstance>()
const currentRow = ref<Patient | null>(null)
const isEdit = ref(false)

const searchForm = reactive({
  name: '',
  idCard: '',
  phone: '',
  status: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

const formData = reactive<Partial<Patient>>({
  name: '',
  gender: '男',
  age: 18,
  idCard: '',
  phone: '',
  address: '',
  status: '正常'
})

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

// Mock 数据
const allData = reactive<Patient[]>([
  { id: 1, name: '张三', gender: '男', age: 45, idCard: '110101199001011234', phone: '13800138001', address: '北京市朝阳区建国路88号', status: '正常', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '李四', gender: '女', age: 32, idCard: '310101199201022345', phone: '13900139002', address: '上海市浦东新区世纪大道100号', status: '住院中', createTime: '2024-02-20 14:20:00' },
  { id: 3, name: '王五', gender: '男', age: 58, idCard: '440101198801033456', phone: '13700137003', address: '广州市天河区天河路123号', status: '已出院', createTime: '2024-03-10 09:15:00' },
  { id: 4, name: '赵六', gender: '女', age: 28, idCard: '510101199601044567', phone: '13600136004', address: '成都市武侯区科华北路66号', status: '正常', createTime: '2024-04-05 16:45:00' },
  { id: 5, name: '钱七', gender: '男', age: 67, idCard: '320101195901055678', phone: '13500135005', address: '南京市鼓楼区中山北路200号', status: '住院中', createTime: '2024-05-12 11:00:00' },
  { id: 6, name: '孙八', gender: '女', age: 41, idCard: '210101198301066789', phone: '13400134006', address: '沈阳市和平区太原街150号', status: '正常', createTime: '2024-06-18 08:30:00' },
  { id: 7, name: '周九', gender: '男', age: 35, idCard: '330101198901077890', phone: '13300133007', address: '杭州市西湖区文一路80号', status: '已出院', createTime: '2024-07-22 15:20:00' },
  { id: 8, name: '吴十', gender: '女', age: 52, idCard: '420101197201088901', phone: '13200132008', address: '武汉市江汉区解放大道688号', status: '正常', createTime: '2024-08-30 10:00:00' },
])

// 过滤后数据
const filteredData = computed(() => {
  return allData.filter(item => {
    const nameMatch = !searchForm.name || item.name.includes(searchForm.name)
    const idCardMatch = !searchForm.idCard || item.idCard.includes(searchForm.idCard)
    const phoneMatch = !searchForm.phone || item.phone.includes(searchForm.phone)
    const statusMatch = !searchForm.status || item.status === searchForm.status
    return nameMatch && idCardMatch && phoneMatch && statusMatch
  })
})

// 分页数据
const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function getStatusType(status: string) {
  const map: Record<string, string> = {
    '正常': 'success',
    '住院中': 'warning',
    '已出院': 'info'
  }
  return map[status] || 'info'
}

function handleSearch() {
  pagination.currentPage = 1
}

function handleReset() {
  searchForm.name = ''
  searchForm.idCard = ''
  searchForm.phone = ''
  searchForm.status = ''
  pagination.currentPage = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.currentPage = 1
}

function handlePageChange(page: number) {
  pagination.currentPage = page
}

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增患者'
  resetForm()
  dialogVisible.value = true
}

function handleEdit(row: Patient) {
  isEdit.value = true
  dialogTitle.value = '编辑患者'
  Object.assign(formData, row)
  dialogVisible.value = true
}

function handleView(row: Patient) {
  currentRow.value = row
  detailVisible.value = true
}

function handleDelete(row: Patient) {
  ElMessageBox.confirm(`确定要删除患者「${row.name}」吗？此操作不可恢复。`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑
        const index = allData.findIndex(item => item.id === formData.id)
        if (index > -1) {
          Object.assign(allData[index], formData)
          ElMessage.success('修改成功')
        }
      } else {
        // 新增
        const newId = Math.max(...allData.map(item => item.id)) + 1
        allData.unshift({
          id: newId,
          name: formData.name || '',
          gender: formData.gender || '男',
          age: formData.age || 18,
          idCard: formData.idCard || '',
          phone: formData.phone || '',
          address: formData.address || '',
          status: formData.status || '正常',
          createTime: new Date().toLocaleString()
        })
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}

function resetForm() {
  formData.name = ''
  formData.gender = '男'
  formData.age = 18
  formData.idCard = ''
  formData.phone = ''
  formData.address = ''
  formData.status = '正常'
}

function handleDialogClose() {
  formRef.value?.resetFields()
}

function handleExport() {
  ElMessage.info('导出功能开发中...')
}
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
