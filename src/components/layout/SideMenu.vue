<template>
  <div class="menu-container">
    <!-- 添加 logo 区域 -->
    <div class="logo-container">
      <el-icon class="logo-icon"><School /></el-icon>
      <span class="logo-title">信息管理系统</span>
    </div>
    
    <!-- 原有的菜单内容 -->
    <el-menu
      :default-active="activeIndex"
      class="menu"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/student">
        <el-icon><User /></el-icon>
        <span>学生信息管理</span>
      </el-menu-item>
      <el-menu-item index="/teacher">
        <el-icon><User /></el-icon>
        <span>教师信息管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { School } from '@element-plus/icons-vue'

const activeIndex = ref('1')
const isCollapse = ref(false)
</script>

<style scoped>
.menu-container {
  height: 100vh;
  background-color: #545c64;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  background-color: #4a5259;
}

.logo-icon {
  font-size: 24px;
  margin-right: 12px;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.menu {
  border-right: none;
}

</style>