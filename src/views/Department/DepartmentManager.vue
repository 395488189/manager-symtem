<template>
  <div class="department-page">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon> 新增科室
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="paginatedData" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="科室名称" width="150" />
        <el-table-column prop="code" label="科室编码" width="120" />
        <el-table-column prop="head" label="科室主任" width="100" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="bedCount" label="床位数" width="100" />
        <el-table-column prop="doctorCount" label="医生数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="科室简介" min-width="200" show-overflow-tooltip />
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
        <el-form-item label="科室名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入科室名称" />
        </el-form-item>
        <el-form-item label="科室编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入科室编码" />
        </el-form-item>
        <el-form-item label="科室主任" prop="head">
          <el-input v-model="formData.head" placeholder="请输入科室主任" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="床位数" prop="bedCount">
          <el-input-number v-model="formData.bedCount" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="科室简介" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入科室简介" />
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

interface Department {
  id: number
  name: string
  code: string
  head: string
  phone: string
  bedCount: number
  doctorCount: number
  status: string
  description: string
}

const pagination = reactive({ currentPage: 1, pageSize: 10 })
const dialogVisible = ref(false)
const dialogTitle = ref('新增科室')
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const formData = reactive<{ id?: number; name: string; code: string; head: string; phone: string; bedCount: number; status: string; description: string }>({
  name: '',
  code: '',
  head: '',
  phone: '',
  bedCount: 0,
  status: '正常',
  description: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入科室编码', trigger: 'blur' }]
}

const allData = reactive<Department[]>([
  { id: 1, name: '心内科', code: 'CARD', head: '陈晓燕', phone: '010-88880001', bedCount: 50, doctorCount: 12, status: '正常', description: '主要诊治心血管系统疾病，包括冠心病、高血压、心律失常等' },
  { id: 2, name: '神经内科', code: 'NEUR', head: '李博文', phone: '010-88880002', bedCount: 45, doctorCount: 10, status: '正常', description: '诊治脑血管疾病、神经系统感染、癫痫等疾病' },
  { id: 3, name: '儿科', code: 'PEDI', head: '王可欣', phone: '010-88880003', bedCount: 40, doctorCount: 15, status: '正常', description: '诊治各种儿科常见病、多发病及疑难病症' },
  { id: 4, name: '骨科', code: 'ORTH', head: '刘建明', phone: '010-88880004', bedCount: 35, doctorCount: 8, status: '正常', description: '诊治骨折、关节疾病、脊柱疾病等' },
  { id: 5, name: '消化内科', code: 'GAST', head: '郭伟', phone: '010-88880005', bedCount: 30, doctorCount: 9, status: '正常', description: '诊治胃肠道疾病、肝胆胰疾病等' },
  { id: 6, name: '内分泌科', code: 'ENDO', head: '孙晓丽', phone: '010-88880006', bedCount: 25, doctorCount: 7, status: '正常', description: '诊治糖尿病、甲状腺疾病、代谢性疾病等' },
  { id: 7, name: '皮肤科', code: 'DERM', head: '张雅琴', phone: '010-88880007', bedCount: 20, doctorCount: 6, status: '正常', description: '诊治各种皮肤病、性病等' },
  { id: 8, name: '眼科', code: 'OPHT', head: '谭志强', phone: '010-88880008', bedCount: 15, doctorCount: 5, status: '正常', description: '诊治各种眼科疾病，开展白内障、青光眼手术等' },
])

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return allData.slice(start, start + pagination.pageSize)
})

function handleSizeChange(size: number) { pagination.pageSize = size; pagination.currentPage = 1 }
function handlePageChange(page: number) { pagination.currentPage = page }

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增科室'
  Object.assign(formData, { name: '', code: '', head: '', phone: '', bedCount: 0, status: '正常', description: '' })
  dialogVisible.value = true
}

function handleEdit(row: Department) {
  isEdit.value = true
  dialogTitle.value = '编辑科室'
  Object.assign(formData, row)
  dialogVisible.value = true
}

function handleDelete(row: Department) {
  ElMessageBox.confirm(`确定要删除科室「${row.name}」吗？`, '删除确认').then(() => {
    const index = allData.findIndex(d => d.id === row.id)
    if (index > -1) { allData.splice(index, 1); ElMessage.success('删除成功') }
  }).catch(() => {})
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      if (isEdit.value && formData.id) {
        const index = allData.findIndex(d => d.id === formData.id)
        if (index > -1) {
          const target = allData[index]
          if (target) {
            Object.assign(target, formData)
            ElMessage.success('修改成功')
          }
        }
      } else {
        const newId = Math.max(...allData.map(d => d.id)) + 1
        allData.push({ id: newId, doctorCount: 0, ...formData })
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.department-page { padding: 16px; }
.toolbar { margin-bottom: 16px; display: flex; gap: 10px; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px; }
</style>
