<template>
  <div class="doctor-detail-page">
    <!-- 返回按钮 -->
    <div class="back-section">
      <el-button @click="goBack" icon="el-icon-arrow-left" type="primary" plain>
        返回医生管理
      </el-button>
    </div>

    <!-- 医生基本信息 -->
    <div class="doctor-header">
      <div class="doctor-avatar">
        <img :src="doctor?.avatar" :alt="doctor?.name" class="avatar-large" />
      </div>
      <div class="doctor-info">
        <h1>{{ doctor?.name }}</h1>
        <div class="info-row">
          <span class="label">科室：</span>
          <span>{{ doctor?.department }}</span>
        </div>
        <div class="info-row">
          <span class="label">所属部门：</span>
          <span>{{ doctor?.team }}</span>
        </div>
        <div class="info-row">
          <span class="label">状态：</span>
          <el-tag :type="doctor?.status === '值班' ? 'success' : 'info'">
            {{ doctor?.status }}
          </el-tag>
        </div>
        <div class="info-row">
          <span class="label">评分：</span>
          <el-rate :model-value="doctor?.score" disabled show-score text-color="#ff9900" />
        </div>
      </div>
    </div>

    <!-- 详细信息卡片 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="detail-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <div class="card-content">
            <div class="info-item">
              <span class="label">医生ID：</span>
              <span>{{ doctor?.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">姓名：</span>
              <span>{{ doctor?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">科室：</span>
              <span>{{ doctor?.department }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属部门：</span>
              <span>{{ doctor?.team }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="detail-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>工作状态</span>
            </div>
          </template>
          <div class="card-content">
            <div class="info-item">
              <span class="label">当前状态：</span>
              <el-tag :type="doctor?.status === '值班' ? 'success' : 'info'" size="large">
                {{ doctor?.status }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">评分：</span>
              <span class="score">{{ doctor?.score }}/5.0</span>
            </div>
            <div class="info-item">
              <span class="label">工作经验：</span>
              <span>{{ getExperienceYears() }}年</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="editDoctor">编辑医生信息</el-button>
      <el-button type="warning" @click="viewSchedule">查看排班</el-button>
      <el-button type="danger" @click="deleteDoctor">删除医生</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Doctor } from '../../components/DoctorCard.vue';

const route = useRoute();
const router = useRouter();

// 从路由参数获取医生ID
const doctorId = computed(() => parseInt(route.params.id as string));

// 模拟获取医生数据（实际应该从API获取）
const doctor = ref<Doctor | null>(null);

// 模拟医生数据（实际应该从store或API获取）
const mockDoctors: Doctor[] = [
  { id: 1, name: '陈晓燕', avatar: '/doctor/doctor.png', department: '心内科', team: '心血管内科一病区', status: '值班', score: 4.8 },
  { id: 2, name: '李博文', avatar: '/doctor/doctor.png', department: '神经内科', team: '神经内科病区', status: '休息', score: 4.4 },
  { id: 3, name: '王可欣', avatar: '/doctor/doctor.png', department: '儿科', team: '儿科病区', status: '值班', score: 4.9 },
  { id: 4, name: '刘建明', avatar: '/doctor/doctor.png', department: '骨科', team: '骨科病区', status: '值班', score: 4.5 },
  { id: 5, name: '张雅琴', avatar: '/doctor/doctor.png', department: '皮肤科', team: '皮肤科门诊', status: '休息', score: 4.3 },
  { id: 6, name: '郭伟', avatar: '/doctor/doctor.png', department: '消化内科', team: '消化内科病区', status: '值班', score: 4.7 },
  { id: 7, name: '孙晓丽', avatar: '/doctor/doctor.png', department: '内分泌科', team: '内分泌科病区', status: '值班', score: 4.6 },
  { id: 8, name: '谭志强', avatar: '/doctor/doctor.png', department: '眼科', team: '眼科病区', status: '休息', score: 4.4 },
  { id: 9, name: '吴雅文', avatar: '/doctor/doctor.png', department: '精神科', team: '精神卫生中心', status: '值班', score: 4.8 },
  { id: 10, name: '马超', avatar: '/doctor/doctor.png', department: '放射科', team: '影像中心', status: '值班', score: 4.6 },
  { id: 11, name: '周婷婷', avatar: '/doctor/doctor.png', department: '耳鼻喉科', team: '耳鼻喉科病区', status: '休息', score: 4.5 },
  { id: 12, name: '黄磊', avatar: '/doctor/doctor.png', department: '肾内科', team: '肾内科病区', status: '值班', score: 4.7 },
];

// 根据ID查找医生
const loadDoctor = () => {
  doctor.value = mockDoctors.find(d => d.id === doctorId.value) || null;
  if (!doctor.value) {
    ElMessage.error('医生信息不存在');
    router.push('/doctor');
  }
};

// 计算工作经验年数（模拟）
const getExperienceYears = () => {
  return Math.floor(Math.random() * 20) + 5; // 5-25年随机
};

// 返回上一页
const goBack = () => {
  router.push('/doctor');
};

// 编辑医生
const editDoctor = () => {
  ElMessage.info('编辑医生功能开发中...');
};

// 查看排班
const viewSchedule = () => {
  ElMessage.info('查看排班功能开发中...');
};

// 删除医生
const deleteDoctor = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除医生 ${doctor.value?.name} 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 这里应该调用删除API
    ElMessage.success('医生删除成功');
    router.push('/doctor');
  } catch {
    // 用户取消删除
  }
};

// 组件挂载时加载数据
loadDoctor();
</script>

<style scoped>
.doctor-detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-section {
  margin-bottom: 24px;
}

.doctor-header {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.doctor-avatar {
  margin-right: 32px;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e4e7ed;
}

.doctor-info h1 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
}

.label {
  font-weight: 600;
  color: #606266;
  min-width: 100px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  font-size: 16px;
}

.card-content {
  padding: 16px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-item .label {
  min-width: 120px;
  color: #909399;
}

.score {
  font-size: 18px;
  font-weight: 600;
  color: #e6a23c;
}

.action-buttons {
  margin-top: 32px;
  text-align: center;
}

.action-buttons .el-button {
  margin: 0 12px;
}

@media (max-width: 768px) {
  .doctor-header {
    flex-direction: column;
    text-align: center;
  }

  .doctor-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .info-row {
    justify-content: center;
  }

  .action-buttons .el-button {
    display: block;
    width: 100%;
    margin: 8px 0;
  }
}
</style>