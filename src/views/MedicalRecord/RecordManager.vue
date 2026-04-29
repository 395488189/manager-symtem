<template>
  <div class="record-page">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="患者姓名">
          <el-input v-model="searchForm.patientName" placeholder="请输入患者姓名" clearable />
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="searchForm.department" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
        <el-form-item label="就诊日期">
          <el-date-picker v-model="searchForm.date" type="date" placeholder="选择日期" style="width: 140px" />
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
        <el-table-column prop="id" label="病历号" width="100" />
        <el-table-column prop="patientName" label="患者姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="age" label="年龄" width="60" />
        <el-table-column prop="department" label="科室" width="100" />
        <el-table-column prop="doctorName" label="接诊医生" width="100" />
        <el-table-column prop="diagnosis" label="诊断" min-width="150" show-overflow-tooltip />
        <el-table-column prop="prescription" label="处方" min-width="150" show-overflow-tooltip />
        <el-table-column prop="visitDate" label="就诊日期" width="120" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="就诊详情" width="700px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="病历号">{{ currentRow.id }}</el-descriptions-item>
        <el-descriptions-item label="就诊日期">{{ currentRow.visitDate }}</el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{ currentRow.patientName }}</el-descriptions-item>
        <el-descriptions-item label="性别/年龄">{{ currentRow.gender }} / {{ currentRow.age }}岁</el-descriptions-item>
        <el-descriptions-item label="科室">{{ currentRow.department }}</el-descriptions-item>
        <el-descriptions-item label="接诊医生">{{ currentRow.doctorName }}</el-descriptions-item>
        <el-descriptions-item label="主诉" :span="2">{{ currentRow.complaint }}</el-descriptions-item>
        <el-descriptions-item label="诊断" :span="2">{{ currentRow.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="处方" :span="2">{{ currentRow.prescription }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentRow.remark }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface Record {
  id: string
  patientName: string
  gender: string
  age: number
  department: string
  doctorName: string
  complaint: string
  diagnosis: string
  prescription: string
  remark: string
  visitDate: string
}

const departments = ['心内科', '神经内科', '儿科', '骨科', '消化内科', '内分泌科', '皮肤科']
const searchForm = reactive({ patientName: '', department: '', date: '' })
const pagination = reactive({ currentPage: 1, pageSize: 10 })
const detailVisible = ref(false)
const currentRow = ref<Record | null>(null)

const allData = reactive<Record[]>([
  { id: 'MR2024042001', patientName: '张三', gender: '男', age: 45, department: '心内科', doctorName: '陈晓燕', complaint: '胸闷、心悸一周', diagnosis: '冠心病待排', prescription: '阿司匹林肠溶片 100mg*30片\n酒石酸美托洛尔片 25mg*14片', remark: '建议一周后复诊', visitDate: '2024-04-20' },
  { id: 'MR2024042002', patientName: '李四', gender: '女', age: 32, department: '神经内科', doctorName: '李博文', complaint: '头痛、头晕半月余', diagnosis: '偏头痛', prescription: '布洛芬缓释胶囊 0.3g*20粒\n养血清脑颗粒 10g*21袋', remark: '注意休息，避免劳累', visitDate: '2024-04-20' },
  { id: 'MR2024041901', patientName: '王五', gender: '男', age: 8, department: '儿科', doctorName: '王可欣', complaint: '发热、咳嗽3天', diagnosis: '急性上呼吸道感染', prescription: '小儿氨酚黄那敏颗粒 6g*9袋\n头孢克肟干混悬剂 50mg*6袋', remark: '多饮水，体温>38.5℃时服用退热药', visitDate: '2024-04-19' },
  { id: 'MR2024041902', patientName: '赵六', gender: '女', age: 65, department: '骨科', doctorName: '刘建明', complaint: '腰痛伴左下肢麻木1月', diagnosis: '腰椎间盘突出症', prescription: '扶他林片 25mg*20片\n甲钴胺片 0.5mg*30片', remark: '建议物理治疗，定期复查', visitDate: '2024-04-19' },
  { id: 'MR2024041801', patientName: '钱七', gender: '男', age: 55, department: '消化内科', doctorName: '郭伟', complaint: '腹胀、食欲不振2周', diagnosis: '功能性消化不良', prescription: '奥美拉唑肠溶胶囊 20mg*14粒\n多潘立酮片 10mg*30片', remark: '清淡饮食，规律作息', visitDate: '2024-04-18' },
])

const filteredData = computed(() => {
  return allData.filter(item => {
    const nameMatch = !searchForm.patientName || item.patientName.includes(searchForm.patientName)
    const deptMatch = !searchForm.department || item.department === searchForm.department
    return nameMatch && deptMatch
  })
})

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { Object.assign(searchForm, { patientName: '', department: '', date: '' }); pagination.currentPage = 1 }
function handleSizeChange(size: number) { pagination.pageSize = size; pagination.currentPage = 1 }
function handlePageChange(page: number) { pagination.currentPage = page }
function handleView(row: Record) { currentRow.value = row; detailVisible.value = true }
</script>

<style scoped>
.record-page { padding: 16px; }
.search-card { margin-bottom: 16px; }
.search-card :deep(.el-card__body) { padding-bottom: 0; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px; }
</style>
