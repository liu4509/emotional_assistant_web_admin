<script setup>
import { useRouter } from 'vue-router'

defineProps({
  error: {
    type: Object,
    default: null
  }
})

const router = useRouter()

const reload = () => {
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div v-if="error" class="error-container">
    <el-result icon="error" title="应用出错了" :sub-title="error.message || '未知错误'">
      <template #extra>
        <div class="error-details">
          <pre v-if="error.stack" class="error-stack">{{ error.stack }}</pre>
          <div v-if="error.info" class="error-info">{{ error.info }}</div>
        </div>
        <div class="error-actions">
          <el-button type="primary" @click="reload">重新加载页面</el-button>
          <el-button @click="goHome">返回首页</el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.error-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}

.error-details {
  text-align: left;
  margin-bottom: 20px;
}

.error-stack {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-size: 12px;
}

.error-info {
  margin-top: 10px;
  color: #909399;
}

.error-actions {
  margin-top: 20px;
}
</style>
