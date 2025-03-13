<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 定义组件名称
defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const userStore = useUserStore()

// 登录表单数据
const loginForm = reactive({
  username: 'lww',
  password: '123456',
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' },
  ],
}

const loginFormRef = ref(null)
const loading = ref(false)

// 登录方法
const handleLogin = async () => {
  if (!loginFormRef.value) return

  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true

      try {
        // 调用store的登录方法
        const success = await userStore.login(loginForm.username, loginForm.password)

        if (success) {
          ElMessage.success('登录成功')
          // 跳转到首页
          router.push('/')
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请重试')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请正确填写登录信息')
      return false
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">
        <h2>情感助手管理系统</h2>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" size="large" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" size="large"
            autocomplete="off" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" size="large" class="login-button" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div class="tips">
          <p>默认用户名: lww</p>
          <p>默认密码: 123456</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY3ZmEiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMCAwaDQwdjQwSDB6TTAgMGgyMHYyMEgwek0yMCAyMGgyMHYyMEgyMHoiLz48L2c+PC9nPjwvc3ZnPg==');
}

.login-card {
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.title h2 {
  font-size: 24px;
  color: #409EFF;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}

.tips {
  margin-top: 20px;
  font-size: 14px;
  color: #909399;
}

.tips p {
  margin: 5px 0;
}
</style>
