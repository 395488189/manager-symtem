<template>
  <div class="top-search">
    <el-input :prefix-icon="Search" v-model="input" style="width: 240px" placeholder="身份证/姓名/电话" />
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import { Search } from '@element-plus/icons-vue'
const input = ref('')
</script>