<template>
  <div class="layout">
    <aside class="sidebar">
      <ul>
        <li><router-link to="/home">首页</router-link></li>
        <li><router-link to="/user">用户管理</router-link></li>
      </ul>
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

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background: #001529;
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
</style>
