<script setup>
import { ref, onMounted, onErrorCaptured } from 'vue'

const error = ref(null)

onMounted(() => {
  console.log('AppMain组件已挂载')
})

onErrorCaptured((err, instance, info) => {
  console.error('AppMain错误:', err)
  console.error('错误发生在组件:', instance)
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
  <section class="app-main">
    <div v-if="error" class="error-message">
      <h3>内容加载错误</h3>
      <p>{{ error.message }}</p>
    </div>
    <router-view v-else v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  padding: 20px;
  height: calc(100vh - 50px - 34px);
  overflow: auto;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

.error-message {
  background-color: #fff3f3;
  padding: 20px;
  border-radius: 4px;
  color: #f56c6c;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
