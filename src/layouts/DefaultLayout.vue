<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="row">
        <div class="row_box">
          <div @click="toExpand">
            <img class="row_icon" src="../image/sidebar_icon/icon_chart.png" alt="">
          </div>
          <div class="row_title">仪表盘</div>
          <div class="row_arrow"></div>
        </div>

        <div class="row_content">数据可视化</div>
      </div>

      <div class="row">
        <div class="row_box">
          <div >
            <img class="row_icon" src="../image/sidebar_icon/icon_chart.png" alt="">
          </div>
          <div class="row_title">患者管理</div>
          <div class="row_arrow"></div>
        </div>

        <div class="row_content">患者列表</div>
      </div>

    </aside>

    <div class="main">
      <header class="header">
        头部
      </header>

      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const expanded = ref(true)
</script>
<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  /* background: #001529; */
  color: #fff;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.content {
  flex: 1;
  padding: 16px;
  background: #f5f7fa;
}
.row {
  /* display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px; */
}
.row_box {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
}
.row_icon {
  width: 15px;
  height: 15px;
}
.row_title {
  color: #515151;
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
}
.row_arrow {
  width: 4px;
  height: 4px;
  border-left: 2px solid #515151; 
  border-bottom: 2px solid #515151;
  transform: rotate(-45deg);
}
</style>
