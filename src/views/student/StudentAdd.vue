<template>
  <div class="student-add">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加学生信息</span>
        </div>
      </template>
      
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="student-form">
        <el-form-item label="学号" prop="id">
          <el-input v-model.number="form.id" class="form-input" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" class="form-input" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" class="form-select">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-input v-model="form.classes" class="form-input" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" class="form-input" />
        </el-form-item>
        <el-form-item label="入学年份" prop="year">
          <el-date-picker
            v-model="form.year"
            type="year"
            placeholder="选择年份"
            value-format="YYYY"
            :parse-format="yearFormat"
            class="form-date"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" class="form-input" />
        </el-form-item>
        <el-form-item>
          <div class="form-buttons">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from '@/store/modules/student'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { StudentForm } from '@/types/student'

const router = useRouter()
const studentStore = useStudentStore()

const formRef = ref<FormInstance>()
const form = ref<StudentForm>({
  id: undefined,
  name: '',
  sex: '男',
  classes: '',
  major: '',
  year: new Date().getFullYear(),
  phone: null
})

const rules = {
  id: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { type: 'number', message: '学号必须为数字', trigger: 'blur' },
    { min: 2000000000, max: 2099999999, message: '请输入正确的学号格式', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  classes: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  year: [{ required: true, message: '请选择入学年份', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const success = await studentStore.createStudent(form.value)
      if (success) {
        ElMessage.success('添加成功')
        router.push('/student')
      }
    }
  })
}

const handleCancel = () => {
  router.back()
}

const yearFormat = (val: string) => Number(val)
</script>

<style scoped>
.student-add {
  padding: 1.25rem;
  max-width: 50rem;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
}

.student-form {
  padding: 1.25rem;
}

.form-input {
  width: 18.75rem;
}

.form-select {
  width: 7.5rem;
}

.form-date {
  width: 12.5rem;
}

.form-buttons {
  margin-left: -7.5rem;
}

:deep(.el-form-item__content) {
  justify-content: flex-start;
}
</style> 