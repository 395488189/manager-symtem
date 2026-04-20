<template>
  <div class="charge-page">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="患者姓名">
          <el-input v-model="searchForm.patientName" placeholder="请输入患者姓名" clearable />
        </el-form-item>
        <el-form-item label="收费日期">
          <el-date-picker v-model="searchForm.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="已支付" value="已支付" />
            <el-option label="待支付" value="待支付" />
            <el-option label="已退费" value="已退费" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-card stat-total">
          <div class="stat-value">¥{{ stats.total.toLocaleString() }}</div>
          <div class="stat-label">今日收入</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-paid">
          <div class="stat-value">{{ stats.paidCount }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-pending">
          <div class="stat-value">¥{{ stats.pending.toLocaleString() }}</div>
          <div class="stat-label">待收款</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-refund">
          <div class="stat-value">¥{{ stats.refund.toLocaleString() }}</div>
          <div class="stat-label">已退费</div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="paginatedData" stripe border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="收费单号" width="120" />
        <el-table-column prop="patientName" label="患者姓名" width="100" />
        <el-table-column prop="patientPhone" label="联系电话" width="130" />
        <el-table-column prop="type" label="收费类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="items" label="收费项目" min-width="150" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="100" />
        <el-table-column prop="createTime" label="收费时间" width="160" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">详情</el-button>
            <el-button link type="danger" v-if="row.status === '已支付'" @click="handleRefund(row)">退费</el-button>
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
    <el-dialog v-model="detailVisible" title="收费详情" width="600px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="收费单号">{{ currentRow.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ currentRow.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{ currentRow.patientName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRow.patientPhone }}</el-descriptions-item>
        <el-descriptions-item label="收费类型">{{ currentRow.type }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ currentRow.payMethod }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ currentRow.amount }}</el-descriptions-item>
        <el-descriptions-item label="收费时间">{{ currentRow.createTime }}</el-descriptions-item>
        <el-descriptions-item label="收费项目" :span="2">{{ currentRow.items }}</el-descriptions-item>
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

interface Charge {
  id: string
  patientName: string
  patientPhone: string
  type: string
  items: string
  amount: number
  status: string
  payMethod: string
  createTime: string
}

const searchForm = reactive({ patientName: '', date: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 10 })
const detailVisible = ref(false)
const currentRow = ref<Charge | null>(null)

const allData = reactive<Charge[]>([
  { id: 'CF20240420001', patientName: '张三', patientPhone: '13800138001', type: '检查费', items: '血常规、心电图、B超', amount: 280, status: '已支付', payMethod: '微信支付', createTime: '2024-04-20 09:30:00' },
  { id: 'CF20240420002', patientName: '李四', patientPhone: '13900139002', type: '药费', items: '阿司匹林、布洛芬', amount: 65.5, status: '已支付', payMethod: '支付宝', createTime: '2024-04-20 10:15:00' },
  { id: 'CF20240420003', patientName: '王五', patientPhone: '13700137003', type: '治疗费', items: '输液、换药', amount: 150, status: '待支付', payMethod: '-', createTime: '2024-04-20 11:00:00' },
  { id: 'CF20240420004', patientName: '赵六', patientPhone: '13600136004', type: '检查费', items: 'CT、核磁共振', amount: 680, status: '已支付', payMethod: '医保卡', createTime: '2024-04-20 14:20:00' },
  { id: 'CF20240420005', patientName: '钱七', patientPhone: '13500135005', type: '住院费', items: '床位费、护理费', amount: 520, status: '已支付', payMethod: '医保卡', createTime: '2024-04-20 15:00:00' },
  { id: 'CF20240419001', patientName: '孙八', patientPhone: '13400134006', type: '检查费', items: 'B超', amount: 120, status: '已退费', payMethod: '微信支付', createTime: '2024-04-19 10:30:00' },
])

const stats = computed(() => ({
  total: allData.filter(d => d.status === '已支付').reduce((sum, d) => sum + d.amount, 0),
  paidCount: allData.filter(d => d.status === '已支付').length,
  pending: allData.filter(d => d.status === '待支付').reduce((sum, d) => sum + d.amount, 0),
  refund: allData.filter(d => d.status === '已退费').reduce((sum, d) => sum + d.amount, 0)
}))

const filteredData = computed(() => {
  return allData.filter(item => {
    const nameMatch = !searchForm.patientName || item.patientName.includes(searchForm.patientName)
    const statusMatch = !searchForm.status || item.status === searchForm.status
    return nameMatch && statusMatch
  })
})

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function getStatusType(status: string) {
  const map: Record<string, string> = { '已支付': 'success', '待支付': 'warning', '已退费': 'info' }
  return map[status] || 'info'
}

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { Object.assign(searchForm, { patientName: '', date: '', status: '' }); pagination.currentPage = 1 }
function handleSizeChange(size: number) { pagination.pageSize = size; pagination.currentPage = 1 }
function handlePageChange(page: number) { pagination.currentPage = page }
function handleView(row: Charge) { currentRow.value = row; detailVisible.value = true }

function handleRefund(row: Charge) {
  ElMessageBox.confirm(`确定要退费 ¥${row.amount} 吗？`, '退费确认').then(() => {
    row.status = '已退费'
    row.payMethod = '-'
    ElMessage.success('退费成功')
  }).catch(() => {})
}
</script>

<style scoped>
.charge-page { padding: 16px; }
.search-card { margin-bottom: 16px; }
.search-card :deep(.el-card__body) { padding-bottom: 0; }
.stats-row { margin-bottom: 16px; }
.stat-card { padding: 20px; border-radius: 8px; text-align: center; color: #fff; }
.stat-total { background: linear-gradient(135deg, #409EFF, #66B1FF); }
.stat-paid { background: linear-gradient(135deg, #67C23A, #85CE61); }
.stat-pending { background: linear-gradient(135deg, #E6A23C, #F0AF45); }
.stat-refund { background: linear-gradient(135deg, #909399, #A6A9AD); }
.stat-value { font-size: 28px; font-weight: 700; }
.stat-label { font-size: 14px; margin-top: 4px; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px; }
</style>
