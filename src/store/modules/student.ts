import { defineStore } from 'pinia'
import type { Student, StudentForm } from '@/types/student'
import { studentApi } from '@/api/student'
import { ElMessage } from 'element-plus'

interface StudentState {
  students: Student[];
  currentStudent: Student | null;
}

export const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    students: [],
    currentStudent: null
  }),
  
  actions: {
    async fetchStudents(): Promise<void> {
      try {
        this.students = await studentApi.getStudentList()
      } catch (error) {
        console.error('获取学生列表失败:', error)
        ElMessage.error('获取学生列表失败')
      }
    },

    async updateStudent(id: number, studentData: StudentForm): Promise<boolean> {
      try {
        const success = await studentApi.updateStudent(id, studentData)
        if (success) {
          ElMessage.success('更新成功')
          await this.fetchStudents()
        }
        return success
      } catch (error) {
        console.error('更新学生信息失败:', error)
        return false
      }
    },

    async createStudent(student: StudentForm): Promise<boolean> {
      try {
        const result = await studentApi.createStudent(student)
        if (result) {
          await this.fetchStudents()
          return true
        }
        return false
      } catch (error) {
        console.error('Create student error:', error)
        return false
      }
    },

    async deleteStudent(id: number): Promise<boolean> {
      try {
        const success = await studentApi.deleteStudent(id)
        if (success) {
          ElMessage.success('删除成功')
          await this.fetchStudents()
        }
        return success
      } catch (error) {
        console.error('删除学生失败:', error)
        return false
      }
    },

    async getStudentById(id: number): Promise<Student | null> {
      try {
        return await studentApi.getStudent(id)
      } catch (error) {
        console.error('获取学生信息失败:', error)
        return null
      }
    }
  }
})