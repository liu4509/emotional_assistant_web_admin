import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
// const url = import.meta.env.VITE_API_BASE_URL
// console.log(url)
const service = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = JSON.parse(localStorage.getItem('user-store') || '{}')
    const token = userStore?.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200 && res.code !== 201) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    const res = error.response.data
    if (res) {
      console.log(res)
      switch (res.code) {
        case 400:
          ElMessage.error(res.data)
          router.replace('/login')
          break
        case 401:
          ElMessage.error(res.data)
          router.replace('/login')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(res.data || '请求错误')
      }
    } else {
      ElMessage.error('网络连接异常或请求超时')
    }
    return Promise.reject(error)
  },
)

export default service
