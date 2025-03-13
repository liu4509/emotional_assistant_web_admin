import './assets/main.css'

import { createApp } from 'vue'
// 状态管理
import { createPinia } from 'pinia'
// UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import components from '@/components'

const app = createApp(App)

// 状态管理
app.use(createPinia())

// 路由
app.use(router)

// UI
app.use(ElementPlus)

// 自动注册全局组件
app.use(components)

app.mount('#app')