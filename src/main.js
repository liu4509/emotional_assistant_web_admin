import './assets/main.css'

import { createApp } from 'vue'
// 状态管理
import { createPinia } from 'pinia'
// UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import components from '@/components'
import { useUserStore } from '@/stores/user'

const app = createApp(App)

// 状态管理
const pinia = createPinia()
app.use(pinia)

// 初始化用户状态
const userStore = useUserStore()
userStore.initUserInfo()

// 路由
app.use(router)

// UI
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 自动注册全局组件
app.use(components)

app.mount('#app')
