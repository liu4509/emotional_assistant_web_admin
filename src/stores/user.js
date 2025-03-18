import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/user'
// import { login as loginApi, getUserInfo as getUserInfoAPI } from '@/api/user'
// import router from '@/router'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const userInfo = ref(null)
    // access_token
    const accessToken = ref('')

    // 更新用户信息
    const setUserInfo = (userInfoReq) => {
      userInfo.value = userInfoReq
    }
    // 初始化
    // const initUserInfo = async () => {
    //   try {
    //     // 如果已经有token但没有用户信息，则获取用户信息
    //     if (!!accessToken.value && !userInfo.value) {
    //       const res = await getUserInfoAPI()
    //       console.log(res)
    //       userInfo.value = res.data.userInfo
    //     }
    //     return true
    //   } catch (error) {
    //     console.error('初始化用户信息失败:', error)
    //     clearUserState()
    //     router.replace('/login')
    //     return false
    //   }
    // }

    // 登录
    const login = async (username, password) => {
      try {
        const res = await loginApi({ username, password })
        if (res.data) {
          const { accessToken: userToken, userInfo: userInfoRes } = res.data

          // 更新状态
          userInfo.value = userInfoRes
          accessToken.value = userToken

          return true
        }
        return false
      } catch (error) {
        console.error('登录失败:', error)
        return false
      }
    }

    // 清除用户状态
    const clearUserState = () => {
      userInfo.value = null
      accessToken.value = ''
    }

    // 退出登录
    const logout = () => {
      clearUserState()
    }

    // 是否已登录
    const isLoggedIn = () => !!accessToken.value

    return {
      userInfo,
      accessToken,
      // initUserInfo,
      login,
      logout,
      isLoggedIn,
      setUserInfo,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['userInfo', 'accessToken'],
    },
  },
)
