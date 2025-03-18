<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/utils'
import { getUserList } from '@/api/user'

// 定义组件名称
defineOptions({
  name: 'UsersIndex'
})
// 查询参数
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})
// 总记录数
const total = ref(0)
// 加载状态
const loading = ref(false)
// 用户列表数据
const userList = ref([])
// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const res = await getUserList(queryParams.value)

    if (res.code === 200) {
      userList.value = res.data.users || []
      total.value = res.data.totalCount || 0
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败，请重试')
  } finally {
    loading.value = false
  }
}
// 组件挂载时获取用户列表
onMounted(() => {
  fetchUserList()
})
// 处理页码变更
const handleCurrentChange = (page) => {
  queryParams.value.pageNo = page
  fetchUserList()
}
// 处理每页条数变更
const handleSizeChange = (size) => {
  queryParams.value.pageSize = size
  queryParams.value.pageNo = 1
  fetchUserList()
}
</script>

<template>
  <div class="users-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>用户管理</h3>
        </div>
      </template>

      <el-table :data="userList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="230" />
        <el-table-column prop="roles" label="角色" width="130" />
        <el-table-column prop="permissions" label="权限" width="200">
          <template #default="scope">
            <el-space> <el-tag v-for="item in scope.row.permissions" :key="item.id" type="success">
                {{ item.code }}
              </el-tag></el-space>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="150">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="220">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="queryParams.pageNo" v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
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
  flex-wrap: wrap;
  gap: 10px;
}

.search-box {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
