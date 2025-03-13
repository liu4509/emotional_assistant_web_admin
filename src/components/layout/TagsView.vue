<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 标签页列表
const visitedViews = ref([
  {
    path: '/dashboard',
    title: '首页',
    name: 'Dashboard',
    affix: true,
  },
])

// 当前激活的路径
const activePath = ref('/dashboard')

// 添加标签
const addView = (view) => {
  const { path, meta, name } = view
  if (visitedViews.value.some((v) => v.path === path)) return
  visitedViews.value.push({
    path,
    title: meta?.title || '未命名',
    name,
    affix: meta?.affix || false,
  })
}

// 监听路由变化，添加标签
watch(
  () => route.path,
  (val) => {
    if (val !== '/login') {
      addView(route)
      activePath.value = val
    }
  },
  { immediate: true },
)

// 关闭标签
const closeView = (view) => {
  const index = visitedViews.value.findIndex((v) => v.path === view.path)
  if (index === -1) return

  visitedViews.value.splice(index, 1)

  // 如果关闭的是当前激活的标签，则跳转到最后一个标签
  if (view.path === activePath.value) {
    toLastView(index)
  }
}

// 跳转到最后一个标签
const toLastView = (index) => {
  const latestView = visitedViews.value[index - 1]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

// 点击标签
const clickTag = (view) => {
  if (view.path === activePath.value) return
  router.push(view.path)
}
</script>

<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <div class="tags-view-item" v-for="tag in visitedViews" :key="tag.path"
        :class="{ active: activePath === tag.path }" @click="clickTag(tag)">
        <span>{{ tag.title }}</span>
        <el-icon v-if="!tag.affix" class="close-icon" @click.stop="closeView(tag)">
          <Close />
        </el-icon>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tags-view-wrapper .el-scrollbar__wrap {
  height: 34px;
}

.tags-view-wrapper .el-scrollbar__view {
  height: 34px;
  display: flex;
  align-items: center;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  height: 26px;
  line-height: 26px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
  border-radius: 3px;
  cursor: pointer;
}

.tags-view-item:first-of-type {
  margin-left: 15px;
}

.tags-view-item.active {
  background-color: #42b983;
  color: #fff;
  border-color: #42b983;
}

.close-icon {
  margin-left: 5px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s;
  font-size: 12px;
}

.close-icon:hover {
  background-color: #b4bccc;
  color: #fff;
}
</style>
