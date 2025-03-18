<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/utils'
import { getUserList, adminUpdateUser } from '@/api/user'

// 定义组件名称
defineOptions({
  name: 'UsersIndex'
})

// 查询参数
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  username: '',
  email: ''
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

// 角色选项
const roleOptions = [
  { label: '管理员', value: '管理员' },
  { label: '用户', value: '用户' }
]

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  username: '',
  email: '',
  role: '',
  avatar: '',
  createTime: ''
})

// 编辑表单规则
const editRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 打开编辑对话框
const handleEdit = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 表单引用
const editFormRef = ref(null)

// 保存编辑
const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    const res = await adminUpdateUser(editForm.value)

    if (res.code === 200) {
      // 更新本地数据
      await fetchUserList()

      ElMessage.success('更新成功')
      editDialogVisible.value = false
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除用户API
    // const res = await deleteUser(row.id)

    // 更新本地数据
    const index = userList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      userList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

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

// 处理搜索
const handleSearch = () => {
  queryParams.value.pageNo = 1
  fetchUserList()
}

// 重置搜索
const resetSearch = () => {
  queryParams.value.username = ''
  queryParams.value.email = ''
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
          <div class="search-box">
            <el-form :inline="true" :model="queryParams">
              <el-form-item>
                <el-input v-model="queryParams.username" placeholder="用户名" clearable />
              </el-form-item>
              <el-form-item>
                <el-input v-model="queryParams.email" placeholder="邮箱" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <el-table :data="userList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column label="头像" width="100">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" v-model="editDialogVisible" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="头像">
          <div class="avatar-container">
            <el-avatar :size="100" :src="editForm.avatar" />
            <el-upload class="avatar-uploader" action="/api/upload/avatar" :show-file-list="false"
              :on-success="(res) => editForm.avatar = res.url" :on-error="() => ElMessage.error('上传失败，请重试')"
              accept="image/jpeg,image/png">
              <el-button size="small" type="primary">更换头像</el-button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-input :value="formatDate(editForm.createTime)" disabled />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
