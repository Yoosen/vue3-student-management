import { defineStore } from 'pinia'
import { studentApi } from '@/api/student'
import type { Student, StudentForm } from '@/types/student'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: []
  }),
  
  actions: {
    async fetchStudents() {
      try {
        console.log('开始获取学生列表...');
        const data = await studentApi.getStudentList()
        
        if (!data) {
          console.error('API 返回数据为空');
          return false;
        }
        
        this.students = data
        return true
      } catch (error) {
        console.error('获取学生列表失败，详细错误:', error)
        return false
      }
    },

    async deleteStudent(id: number) {
      const success = await studentApi.deleteStudent(id)
      if (success) {
        await this.fetchStudents()  // 删除成功后刷新列表
      }
      return success
    },

    async updateStudent(id: number, data: StudentForm) {
      const success = await studentApi.updateStudent(id, data)
      if (success) {
        await this.fetchStudents()
      }
      return success
    },

    async createStudent(data: StudentForm) {
      const success = await studentApi.createStudent(data)
      if (success) {
        await this.fetchStudents()
      }
      return success
    }
  }
})