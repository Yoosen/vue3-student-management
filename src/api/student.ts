import request from '@/utils/request'
import type { Student, StudentForm } from '@/types/student'
import { log } from 'console';

interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

export const studentApi = {
  // 获取学生列表
  async getStudentList() {
    try {
      const response = await request.get<any, ApiResponse>('/admin/student/list');
      
      // 检查响应是否直接就是数据数组
      if (Array.isArray(response)) {
        return response;
      }
      
      // 检查是否是标准响应格式
      if (response && 'data' in response) {
        return response.data;
      }
      
      console.error('意外的响应格式:', response);
      return [];
      
    } catch (error) {
      console.error('获取学生列表失败:', error);
      return [];
    }
  },

  // 获取单个学生信息
  async getStudent(id: number) {
    const response = await request.get<any, ApiResponse>(`/admin/student/${id}`);
    return response.code === 200 ? response.data : null;
  },

  // 更新学生信息
  async updateStudent(id: number, data: StudentForm) {
    const response = await request.put<any, ApiResponse>(`/admin/student/add/${id}`, data);
    return response.code === 200;
  },

  // 创建学生
  async createStudent(data: StudentForm) {
    try {
      const response = await request.post<any, ApiResponse>('/admin/student/add', data);
      if (response.code === 200) {
        return true;
      }
      throw new Error(response.message || '添加失败');
    } catch (error) {
      console.error('Create student error:', error);
      return false;
    }
  },

  // 删除学生
  async deleteStudent(id: number) {
    const response = await request.delete<any, ApiResponse>(`/admin/student/deleteById`, { params: { id } });
    return response.code === 200;
  }
} 