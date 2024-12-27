<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <side-menu />
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import SideMenu from './SideMenu.vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
}

:deep(.el-aside) {
  background-color: #304156;
  color: #fff;
  padding: 0;
  margin: 0;
}

:deep(.el-main) {
  padding: 20px;
  background-color: #f0f2f5;
  overflow: auto;
}
</style>