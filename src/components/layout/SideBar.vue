<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const activeMenu = computed(() => route.path)

const menuItems = [
  {
    title: '首页',
    icon: 'HomeFilled',
    path: '/dashboard',
    children: [],
  },
  {
    title: '用户管理',
    icon: 'User',
    path: '/users',
    children: [],
  },
  {
    title: '旅游推荐管理',
    icon: 'Location',
    path: '/tourism',
    children: [
      {
        title: '景点推荐',
        path: '/tourism/recommendations',
      },
      {
        title: '统计报表',
        path: '/tourism/check-ins',
      },
    ],
  },
  {
    title: '音乐视频管理',
    icon: 'Location',
    path: '/tourismss',
    children: [
      {
        title: '音乐推荐',
        path: '/tourism/recommendationsss',
      },
      {
        title: '视频推荐',
        path: '/tourism/check-insss',
      },
    ],
  },
  {
    title: '心理知识宣传管理',
    icon: 'Location',
    path: '/tourismssss',
    children: [
      {
        title: '心理文章推荐',
        path: '/tourism/recommendationsssss',
      },
      {
        title: '心理视频推荐',
        path: '/tourism/check-insssss',
      },
    ],
  },
  {
    title: '情绪调节训练管理',
    icon: 'Setting',
    path: '/settingsaa',
    children: [],
  },
  {
    title: '心情测评管理',
    icon: 'Setting',
    path: '/settingsaa',
    children: [],
  },
  // {
  //   title: '情感分析',
  //   icon: 'DataAnalysis',
  //   path: '/emotions',
  //   children: [
  //     {
  //       title: '分析记录',
  //       path: '/emotions/records',
  //     },
  //     {
  //       title: '统计报表',
  //       path: '/emotions/statistics',
  //     },
  //   ],
  // },
  {
    title: '系统设置',
    icon: 'Setting',
    path: '/settings',
    children: [],
  },
]
</script>

<template>
  <div class="sidebar-container">
    <el-scrollbar>
      <el-menu :default-active="activeMenu" class="sidebar-menu" :collapse="props.collapse" background-color="#304156"
        text-color="#bfcbd9" active-text-color="#409EFF" unique-opened router>
        <template v-for="item in menuItems" :key="item.path">
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="item.path">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sidebar-container {
  height: 100%;
  background-color: #304156;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 210px;
}
</style>
