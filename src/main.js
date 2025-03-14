import './assets/main.css'

import { createApp } from 'vue'
// 状态管理
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import components from '@/components'
import { userPlugin } from '@/plugins/user'
// import { useUser } from '@/composables/useUser'

const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()
// 使用持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 使用用户插件
app.use(userPlugin)
// useUser().initUserInfo()

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
