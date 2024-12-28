<template>
  <div class="student-list">
    <el-card>
      <!-- 搜索区域 -->
      <el-form :inline="true" class="search-form">
        <el-form-item class="search-item">
          <el-input 
            v-model="searchKeyword" 
            placeholder="请输入学号/姓名/班级/专业/入学年份搜索" 
            @keyup.enter="handleSearch"
            style="width: 31.25rem"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">添加学生</el-button>
        </el-form-item>
      </el-form>

      <!-- 学生列表表格 -->
      <el-table 
        :data="filteredStudents" 
        border 
        stripe
        :header-cell-style="{ background: '#f5f7fa' }"
        :default-sort="{ prop: 'classes', order: 'ascending' }"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="id" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="sex" label="性别" width="80" />
        <el-table-column 
          prop="classes" 
          label="班级" 
          width="100"
          :filters="classesFilters"
          :filter-method="filterHandler"
          filter-placement="bottom"
          column-key="classes"
          :filter-multiple="false"
        />
        <el-table-column 
          prop="major" 
          label="专业"
          :filters="majorFilters"
          :filter-method="filterHandler"
          filter-placement="bottom"
          column-key="major"
          :filter-multiple="false"
        />
        <el-table-column 
          prop="year" 
          label="入学年份" 
          width="120"
          sortable="custom"
        />
        <el-table-column prop="phone" label="手机号" width="120">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              link
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 在表格下方添加分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalStudents"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 添加/编辑学生对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="40rem"
        @close="handleDialogClose"
      >
        <el-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="7.5rem"
          class="student-form"
          :validate-on-rule-change="false"
        >
          <el-form-item label="学号" prop="id">
            <el-input 
              v-model.number="form.id" 
              :disabled="isEdit"
              class="form-input"
              type="number"
            />
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
              :disabled-date="disabledDate"
              class="form-date"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" class="form-input" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from '@/store/modules/student'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { StudentForm, Student } from '@/types/student'

const router = useRouter()
const studentStore = useStudentStore()
const searchKeyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = ref<StudentForm>({
  id: undefined,
  name: '',
  sex: '男',
  classes: '',
  major: '',
  year: new Date().getFullYear(),
  phone: null
})

// 表单验证规则
const rules = computed(() => {
  // 定义统一的触发方式
  const triggerType = ['blur', 'change']
  
  const baseRules = {
    name: [{ required: true, message: '请输入姓名', trigger: triggerType }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    classes: [{ required: true, message: '请输入班级', trigger: triggerType }],
    major: [{ required: true, message: '请输入专业', trigger: triggerType }],
    year: [{ required: true, message: '请选择入学年份', trigger: 'change' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: triggerType },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: triggerType }
    ]
  }

  // 只在添加模式下添加学号验证规则
  if (!isEdit.value) {
    return {
      ...baseRules,
      id: [
        { required: true, message: '请输入学号', trigger: triggerType },
        { 
          validator: (rule: any, value: any, callback: any) => {
            const num = Number(value)
            if (isNaN(num)) {
              callback(new Error('学号必须为数字'))
            } else if (num < 2020000000 || num > 2029999999) {
              callback(new Error('请输入正确的学号格式（202xxxxxxx）'))
            } else {
              callback()
            }
          },
          trigger: triggerType 
        }
      ]
    }
  }

  return baseRules
})

// 对话框标题
const dialogTitle = computed(() => isEdit.value ? '编辑学生信息' : '添加学生')

// 添加分页相关的响应式变量
const currentPage = ref(1)
const pageSize = ref(10)

// 先添加一个处理过滤的计算属性
const filteredList = computed(() => {
  let result = [...studentStore.students]

  // 1. 处理搜索关键字过滤
  const keyword = searchKeyword.value.toLowerCase()
  if (keyword) {
    result = result.filter(student => 
      student.id.toString().includes(keyword) ||
      student.name.toLowerCase().includes(keyword) ||
      student.classes.toLowerCase().includes(keyword) ||
      student.major.toLowerCase().includes(keyword) ||
      student.year.toString().includes(keyword)
    )
  }

  // 2. 处理班级和专业的筛选
  if (filterValues.value.classes) {
    result = result.filter(student => student.classes === filterValues.value.classes)
  }
  if (filterValues.value.major) {
    result = result.filter(student => student.major === filterValues.value.major)
  }

  return result
})

// 修改表格数据的计算属性，只负责分页
const filteredStudents = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredList.value.slice(startIndex, endIndex)
})

// 修改总条数的计算属性，使用筛选后的数据长度
const totalStudents = computed(() => filteredList.value.length)

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 重置到第一页
}

// 处理页码变化
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
}

// 修改搜索处理函数
const handleSearch = () => {
  currentPage.value = 1 // 搜索时重置到第一页
}

// 添加学生
const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
  const currentYear = new Date().getFullYear()
  // 延迟重置表单，确保对话框显示后再重置
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
      formRef.value.clearValidate()
    }
    form.value = {
      id: undefined,
      name: '',
      sex: '男',
      classes: '',
      major: '',
      year: currentYear.toString(), // 设置为当前年份
      phone: null
    }
  })
}

// 编辑学生
const handleEdit = (student: Student) => {
  isEdit.value = true
  dialogVisible.value = true
  // 延迟设置表单数据，确保对话框显示后再设置
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
      formRef.value.clearValidate()
    }
    // 复制学生数据并确保年份格式正确
    form.value = {
      ...student,
      year: student.year.toString() // 确保年份是字符串格式
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      const success = isEdit.value 
        ? await studentStore.updateStudent(form.value.id!, form.value)
        : await studentStore.createStudent(form.value)
      
      if (success) {
        ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
        dialogVisible.value = false
        await studentStore.fetchStudents()
        
        // 计算新增数据应该在哪一页
        const totalPages = Math.ceil(studentStore.students.length / pageSize.value)
        currentPage.value = totalPages // 跳转到最后一页
      } else {
        ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
      }
    }
  } catch (error) {
    console.error('Submit error:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 关闭对话框时重置表单和验证状态
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    formRef.value.clearValidate()
  }
  // 使用 nextTick 确保在 DOM 更新后再重置表单
  nextTick(() => {
    form.value = {
      id: undefined,
      name: '',
      sex: '男',
      classes: '',
      major: '',
      year: new Date().getFullYear(),
      phone: null
    }
  })
}

// 删除学生
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条学生信息吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const success = await studentStore.deleteStudent(id)
    if (success) {
      // 如果当前页没有数据了，则跳转到上一页
      if (filteredStudents.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
    }
  } catch (error) {
    // 用户取消删除或删除失败
  }
}

// 修改年份格式化函数
const yearFormat = (val: string | number) => {
  return typeof val === 'string' ? Number(val) : val
}

// 获取班级筛选选项
const classesFilters = computed(() => {
  const uniqueClasses = [...new Set(studentStore.students.map(item => item.classes))]
  return [
    { text: '全部', value: '' }, // 自定义的"全部"选项
    ...uniqueClasses.map(classes => ({ text: classes, value: classes }))
  ]
})

// 获取专业筛选选项
const majorFilters = computed(() => {
  const uniqueMajors = [...new Set(studentStore.students.map(item => item.major))]
  return [
    { text: '全部', value: '' }, // 自定义的"全部"选项
    ...uniqueMajors.map(major => ({ text: major, value: major }))
  ]
})

// 添加筛选值状态
const filterValues = ref({
  classes: '',
  major: ''
})

// 修改筛选方法
const filterHandler = (value: string, row: Student, column: { property: keyof Student }) => {
  const type = column.property === 'classes' ? 'classes' : 'major'
  filterValues.value[type] = value

  // 打印当前筛选的值和类型
  console.log(`筛选类型: ${type}, 筛选值: ${value}`)

  // 如果值为空字符串，表示选择了"全部"
  return !value || row[column.property] === value
}

// 修改筛选重置处理函数
const handleReset = (type: 'classes' | 'major', handleFilter: (value: string) => void) => {
  filterValues.value[type] = ''
  handleFilter('')
  currentPage.value = 1
}

// 修改筛选确认处理函数
const handleConfirm = (type: 'classes' | 'major', handleFilter: (value: string) => void) => {
  handleFilter(filterValues.value[type])
  currentPage.value = 1
}

// 添加排序处理函数
const handleSortChange = ({ prop, order }: { prop: keyof Student, order: 'ascending' | 'descending' | null }) => {
  if (!prop || !order) return

  studentStore.students.sort((a, b) => {
    const valueA = a[prop] ?? '';
    const valueB = b[prop] ?? '';
    
    // 首先按指定字段排序
    if (valueA !== valueB) {
      return order === 'ascending' 
        ? String(valueA).localeCompare(String(valueB), 'zh-CN')
        : String(valueB).localeCompare(String(valueA), 'zh-CN')
    }
    
    // 如果指定字段相同，按学号排序
    if (a.id !== b.id) {
      return a.id - b.id;
    }
    
    // 如果学号也相同，按姓名拼音排序
    return a.name.localeCompare(b.name, 'zh-CN')
  })
}

// 添加年份限制函数
const disabledDate = (time: Date) => {
  const year = time.getFullYear()
  return year < 2000 || year > 2099 // 限制年份范围
}

onMounted(async () => {
  await studentStore.fetchStudents()
  // 初始默认排序
  handleSortChange({ prop: 'classes', order: 'ascending' })
})
</script>

<style scoped>
.student-list {
  padding: 1.25rem;
}

.search-form {
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
}

.search-item {
  flex: 1;
  margin-right: 1.25rem;
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

.dialog-footer {
  padding-top: 1.25rem;
  text-align: right;
}

:deep(.el-dialog__body) {
  padding-top: 0.625rem;
  padding-bottom: 0;
}

/* 自定义表格样式 */
:deep(.el-table) {
  /* 表格边框颜色 */
  --el-table-border-color: #ebeef5;
  /* 斑马纹颜色 */
  --el-table-row-hover-bg-color: #f5f7fa;
  /* 表头背景色 */
  --el-table-header-bg-color: #f5f7fa;
}

/* 可选：自定义筛选图标颜色 */
:deep(.el-table__column-filter-trigger) {
  color: var(--el-text-color-secondary);
}

/* 可选：自定义排序图标颜色 */
:deep(.el-table__sort-icon) {
  color: var(--el-text-color-secondary);
}

/* 筛选面板样式 */
.filter-content {
  padding: 0.625rem;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  max-height: 15rem;
  overflow-y: auto;
}

.filter-item {
  margin: 0;
  padding: 0.25rem 0;
}

.filter-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.625rem;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 自定义表格筛选图标样式 */
:deep(.el-table__column-filter-trigger) {
  margin-left: 0.5rem;
}

/* 自定义筛选面板样式 */
:deep(.el-table-filter) {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
}

.pagination-container {
  margin-top: 1.25rem;
  padding: 0.625rem;
  display: flex;
  justify-content: flex-end;
}
</style>