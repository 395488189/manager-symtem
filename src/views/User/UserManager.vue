<template>
  <div class="user-page">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon> 新增用户
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="paginatedData" stripe border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="department" label="所属科室" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-text="启用" inactive-text="停用" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="160" />
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
          :total="allData.length"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="系统管理员" value="系统管理员" />
            <el-option label="科室主任" value="科室主任" />
            <el-option label="医生" value="医生" />
            <el-option label="护士" value="护士" />
            <el-option label="收费员" value="收费员" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="所属科室" prop="department">
          <el-select v-model="formData.department" placeholder="请选择科室" style="width: 100%">
            <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="初始密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入初始密码" show-password />
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

interface User {
  id: number
  username: string
  name: string
  role: string
  phone: string
  email: string
  department: string
  status: boolean
  lastLogin: string
}

const departments = ['心内科', '神经内科', '儿科', '骨科', '消化内科', '内分泌科', '皮肤科', '行政部']
const pagination = reactive({ currentPage: 1, pageSize: 10 })
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const formData = reactive<{ id?: number; username: string; name: string; role: string; phone: string; email: string; department: string; password: string }>({
  username: '', name: '', role: '', phone: '', email: '', department: '', password: ''
})

const formRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }]
}

const allData = reactive<User[]>([
  { id: 1, username: 'admin', name: '系统管理员', role: '系统管理员', phone: '13800138001', email: 'admin@hospital.com', department: '行政部', status: true, lastLogin: '2024-04-20 09:30:00' },
  { id: 2, username: 'chenxy', name: '陈晓燕', role: '科室主任', phone: '13800138002', email: 'chenxy@hospital.com', department: '心内科', status: true, lastLogin: '2024-04-20 08:00:00' },
  { id: 3, username: 'libw', name: '李博文', role: '医生', phone: '13800138003', email: 'libw@hospital.com', department: '神经内科', status: true, lastLogin: '2024-04-19 18:00:00' },
  { id: 4, username: 'wangkx', name: '王可欣', role: '医生', phone: '13800138004', email: 'wangkx@hospital.com', department: '儿科', status: true, lastLogin: '2024-04-20 07:30:00' },
  { id: 5, username: 'liujm', name: '刘建明', role: '医生', phone: '13800138005', email: 'liujm@hospital.com', department: '骨科', status: false, lastLogin: '2024-04-15 10:00:00' },
  { id: 6, username: 'zhangyq', name: '张雅琴', role: '护士', phone: '13800138006', email: 'zhangyq@hospital.com', department: '皮肤科', status: true, lastLogin: '2024-04-20 08:15:00' },
  { id: 7, username: 'guow', name: '郭伟', role: '医生', phone: '13800138007', email: 'guow@hospital.com', department: '消化内科', status: true, lastLogin: '2024-04-19 17:45:00' },
  { id: 8, username: 'sunxl', name: '孙晓丽', role: '收费员', phone: '13800138008', email: 'sunxl@hospital.com', department: '收费处', status: true, lastLogin: '2024-04-20 09:00:00' },
])

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return allData.slice(start, start + pagination.pageSize)
})

function getRoleType(role: string) {
  const map: Record<string, string> = { '系统管理员': 'danger', '科室主任': 'warning', '医生': 'success', '护士': 'info', '收费员': '' }
  return map[role] || 'info'
}

function handleSizeChange(size: number) { pagination.pageSize = size; pagination.currentPage = 1 }
function handlePageChange(page: number) { pagination.currentPage = page }

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  Object.assign(formData, { username: '', name: '', role: '', phone: '', email: '', department: '', password: '' })
  dialogVisible.value = true
}

function handleEdit(row: User) {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  Object.assign(formData, row)
  dialogVisible.value = true
}

function handleDelete(row: User) {
  ElMessageBox.confirm(`确定要删除用户「${row.name}」吗？`, '删除确认').then(() => {
    const index = allData.findIndex(u => u.id === row.id)
    if (index > -1) { allData.splice(index, 1); ElMessage.success('删除成功') }
  }).catch(() => {})
}

function handleStatusChange(row: User) {
  console.log(row)
  ElMessage.success(`用户已${row.status ? '启用' : '停用'}`)
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      if (isEdit.value && formData.id) {
        const index = allData.findIndex(u => u.id === formData.id)
        if (index > -1) {
          const target = allData[index]
          if (target) {
            Object.assign(target, formData)
            ElMessage.success('修改成功')
          }
        }
      } else {
        const newId = Math.max(...allData.map(u => u.id)) + 1
        allData.push({ id: newId, status: true, lastLogin: '-', ...formData })
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.user-page { padding: 16px; }
.toolbar { margin-bottom: 16px; display: flex; gap: 10px; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px; }
</style>
