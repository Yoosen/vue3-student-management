# 学生管理系统

这是一个基于 Vue 3 和 Element Plus 的学生管理系统，提供了学生信息的增删改查功能。

## 功能

- **学生信息管理**：添加、编辑、删除学生信息。
- **筛选功能**：按班级和专业筛选学生。
- **搜索功能**：根据学号、姓名、班级、专业、入学年份进行搜索。
- **分页功能**：支持分页查看学生列表。

## 技术栈

- **Vue 3**：用于构建用户界面。
- **Element Plus**：用于 UI 组件库。
- **TypeScript**：用于类型检查和增强代码可读性。

## 项目结构

```
├── src
│   ├── api
│   │   └── student.ts          # 学生 API
│   ├── assets
│   │   └── styles
│   │       └── vue.svg         # 资源文件
│   ├── components
│   │   ├── layout
│   │   │   ├── MainContent.vue # 主内容组件
│   │   │   ├── SideMenu.vue    # 侧边菜单组件
│   │   └── HelloWorld.vue      # 示例组件
│   ├── router
│   │   └── index.ts            # 路由配置
│   ├── store
│   │   └── modules
│   │       └── student.ts      # 学生数据管理
│   ├── types
│   │   ├── element-plus.d.ts   # Element Plus 类型定义
│   │   └── student.ts          # 学生类型定义
│   ├── utils
│   │   └── request.ts          # 请求工具
│   └── views
│       └── student
│           ├── StudentAdd.vue  # 添加学生视图
│           ├── StudentEdit.vue # 编辑学生视图
│           └── StudentList.vue # 学生列表视图
├── App.vue                     # 根组件
├── index.html                  # 入口 HTML 文件
└── README.md                   # 项目说明文件
```

## 安装与运行

1. **克隆项目**：

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **安装依赖**：

   ```bash
   npm install
   ```

3. **运行项目**：

   ```bash
   npm run dev
   ```

4. **构建项目**：

   ```bash
   npm run build
   ```

## 使用说明

- 在搜索框中输入关键字进行搜索。
- 点击班级或专业筛选条件进行筛选。
- 点击表格中的编辑或删除按钮进行相应操作。

## 贡献

欢迎提交问题和贡献代码！请确保在提交之前运行所有测试并遵循代码风格指南。

## 许可证

该项目使用 MIT 许可证。