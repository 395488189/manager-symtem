<template>
  <div class="doctor-page">
    <div class="page-header">
      <div class="left">
        <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回医生管理</el-button>
      </div>
      <div class="right">
        <h2>医生排班</h2>
      </div>
    </div>

    <el-card class="doctor-info-card" shadow="hover">
      <div class="info-box">
        <img :src="doctor?.avatar || '/doctor.png'" alt="avatar" class="avatar" />
        <div class="text">
          <div class="name">{{ doctor?.name || '未找到医生' }}</div>
          <div>{{ doctor?.department }} • {{ doctor?.team }}</div>
          <el-tag :type="doctor?.status === '值班' ? 'success' : 'info'">{{ doctor?.status }}</el-tag>
          <div class="score">评分: {{ doctor?.score ?? 0 }}/5</div>
        </div>
      </div>
    </el-card>

    <div class="schedules">
      <el-row :gutter="20">
        <el-col v-for="day in scheduleDays" :key="day.day" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="schedule-card" shadow="hover">
            <div class="day-title">{{ day.day }}</div>
            <div class="shift">早班: {{ day.morning }}</div>
            <div class="shift">中班: {{ day.afternoon }}</div>
            <div class="shift">晚班: {{ day.night }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="action-row">
      <el-button type="primary" @click="saveSchedule">保存排班</el-button>
      <el-button @click="resetSchedule">重置为默认</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { Doctor } from '../../components/DoctorCard.vue';

const route = useRoute();
const router = useRouter();
const doctorId = Number(route.params.id || 0);

const allDoctors: Doctor[] = [
  { id: 1, name: '陈晓燕', avatar: '/doctor/doctor.png', department: '心内科', team: '心血管内科一病区', status: '值班', score: 4.8 },
  { id: 2, name: '李博文', avatar: '/doctor/doctor.png', department: '神经内科', team: '神经内科病区', status: '休息', score: 4.4 },
  { id: 3, name: '王可欣', avatar: '/doctor/doctor.png', department: '儿科', team: '儿科病区', status: '值班', score: 4.9 },
  { id: 4, name: '刘建明', avatar: '/doctor/doctor.png', department: '骨科', team: '骨科病区', status: '值班', score: 4.5 },
];

const doctor = ref<Doctor | null>(null);

const scheduleDays = ref([
  { day: '周一', morning: '08:00-12:00', afternoon: '13:00-17:00', night: '休息' },
  { day: '周二', morning: '休息', afternoon: '13:00-17:00', night: '17:00-21:00' },
  { day: '周三', morning: '08:00-12:00', afternoon: '休息', night: '17:00-21:00' },
  { day: '周四', morning: '08:00-12:00', afternoon: '13:00-17:00', night: '休息' },
  { day: '周五', morning: '休息', afternoon: '13:00-17:00', night: '17:00-21:00' },
  { day: '周六', morning: '08:00-12:00', afternoon: '13:00-17:00', night: '休息' },
  { day: '周日', morning: '休息', afternoon: '休息', night: '休息' },
]);

doctor.value = allDoctors.find((item) => item.id === doctorId) ?? null;

const goBack = () => {
  router.push('/doctor');
};

const saveSchedule = () => {
  ElMessage.success(`已保存 ${doctor.value?.name || '医生'} 的排班`);
};

const resetSchedule = () => {
  scheduleDays.value = [
    { day: '周一', morning: '08:00-12:00', afternoon: '13:00-17:00', night: '休息' },
    { day: '周二', morning: '休息', afternoon: '13:00-17:00', night: '17:00-21:00' },
    { day: '周三', morning: '08:00-12:00', afternoon: '休息', night: '17:00-21:00' },
    { day: '周四', morning: '08:00-12:00', afternoon: '13:00-17:00', night: '休息' },
    { day: '周五', morning: '休息', afternoon: '13:00-17:00', night: '17:00-21:00' },
    { day: '周六', morning: '08:00-12:00', afternoon: '13:00-17:00', night: '休息' },
    { day: '周日', morning: '休息', afternoon: '休息', night: '休息' },
  ];
  ElMessage.info('排班已重置');
};
</script>

<style scoped>
.doctor-page { padding: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.doctor-info-card { margin-bottom: 16px; }
.info-box { display: flex; align-items: center; gap: 16px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
.text { line-height: 24px; }
.name { font-size: 18px; font-weight: 600; }
.score { margin-top: 8px; color: #909399; }
.schedule-card { min-height: 140px; }
.day-title { font-weight: 600; margin-bottom: 8px; }
.shift { margin-bottom: 4px; }
.action-row { margin-top: 18px; display: flex; gap: 13px; justify-content: flex-end; }
</style>