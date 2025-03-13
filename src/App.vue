<script setup>
// App.vue - 应用入口文件
import { onErrorCaptured, ref } from 'vue'
import ErrorHandler from '@/components/ErrorHandler.vue'

const error = ref(null)

// 捕获错误
onErrorCaptured((err, instance, info) => {
  console.error('应用错误:', err)
  console.error('错误组件:', instance)
  console.error('错误信息:', info)
  error.value = {
    message: err.message,
    stack: err.stack,
    info
  }
  return false // 阻止错误继续传播
})
</script>

<template>
  <div class="app-container">
    <!-- 使用错误处理组件 -->
    <ErrorHandler v-if="error" :error="error" />

    <!-- 路由视图 -->
    <router-view v-else />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}

.app-container {
  height: 100%;
}

.error-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff3f3;
  border: 1px solid #ffcccb;
  border-radius: 4px;
}

.error-message {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 10px;
}

.error-stack {
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
  max-height: 300px;
  font-size: 12px;
}

.error-info {
  margin-top: 10px;
  color: #909399;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #909399;
}
</style>
