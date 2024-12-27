export interface Student {
  id: number;        // 学号
  name: string;      // 姓名
  sex: '男' | '女';  // 性别
  classes: string;   // 班级
  major: string;     // 专业
  year: number;      // 入学年份
  phone: string | null; // 手机号
}

// 创建/编辑学生时的表单数据类型
export interface StudentForm {
  id?: number;       // 添加时可编辑，编辑时只读
  name: string;
  sex: '男' | '女';
  classes: string;
  major: string;
  year: number;
  phone: string | null;
}