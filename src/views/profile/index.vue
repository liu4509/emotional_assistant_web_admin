<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { formatDate, uploadImageUtil } from '@/utils/utils'
import { getUserInfo, adminUpdateUser, updateAdminPassword, sendVerifyCodeAPI } from '@/api/user'

defineOptions({
  name: 'ProfilePage',
})

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || {})

// 表单数据
const form = ref({
  username: userInfo.value.username || '',
  email: userInfo.value.email || '',
  avatar: userInfo.value.avatar || '',
})

// 是否正在编辑
const isEditing = ref(false)

// 加载状态
const loading = ref(false)

// 获取最新用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true
    const res = await getUserInfo()
    if (res.code === 200) {
      // 更新store中的用户信息
      userStore.setUserInfo(res.data.userInfo)
    } else {
      ElMessage.error(res.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取最新用户信息
onMounted(() => {
  fetchUserInfo()
})

// 开始编辑
const startEdit = () => {
  form.value = {
    username: userInfo.value.username || '',
    email: userInfo.value.email || '',
    avatar: userInfo.value.avatar || '',
  }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}

// 保存修改
const saveChanges = async () => {
  try {
    loading.value = true
    const userData = {
      id: userInfo.value.id,
      username: form.value.username,
      email: form.value.email,
      avatar: form.value.avatar
    }

    const res = await adminUpdateUser(userData)

    if (res.code === 201) {
      // 更新本地用户信息
      await fetchUserInfo()
      ElMessage.success('个人信息更新成功')
      isEditing.value = false
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败，请重试')
  } finally {
    loading.value = false
  }
}

// 修改密码对话框
const passwordDialogVisible = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  verifyCode: ''
})
const isVerifyCodeSending = ref(false)
const countdown = ref(0)
let timer = null

// 表单验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
}

// 发送验证码
const sendVerifyCode = async () => {
  try {
    isVerifyCodeSending.value = true
    // 过期时间 （秒）
    countdown.value = 60

    // TODO: 调用发送验证码API
    const res = await sendVerifyCodeAPI({
      address: userInfo.value.email,
      ttl: countdown.value
    })
    if (res.code === 200) {
      // 开始倒计时
      timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(timer)
          isVerifyCodeSending.value = false
        }
      }, 1000)

      ElMessage.success('验证码已发送')
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送验证码失败，请重试')
    isVerifyCodeSending.value = false
  }
}

// 提交修改密码
const passwordFormRef = ref(null)
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    ElMessage.error('新密码不能与当前密码相同')
    return
  }

  try {
    await passwordFormRef.value.validate()
    const res = await updateAdminPassword({
      currentPassword: passwordForm.value.currentPassword,
      password: passwordForm.value.newPassword,
      verifyCode: passwordForm.value.verifyCode
    })

    if (res.code === 201) {
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
      resetPasswordForm()
    } else {
      ElMessage.error(res.message || '修改密码失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败，请重试')
  }
}

// 重置表单
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    verifyCode: ''
  }
}

// 关闭对话框时清理
const handleDialogClose = () => {
  resetPasswordForm()
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  countdown.value = 0
  isVerifyCodeSending.value = false
}
// 处理头像上传
const handleAvatarChange = async (event) => {
  try {
    loading.value = true
    const url = await uploadImageUtil(event)
    form.value.avatar = url
    userInfo.value.avatar = url
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    loading.value = false
  }
}
// const handleAvatarChange = async (event) => {
//   const file = event.target.files[0]
//   if (!file) return

//   // 验证文件类型
//   if (!['image/jpeg', 'image/png'].includes(file.type)) {
//     ElMessage.error('只能上传JPG/PNG格式的图片')
//     return
//   }

//   // 验证文件大小（最大2MB）
//   if (file.size / 1024 / 1024 > 2) {
//     ElMessage.error('图片大小不能超过2MB')
//     return
//   }

//   // 创建FormData
//   const formData = new FormData()
//   formData.append('file', file)

//   try {
//     loading.value = true
//     const res = await uploadImage(formData)

//     if (res.code === 201 && res.data?.md5) {
//       form.value.avatar = res.data.links.url
//       userInfo.value.avatar = form.value.avatar
//       ElMessage.success('头像上传成功')
//     } else {
//       ElMessage.error(res.message || '上传失败')
//     }
//   } catch (error) {
//     console.error('头像上传失败:', error)
//     ElMessage.error('上传失败，请重试')
//   } finally {
//     loading.value = false
//   }
// }
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <el-card class="profile-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
            <el-button v-if="!isEditing" type="primary" @click="startEdit">编辑</el-button>
            <div v-else>
              <el-button type="primary" @click="saveChanges" :loading="loading">保存</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </div>
          </div>
        </template>

        <div class="profile-content">
          <div class="avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar" />
            <div v-if="isEditing" class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleAvatarChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                更换头像
              </el-button>
            </div>
          </div>

          <div class="info-container">
            <el-form :model="form" label-width="100px">
              <el-form-item label="用户名">
                <span v-if="!isEditing">{{ userInfo.username }}</span>
                <el-input v-else v-model="form.username" disabled />
              </el-form-item>

              <el-form-item label="邮箱">
                <span v-if="!isEditing">{{ userInfo.email || '-' }}</span>
                <el-input v-else v-model="form.email" />
              </el-form-item>

              <el-form-item label="角色">
                <el-tag type="success">{{ userInfo.roles?.[0] }}</el-tag>
              </el-form-item>

              <el-form-item label="注册时间">
                <span>{{ formatDate(userInfo.createTime) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>

      <el-card class="security-card">
        <template #header>
          <div class="card-header">
            <span>安全设置</span>
          </div>
        </template>

        <el-form label-width="100px">
          <el-form-item label="修改密码">
            <el-button type="primary" @click="passwordDialogVisible = true">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" v-model="passwordDialogVisible" width="500px" @close="handleDialogClose" append-to-body>
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px" status-icon>
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" placeholder="请输入当前密码" show-password />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>

        <el-form-item label="验证码" prop="verifyCode">
          <div class="verify-code-container">
            <el-input v-model="passwordForm.verifyCode" placeholder="请输入验证码" style="width: 200px" />
            <el-button type="primary" :disabled="isVerifyCodeSending" @click="sendVerifyCode">
              {{ isVerifyCodeSending ? `${countdown}秒后重试` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-page {
  height: 100%;
}

.profile-container {
  padding: 20px;
}

.profile-card,
.security-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  display: flex;
  gap: 40px;
  padding: 20px 0;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.info-container {
  flex: 1;
}

.el-button+.el-button {
  margin-left: 10px;
}

.verify-code-container {
  display: flex;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
