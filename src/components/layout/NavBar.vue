<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUser } from '@/composables/useUser'

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}
const userStore = useUser()

// 从store获取用户信息
const userInfo = computed(() => userStore.userInfo.value || {})
const avatar = computed(() => userInfo.value?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
const username = computed(() => userInfo.value?.username || '用户')

const handleCommand = (command) => {
  if (command === 'logout') {
    // 退出登录
    userStore.logout()
    router.replace('/login')
    ElMessage.success('退出成功')
  } else if (command === 'profile') {
    // 跳转到个人信息页
    router.push('/profile')
  }
}
</script>

<template>
  <div class="navbar">
    <div class="left-menu">
      <div class="hamburger-container" @click="toggleSidebar">
        <el-icon :size="20">
          <component :is="props.collapse ? 'Expand' : 'Fold'" />
        </el-icon>
      </div>
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>当前页面</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="right-menu">
      <el-tooltip content="全屏" effect="dark" placement="bottom">
        <div class="right-menu-item">
          <el-icon>
            <FullScreen />
          </el-icon>
        </div>
      </el-tooltip>

      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <el-avatar :size="30" :src="avatar" />
          <span class="username">{{ username }}</span>
          <el-icon>
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-menu {
  display: flex;
  align-items: center;
}

.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  padding: 0 15px;
}

.hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}

.breadcrumb-container {
  margin-left: 8px;
}

.right-menu {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 16px;
}

.right-menu-item {
  padding: 0 8px;
  cursor: pointer;
  font-size: 18px;
  color: #606266;
}

.avatar-container {
  margin-right: 10px;
  margin-left: 10px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 5px;
}
</style>
