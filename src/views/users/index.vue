<script setup>
import { ref } from 'vue'

// 定义组件名称
defineOptions({
  name: 'UsersIndex'
})

const userList = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '正常' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '用户', status: '正常' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: '禁用' }
])
</script>

<template>
  <div class="users-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>用户管理</h3>
          <el-button type="primary" size="small">添加用户</el-button>
        </div>
      </template>

      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="用户名" width="180" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default>
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.users-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
