<template>
  <div class="dashboard">
    <!-- 统计卡片区 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-card stat-patients">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalPatients }}</div>
            <div class="stat-label">患者总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-visits">
          <div class="stat-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayVisits }}</div>
            <div class="stat-label">今日门诊</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-income">
          <div class="stat-icon">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">¥{{ stats.todayIncome.toLocaleString() }}</div>
            <div class="stat-label">今日收入</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-beds">
          <div class="stat-icon">
            <el-icon><House /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.bedOccupancy }}%</div>
            <div class="stat-label">床位使用率</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16" class="charts-row">
      <!-- 门诊量趋势 -->
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>门诊量趋势</span>
              <el-radio-group v-model="visitTimeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="visitChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 科室分布 -->
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>科室分布</span>
            </div>
          </template>
          <div ref="deptChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <!-- 床位使用率 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>床位使用率</span>
            </div>
          </template>
          <div ref="bedChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 就诊疾病类型 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>就诊疾病类型</span>
            </div>
          </template>
          <div ref="diseaseChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="16" class="shortcuts-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷入口</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="4" v-for="item in shortcuts" :key="item.path">
              <div class="shortcut-item" @click="router.push(item.path)">
                <el-icon class="shortcut-icon" :style="{ color: item.color }">
                  <component :is="item.icon" />
                </el-icon>
                <span class="shortcut-text">{{ item.label }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { User, Calendar, Money, House, Plus, List, Clock, Folder, Document } from '@element-plus/icons-vue'

const router = useRouter()
const visitChartRef = ref<HTMLElement>()
const deptChartRef = ref<HTMLElement>()
const bedChartRef = ref<HTMLElement>()
const diseaseChartRef = ref<HTMLElement>()

let visitChart: echarts.ECharts | null = null
let deptChart: echarts.ECharts | null = null
let bedChart: echarts.ECharts | null = null
let diseaseChart: echarts.ECharts | null = null

const visitTimeRange = ref('week')

// 统计数据
const stats = reactive({
  totalPatients: 12856,
  todayVisits: 342,
  todayIncome: 186520,
  bedOccupancy: 87
})

// 快捷入口
const shortcuts = [
  { label: '患者建档', icon: Plus, path: '/patients', color: '#409EFF' },
  { label: '患者列表', icon: List, path: '/patients', color: '#67C23A' },
  { label: '预约管理', icon: Clock, path: '/appointments', color: '#E6A23C' },
  { label: '医生管理', icon: User, path: '/doctor', color: '#F56C6C' },
  { label: '科室管理', icon: Folder, path: '/departments', color: '#909399' },
  { label: '收费明细', icon: Document, path: '/charges', color: '#0099FF' }
]

// 模拟数据
const visitData = {
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  month: ['第1周', '第2周', '第3周', '第4周'],
  year: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
}

const visitValues = {
  week: [320, 450, 380, 520, 480, 220, 180],
  month: [4200, 4800, 5100, 4600],
  year: [12000, 13500, 14800, 15200, 16800, 17200, 18500, 19200, 17800, 16500, 15200, 14800]
}

const departmentData = [
  { name: '心内科', value: 18 },
  { name: '神经内科', value: 15 },
  { name: '儿科', value: 14 },
  { name: '骨科', value: 12 },
  { name: '消化内科', value: 11 },
  { name: '内分泌科', value: 10 },
  { name: '其他', value: 20 }
]

const bedData = [
  { name: '心内科', used: 42, total: 50 },
  { name: '神经内科', used: 38, total: 45 },
  { name: '儿科', used: 35, total: 40 },
  { name: '骨科', used: 28, total: 35 },
  { name: '消化内科', used: 25, total: 30 },
  { name: '内分泌科', used: 20, total: 25 }
]

const diseaseData = [
  { name: '心血管疾病', value: 25 },
  { name: '呼吸系统', value: 20 },
  { name: '消化系统', value: 18 },
  { name: '神经系统', value: 15 },
  { name: '内分泌系统', value: 12 },
  { name: '其他', value: 10 }
]

// 初始化门诊量趋势图
function initVisitChart() {
  if (!visitChartRef.value) return
  visitChart = echarts.init(visitChartRef.value)
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['门诊量', '住院量'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: visitData[visitTimeRange.value as keyof typeof visitData],
      boundaryGap: false
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '门诊量',
        type: 'line',
        smooth: true,
        data: visitValues[visitTimeRange.value as keyof typeof visitValues],
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ]) },
        lineStyle: { color: '#409EFF' },
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '住院量',
        type: 'line',
        smooth: true,
        data: visitValues[visitTimeRange.value as keyof typeof visitValues].map(v => Math.floor(v * 0.3)),
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
        ]) },
        lineStyle: { color: '#67C23A' },
        itemStyle: { color: '#67C23A' }
      }
    ]
  }
  visitChart.setOption(option)
}

// 初始化科室分布图
function initDeptChart() {
  if (!deptChartRef.value) return
  deptChart = echarts.init(deptChartRef.value)
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { orient: 'vertical', right: '5%', top: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      data: departmentData.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#0099FF', '#B37FEB'][i] }
      }))
    }]
  }
  deptChart.setOption(option)
}

// 初始化床位使用率图
function initBedChart() {
  if (!bedChartRef.value) return
  bedChart = echarts.init(bedChartRef.value)
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', formatter: (params: any) => `${params[0].name}<br/>使用率: ${params[0].value}%` },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: bedData.map(d => d.name) },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'bar',
      data: bedData.map(d => Math.round(d.used / d.total * 100)),
      itemStyle: {
        color: (params: any) => {
          const val = params.value
          if (val >= 90) return '#F56C6C'
          if (val >= 70) return '#E6A23C'
          return '#67C23A'
        },
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '40%'
    }]
  }
  bedChart.setOption(option)
}

// 初始化疾病类型图
function initDiseaseChart() {
  if (!diseaseChartRef.value) return
  diseaseChart = echarts.init(diseaseChartRef.value)
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 12, fontWeight: 'bold' }
      },
      data: diseaseData.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#F56C6C', '#409EFF', '#E6A23C', '#67C23A', '#909399', '#0099FF'][i] }
      }))
    }]
  }
  diseaseChart.setOption(option)
}

// 监听时间范围变化
watch(visitTimeRange, () => {
  if (visitChart) {
    visitChart.setOption({
      xAxis: { data: visitData[visitTimeRange.value as keyof typeof visitData] },
      series: [
        { data: visitValues[visitTimeRange.value as keyof typeof visitValues] },
        { data: visitValues[visitTimeRange.value as keyof typeof visitValues].map(v => Math.floor(v * 0.3)) }
      ]
    })
  }
})

// 响应式
function handleResize() {
  visitChart?.resize()
  deptChart?.resize()
  bedChart?.resize()
  diseaseChart?.resize()
}

onMounted(() => {
  initVisitChart()
  initDeptChart()
  initBedChart()
  initDiseaseChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  visitChart?.dispose()
  deptChart?.dispose()
  bedChart?.dispose()
  diseaseChart?.dispose()
})
</script>

<style scoped>
.dashboard {
  padding: 16px;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
}

.stat-patients .stat-icon { background: linear-gradient(135deg, #409EFF, #66B1FF); color: #fff; }
.stat-visits .stat-icon { background: linear-gradient(135deg, #67C23A, #85CE61); color: #fff; }
.stat-income .stat-icon { background: linear-gradient(135deg, #E6A23C, #F0AF45); color: #fff; }
.stat-beds .stat-icon { background: linear-gradient(135deg, #F56C6C, #F78989); color: #fff; }

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.charts-row {
  margin-bottom: 16px;
}

.chart-card {
  height: 320px;
}

.chart-card :deep(.el-card__header) {
  padding: 12px 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chart-container {
  height: 240px;
}

.shortcuts-row :deep(.el-card__body) {
  padding: 20px;
}

.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.shortcut-item:hover {
  background: #f5f7fa;
}

.shortcut-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.shortcut-text {
  font-size: 13px;
  color: #606266;
}
</style>
