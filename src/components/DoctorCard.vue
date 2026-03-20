<template>
  <el-card class="doctor-card" shadow="hover">
    <div class="card-header">
      <img :src="doctor.avatar" alt="avatar" class="avatar" />
      <div class="info">
        <div class="name">{{ doctor.name }}</div>
        <div class="dept">{{ doctor.department }} • {{ doctor.team }}</div>
        <el-tag :type="doctor.status === '值班' ? 'success' : 'info'" class="status-chip">
          {{ doctor.status }}
        </el-tag>
      </div>
    </div>
    <div class="card-actions">
      <el-button size="Large" type="primary" style="width: 100px;" @click="onProfile">资料</el-button>
      <el-button size="Default" type="warning" style="width: 100px;" @click="onSchedule">排班</el-button>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export interface Doctor {
  id: number;
  name: string;
  avatar: string;
  department: string;
  team: string;
  status: '值班' | '休息';
  score: number;
}

export default defineComponent({
  name: 'DoctorCard',
  props: {
    doctor: {
      type: Object as PropType<Doctor>,
      required: true,
    },
  },
  emits: ['profile', 'schedule'],
  methods: {
    onProfile() {
      this.$emit('profile', this.doctor);
    },
    onSchedule() {
      this.$emit('schedule', this.doctor);
    },
  },
});
</script>

<style scoped>
.doctor-card {
  min-height: 190px;
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #36cfc9, #1890ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
/* .avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #dcdfe6;
} */
.info {
  flex: 1;
}
.name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.dept {
  color: #606266;
  font-size: 13px;
  margin-bottom: 8px;
}
.status-chip {
  padding: 0 8px;
}
.card-actions {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
}
</style>
