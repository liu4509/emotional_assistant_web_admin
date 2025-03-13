<script setup>
import { ref, onMounted } from 'vue'
import SideBar from '@/components/layout/SideBar.vue'
import NavBar from '@/components/layout/NavBar.vue'
import TagsView from '@/components/layout/TagsView.vue'
import AppMain from '@/components/layout/AppMain.vue'

// 定义组件名称
defineOptions({
  name: 'LayoutContainer',
})

const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

onMounted(() => {
  console.log('LayoutContainer mounted')
  console.log('SideBar component:', SideBar)
  console.log('NavBar component:', NavBar)
  console.log('TagsView component:', TagsView)
  console.log('AppMain component:', AppMain)
})
</script>

<template>
  <div class="app-wrapper" :class="{ 'is-collapse': isCollapse }">
    <div class="sidebar-container">
      <SideBar :collapse="isCollapse" />
    </div>

    <div class="main-container">
      <div class="fixed-header">
        <NavBar :collapse="isCollapse" @toggle-sidebar="toggleSidebar" />
        <TagsView />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
}

.sidebar-container {
  transition: width 0.28s;
  width: 210px;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.is-collapse .sidebar-container {
  width: 54px;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 210px;
  position: relative;
  width: calc(100% - 210px);
}

.is-collapse .main-container {
  margin-left: 54px;
  width: calc(100% - 54px);
}

.fixed-header {
  position: relative;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  transition: width 0.28s;
}
</style>
