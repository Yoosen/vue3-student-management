import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layout/MainContent.vue'),
    redirect: '/student',
    children: [
  {
        path: 'student',
    name: 'StudentList',
    component: () => import('@/views/student/StudentList.vue'),
    meta: {
      title: '学生列表'
    }
  }
]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
}) 