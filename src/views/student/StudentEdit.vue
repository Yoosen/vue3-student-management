<template>
  <div class="student-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑学生信息</span>
        </div>
      </template>
      
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        v-loading="loading"
        class="student-form"
      >
        <el-form-item label="学号">
          <el-input v-model="form.id" disabled class="form-input" />
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
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore } from '@/store/modules/student'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { StudentForm } from '@/types/student'

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
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

// 获取学生信息
const fetchStudentData = async () => {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('学生ID无效')
    router.push('/student')
    return
  }

  // 如果 store 中有当前学生信息，直接使用
  if (studentStore.currentStudent && studentStore.currentStudent.id === id) {
    const student = studentStore.currentStudent
    form.value = {
      id: student.id,
      name: student.name,
      sex: student.sex,
      classes: student.classes,
      major: student.major,
      year: student.year,
      phone: student.phone
    }
    return
  }

  // 如果 store 中没有，则从后端获取
  loading.value = true
  try {
    const student = await studentStore.getStudentById(id)
    if (student) {
      form.value = {
        id: student.id,
        name: student.name,
        sex: student.sex,
        classes: student.classes,
        major: student.major,
        year: student.year,
        phone: student.phone
      }
    } else {
      ElMessage.error('获取学生信息失败')
      router.push('/student')
    }
  } catch (error) {
    ElMessage.error('获取学生信息失败')
    router.push('/student')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const id = Number(route.params.id)
      const success = await studentStore.updateStudent(id, form.value)
      if (success) {
        ElMessage.success('保存成功')
        router.push('/student')
      }
    }
  })
}

const handleCancel = () => {
  router.back()
}

const yearFormat = (val: string) => Number(val)

// 组件加载时获取学生信息
onMounted(() => {
  fetchStudentData()
})

// 组件卸载时清除 currentStudent
onUnmounted(() => {
  studentStore.currentStudent = null
})
</script>

<style scoped>
.student-edit {
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

/* 禁用状态的输入框样式 */
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa;
}
</style>