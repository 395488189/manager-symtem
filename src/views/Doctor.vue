<template>
  <div class="doctor-page">
    <!-- Header 区 -->
    <div class="page-header">
      <h2>医生管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchText"
          size="medium"
          placeholder="搜索医生"
          clearable
          class="search-input"
        />
        <el-button type="primary" icon="el-icon-plus" @click="onAddDoctor">
          添加医生
        </el-button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-grid">
      <el-card class="stats-card" shadow="hover">
        <div class="stat-title">医生总数</div>
        <div class="stat-value">{{ totalDoctors }}</div>
      </el-card>
      <el-card class="stats-card" shadow="hover">
        <div class="stat-title">值班</div>
        <div class="stat-value">{{ onDutyDoctors }}</div>
      </el-card>
      <el-card class="stats-card" shadow="hover">
        <div class="stat-title">部门</div>
        <div class="stat-value">{{ departmentCount }}</div>
      </el-card>
      <el-card class="stats-card" shadow="hover">
        <div class="stat-title">评分</div>
        <div class="stat-value">{{ avgScore.toFixed(1) }}</div>
      </el-card>
    </div>

    <!-- 医生列表 -->
    <div class="doctor-list">
      <el-row :gutter="20">
        <el-col
          v-for="doctor in paginatedDoctors"
          :key="doctor.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <DoctorCard :doctor="doctor" @profile="openProfile" @schedule="openSchedule" />
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :page-sizes="[8, 12, 20]"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="filteredDoctors.length"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'; // 消息
import DoctorCard from '../components/DoctorCard.vue';
import type { Doctor } from '../components/DoctorCard.vue';

const searchText = ref<string>('');
const currentPage = ref<number>(1);
const pageSize = ref<number>(8);

// mock 数据，用于展示
const allDoctors = reactive<Doctor[]>([
  { id: 1, name: '陈晓燕', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '心内科', team: '心血管内科一病区', status: '值班', score: 4.8 },
  { id: 2, name: '李博文', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '神经内科', team: '神经内科病区', status: '休息', score: 4.4 },
  { id: 3, name: '王可欣', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '儿科', team: '儿科病区', status: '值班', score: 4.9 },
  { id: 4, name: '刘建明', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '骨科', team: '骨科病区', status: '值班', score: 4.5 },
  { id: 5, name: '张雅琴', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '皮肤科', team: '皮肤科门诊', status: '休息', score: 4.3 },
  { id: 6, name: '郭伟', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '消化内科', team: '消化内科病区', status: '值班', score: 4.7 },
  { id: 7, name: '孙晓丽', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '内分泌科', team: '内分泌科病区', status: '值班', score: 4.6 },
  { id: 8, name: '谭志强', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '眼科', team: '眼科病区', status: '休息', score: 4.4 },
  { id: 9, name: '吴雅文', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '精神科', team: '精神卫生中心', status: '值班', score: 4.8 },
  { id: 10, name: '马超', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '放射科', team: '影像中心', status: '值班', score: 4.6 },
  { id: 11, name: '周婷婷', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '耳鼻喉科', team: '耳鼻喉科病区', status: '休息', score: 4.5 },
  { id: 12, name: '黄磊', avatar: 'https://ui-avatars.com/api/?name=%E5%8C%BB%E7%94%9F&size=150&background=random&color=fff', department: '肾内科', team: '肾内科病区', status: '值班', score: 4.7 },
]);

// 搜索过滤
const filteredDoctors = computed(() => {
  const q = searchText.value.trim().toLowerCase();
  if (!q) return allDoctors;

  return allDoctors.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) ||
      doc.team.toLowerCase().includes(q) ||
      doc.status.toLowerCase().includes(q)
    );
  });
});

// 分页逻辑
const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredDoctors.value.slice(start, start + pageSize.value);
});

// 统计数据
const totalDoctors = computed(() => allDoctors.length);
const onDutyDoctors = computed(() => allDoctors.filter((d) => d.status === '值班').length);
const departmentCount = computed(() => new Set(allDoctors.map((d) => d.department)).size);
const avgScore = computed(() => {
  if (allDoctors.length === 0) return 0;
  return allDoctors.reduce((sum, doc) => sum + doc.score, 0) / allDoctors.length;
});

const onAddDoctor = () => {
  ElMessage({ message: 'Add doctor action triggered (mock)', type: 'success' });
};

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
};

const openProfile = (doctor: Doctor) => {
  ElMessage.info(`Open profile of ${doctor.name}`);
};

const openSchedule = (doctor: Doctor) => {
  ElMessage.info(`Open schedule of ${doctor.name}`);
};
</script>

<style scoped>
.doctor-page {
  padding: 24px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.page-header h2 {
  margin: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-input {
  width: 300px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.stats-card {
  text-align: center;
  padding: 16px;
}
.stat-title {
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
}
.doctor-list {
  margin-bottom: 20px;
}
.pagination-wrapper {
  text-align: right;
  margin-top: 12px;
}
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    width: 100%;
  }
}
</style>