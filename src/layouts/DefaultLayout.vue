<template>
  <div class="layout">
    <aside class="sidebar">
      <!-- 一级菜单 -->
      <div v-for="(item, index) in menuList" :key="index" class="row">
        <div @click="toExpand(item, index)" class="row_box">
          <div>
            <img class="row_icon" src="../image/sidebar_icon/icon_chart.png" alt="">
          </div>
          <div class="row_title">{{item.title}}</div>
          <div v-show="!item.path" class="row_arrow"></div>
        </div>
        <!-- 二级菜单 -->
        <div v-show="openIndex === index">
          <div v-for="child in item.children" :key="child.path" class="row">
            <div @click="toJump(child.path)" class="row_box">
              <div class="child_title">{{child.title}}</div>
            </div>
          </div>
        </div>

      </div>

<!-- 
      <div class="row">
        <div class="row_box">
          <div >
            <img class="row_icon" src="../image/sidebar_icon/icon_chart.png" alt="">
          </div>
          <div class="row_title">患者管理</div>
          <div class="row_arrow"></div>
        </div>

        <div class="row_content">患者列表</div>
      </div> -->

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
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
interface MenuItem {
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
}
const openIndex = ref<number | null>(null)
const menuList: MenuItem[] = [
  {
    title: '仪表盘',
    icon: '',
    children: [
      { title: '数据可视化', path: '/dashboard' }
    ]
  },
  {
    title: '患者管理',
    icon: '👤',
    children: [
      { title: '患者列表', path: '/patients'},
      { title: '就诊记录', path: '/records' }
    ]
  },
  {
    title: '医生管理',
    icon: '👤',
    path: '/doctor'
  }
]

function toExpand(item: MenuItem, index: number) {
  if (item.path) {
    router.push(item.path);
  } else {
    openIndex.value = openIndex.value === index ? null : index;
  }
}
const toJump = (path: string | undefined) => {
  router.push(path || '/')
}
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
.child_title {
  color: #515151;
  flex: 1;
  padding-left: 36px;
  font-size: 16px;
}
</style>
