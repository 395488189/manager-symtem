<template>
  <div class="doctor-page">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">医生管理</h2>
        <p class="page-desc">管理医院医生信息、值班安排</p>
      </div>
      <div class="header-actions">
        <el-input
          v-model="searchText"
          placeholder="搜索医生姓名、科室..."
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="onAddDoctor">
          <el-icon><Plus /></el-icon>
          添加医生
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card stat-total" shadow="hover">
        <div class="stat-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalDoctors }}</div>
          <div class="stat-label">医生总数</div>
        </div>
      </el-card>
      <el-card class="stat-card stat-duty" shadow="hover">
        <div class="stat-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ onDutyDoctors }}</div>
          <div class="stat-label">今日值班</div>
        </div>
      </el-card>
      <el-card class="stat-card stat-dept" shadow="hover">
        <div class="stat-icon">
          <el-icon><OfficeBuilding /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ departmentCount }}</div>
          <div class="stat-label">科室数量</div>
        </div>
      </el-card>
      <el-card class="stat-card stat-score" shadow="hover">
        <div class="stat-icon">
          <el-icon><Star /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ avgScore.toFixed(1) }}</div>
          <div class="stat-label">平均评分</div>
        </div>
      </el-card>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-bar">
      <el-tag
        :type="filterStatus === '' ? 'primary' : 'info'"
        class="filter-tag"
        @click="filterStatus = ''"
      >全部</el-tag>
      <el-tag
        :type="filterStatus === '值班' ? 'success' : 'info'"
        class="filter-tag"
        @click="filterStatus = '值班'"
      >值班中</el-tag>
      <el-tag
        :type="filterStatus === '休息' ? 'warning' : 'info'"
        class="filter-tag"
        @click="filterStatus = '休息'"
      >休息中</el-tag>
    </div>

    <!-- 医生卡片列表 -->
    <div class="doctor-grid">
      <el-card
        v-for="doctor in paginatedDoctors"
        :key="doctor.id"
        class="doctor-card"
        shadow="hover"
      >
        <div class="card-header">
          <div class="doctor-avatar">
            <img :src="doctor.avatar" :alt="doctor.name" />
            <span class="status-dot" :class="doctor.status === '值班' ? 'on-duty' : 'off-duty'"></span>
          </div>
          <div class="doctor-info">
            <h3 class="doctor-name">{{ doctor.name }}</h3>
            <div class="doctor-dept">{{ doctor.department }}</div>
          </div>
          <el-dropdown class="card-actions" @command="handleCommand($event, doctor)">
            <el-icon class="more-icon"><More /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">查看详情</el-dropdown-item>
                <el-dropdown-item command="schedule">排班管理</el-dropdown-item>
                <el-dropdown-item command="edit">编辑信息</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">所属病区</span>
            <span class="value">{{ doctor.team }}</span>
          </div>
          <div class="info-row">
            <span class="label">医生状态</span>
            <el-tag size="small" :type="doctor.status === '值班' ? 'success' : 'warning'">
              {{ doctor.status }}
            </el-tag>
          </div>
          <div class="info-row">
            <span class="label">好评率</span>
            <div class="score-box">
              <el-rate :model-value="doctor.score" disabled show-score text-color="#ff9900" size="small" />
            </div>
          </div>
        </div>

        <div class="card-footer">
          <el-button size="small" @click="openProfile(doctor)">详情</el-button>
          <el-button size="small" type="primary" @click="openSchedule(doctor)">排班</el-button>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[8, 12, 24]"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="filteredDoctors.length"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Search, Plus, User, Clock, OfficeBuilding, Star, More
} from '@element-plus/icons-vue'

interface Doctor {
  id: number
  name: string
  avatar: string
  department: string
  team: string
  status: string
  score: number
}

const router = useRouter()
const searchText = ref<string>('')
const filterStatus = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(12)

const allDoctors = reactive<Doctor[]>([
  { id: 1, name: '陈晓燕', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '心内科', team: '心血管内科一病区', status: '值班', score: 4.8 },
  { id: 2, name: '李博文', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '神经内科', team: '神经内科病区', status: '休息', score: 4.4 },
  { id: 3, name: '王可欣', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '儿科', team: '儿科病区', status: '值班', score: 4.9 },
  { id: 4, name: '刘建明', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '骨科', team: '骨科病区', status: '值班', score: 4.5 },
  { id: 5, name: '张雅琴', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '皮肤科', team: '皮肤科门诊', status: '休息', score: 4.3 },
  { id: 6, name: '郭伟', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '消化内科', team: '消化内科病区', status: '值班', score: 4.7 },
  { id: 7, name: '孙晓丽', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '内分泌科', team: '内分泌科病区', status: '值班', score: 4.6 },
  { id: 8, name: '谭志强', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '眼科', team: '眼科病区', status: '休息', score: 4.4 },
  { id: 9, name: '吴雅文', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '精神科', team: '精神卫生中心', status: '值班', score: 4.8 },
  { id: 10, name: '马超', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '放射科', team: '影像中心', status: '值班', score: 4.6 },
  { id: 11, name: '周婷婷', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '耳鼻喉科', team: '耳鼻喉科病区', status: '休息', score: 4.5 },
  { id: 12, name: '黄磊', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', department: '肾内科', team: '肾内科病区', status: '值班', score: 4.7 },
])

const filteredDoctors = computed(() => {
  let result = allDoctors

  // 搜索过滤
  if (searchText.value.trim()) {
    const q = searchText.value.toLowerCase()
    result = result.filter(doc =>
      doc.name.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) ||
      doc.team.toLowerCase().includes(q)
    )
  }

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(doc => doc.status === filterStatus.value)
  }

  return result
})

const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredDoctors.value.slice(start, start + pageSize.value)
})

const totalDoctors = computed(() => allDoctors.length)
const onDutyDoctors = computed(() => allDoctors.filter(d => d.status === '值班').length)
const departmentCount = computed(() => new Set(allDoctors.map(d => d.department)).size)
const avgScore = computed(() => {
  if (allDoctors.length === 0) return 0
  return allDoctors.reduce((sum, doc) => sum + doc.score, 0) / allDoctors.length
})

const onAddDoctor = () => {
  ElMessage({ message: '添加医生功能开发中...', type: 'info' })
}

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
}

const openProfile = (doctor: Doctor) => {
  router.push(`/doctor/${doctor.id}`)
}

const openSchedule = (doctor: Doctor) => {
  router.push(`/doctor/${doctor.id}/schedule`)
}

const handleCommand = (command: string, doctor: Doctor) => {
  switch (command) {
    case 'profile':
      openProfile(doctor)
      break
    case 'schedule':
      openSchedule(doctor)
      break
    case 'edit':
      ElMessage({ message: '编辑医生功能开发中...', type: 'info' })
      break
  }
}
</script>

<style scoped>
.doctor-page {
  padding: 0;
}

/* 页面标题区 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 280px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-total .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-duty .stat-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
.stat-dept .stat-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.stat-score .stat-icon { background: linear-gradient(135deg, #fa709a, #fee140); }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* 筛选标签 */
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-tag {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s;
}

.filter-tag:hover {
  transform: scale(1.05);
}

/* 医生卡片 */
.doctor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.doctor-card {
  border: none;
  border-radius: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.doctor-card :deep(.el-card__body) {
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;
}

.doctor-avatar {
  position: relative;
  width: 56px;
  height: 56px;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.status-dot.on-duty {
  background: #67c23a;
}

.status-dot.off-duty {
  background: #e6a23c;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.doctor-dept {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card-actions {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.card-actions:hover {
  background: #f5f7fa;
}

.more-icon {
  font-size: 18px;
  color: #909399;
}

.card-body {
  padding: 16px 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  font-size: 13px;
  color: #909399;
}

.info-row .value {
  font-size: 13px;
  color: #606266;
}

.score-box {
  display: flex;
  align-items: center;
}

.card-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #f5f5f5;
  background: #fafafa;
  border-radius: 0 0 16px 16px;
}

.card-footer .el-button {
  flex: 1;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .doctor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
