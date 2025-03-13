import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoAPI } from '@/api/user'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(null)
  // access_token
  const accessToken = ref('')
  // const refreshToken = ref('')

  // 初始化
  const initUserInfo = async () => {
    try {
      // 从localStorage中获取用户信息和token
      const storedToken = localStorage.getItem('access_token') || ''
      console.log(storedToken)

      // 如果在store中获取不到用户信息，则从通过api获取
      if (!storedToken && !userInfo.value?.username) {
        const res = await getUserInfoAPI()
        userInfo.value = res.data.userInfo
      }

      return userInfo

    } catch (error) {
      console.error('初始化用户信息失败:', error)
      router.replace('/login')
      return false
    }
  }

  // 登录
  const login = async (username, password) => {
    try {
      const res = await loginApi({ username, password })
      console.log(res)
      if (res.data) {
        const { accessToken: userToken, userInfo : userInfoRes } = res.data

        // 更新状态
        userInfo.value = userInfoRes
        accessToken.value = userToken

        // 存储到localStorage
        localStorage.setItem('access_token', userToken)

        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 退出登录
  const logout = () => {
    // 清除状态
    userInfo.value = null
    accessToken.value = ''

    // 清除localStorage
    localStorage.removeItem('access_token')
  }

  // 是否已登录
  const isLoggedIn = () => !!accessToken.value

  return {
    userInfo,
    accessToken,
    initUserInfo,
    login,
    logout,
    isLoggedIn
  }
})
