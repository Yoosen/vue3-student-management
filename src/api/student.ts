import request from '@/utils/request'
import type { Student, StudentForm } from '@/types/student'

export const studentApi = {
  // 获取学生列表
  getStudentList() {
    return request.get<any, Student[]>('/admin/student/list')
  },

  // 获取单个学生信息
  getStudent(id: number) {
    return request.get<any, Student>(`/admin/student/${id}`)
  },

  // 更新学生信息
  updateStudent(id: number, data: StudentForm) {
    return request.put<any, boolean>(`/admin/student/${id}`, data)
  },

  // 创建学生
  createStudent(data: StudentForm) {
    return request.post<any, boolean>('/admin/student', data)
  },

  // 删除学生
  deleteStudent(id: number) {
    return request.delete<any, boolean>(`/admin/student/${id}`)
  }
} 