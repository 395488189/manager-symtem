<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="医生姓名" width="160" align="center" />
      <el-table-column label="头像" width="100" align="center">
        <template #default="{ row }">
          <img :src="row.avatar" alt="头像" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="职称" width="140" align="center" />
      <el-table-column prop="department" label="科室" width="140" align="center" />
      <el-table-column prop="intro" label="医生简介" align="center" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tableData = ref([
  {
    name: '张三',
    avatar: 'https://via.placeholder.com/40',
    title: '主任医师',
    department: '内科',
    intro: '擅长心血管疾病。'
  },
  {
    name: '李四',
    avatar: 'https://via.placeholder.com/40',
    title: '副主任医师',
    department: '儿科',
    intro: '小儿感染疾病专家。'
  },
  {
    name: '王五',
    avatar: 'https://via.placeholder.com/40',
    title: '主治医师',
    department: '外科',
    intro: '擅长微创手术。'
  }
]);

</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>