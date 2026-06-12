<template>
  <div class="patient-detail-page">
    <!-- 返回按钮 -->
    <div class="back-section">
      <el-button @click="goBack" icon="el-icon-arrow-left" type="primary" plain>
        返回患者列表
      </el-button>
    </div>

    <!-- 患者基本信息 -->
    <el-card shadow="hover" class="info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" size="small" @click="handleEdit">编辑</el-button>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="患者ID">{{ patient?.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ patient?.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ patient?.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ patient?.age }}岁</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ patient?.idCard }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ patient?.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ patient?.address }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(patient?.status || '')">{{ patient?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="建档时间">{{ patient?.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 就诊记录 -->
    <el-card shadow="hover" class="info-card">
      <template #header>
        <div class="card-header">
          <span>就诊记录</span>
        </div>
      </template>
      <el-table :data="medicalRecords" stripe border>
        <el-table-column prop="id" label="病历号" width="120" />
        <el-table-column prop="visitDate" label="就诊日期" width="120" />
        <el-table-column prop="department" label="科室" width="100" />
        <el-table-column prop="doctorName" label="医生" width="100" />
        <el-table-column prop="diagnosis" label="诊断" min-width="150" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewRecord(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const patientId = computed(() => route.params.id as string)

// Mock 患者数据
const patientMap: Record<string, any> = {
  '1': { id: 1, name: '张三', gender: '男', age: 45, idCard: '110101199001011234', phone: '13800138001', address: '北京市朝阳区建国路88号', status: '正常', createTime: '2024-01-15 10:30:00' },
  '2': { id: 2, name: '李四', gender: '女', age: 32, idCard: '310101199201022345', phone: '13900139002', address: '上海市浦东新区世纪大道100号', status: '住院中', createTime: '2024-02-20 14:20:00' },
  '3': { id: 3, name: '王五', gender: '男', age: 58, idCard: '440101198801033456', phone: '13700137003', address: '广州市天河区天河路123号', status: '已出院', createTime: '2024-03-10 09:15:00' },
}

const patient = computed(() => patientMap[patientId.value])

// Mock 就诊记录
const medicalRecords = computed(() => {
  const records: Record<string, any> = {
    '1': [
      { id: 'MR2024042001', visitDate: '2024-04-20', department: '心内科', doctorName: '陈晓燕', diagnosis: '冠心病待排' },
      { id: 'MR2024031501', visitDate: '2024-03-15', department: '心内科', doctorName: '陈晓燕', diagnosis: '高血压2级' },
    ],
    '2': [
      { id: 'MR2024041801', visitDate: '2024-04-18', department: '神经内科', doctorName: '李博文', diagnosis: '偏头痛' },
    ],
    '3': [
      { id: 'MR2024041001', visitDate: '2024-04-10', department: '骨科', doctorName: '刘建明', diagnosis: '腰椎间盘突出症' },
    ]
  }
  return records[patientId.value] || []
})

function getStatusType(status: string) {
  const map: Record<string, string> = { '正常': 'success', '住院中': 'warning', '已出院': 'info' }
  return map[status] || 'info'
}

function goBack() {
  router.push('/patients')
}

function handleEdit() {
  ElMessage.info('编辑功能开发中...')
}

function handleViewRecord(_row: any) {
  ElMessage.info('查看就诊详情功能开发中...')
}
</script>

<style scoped>
.patient-detail-page {
  padding: 16px;
}

.back-section {
  margin-bottom: 16px;
}

.info-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
