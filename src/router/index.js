import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页', icon: 'HomeFilled', affix: true },
        },
      ],
    },
    {
      path: '/users',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Users',
          component: () => import('@/views/users/index.vue'),
          meta: { title: '用户管理', icon: 'User' },
        },
      ],
    },
    {
      path: '/emotions',
      component: Layout,
      name: 'Emotions',
      meta: { title: '情感分析', icon: 'DataAnalysis' },
      children: [
        {
          path: 'records',
          name: 'EmotionRecords',
          component: () => import('@/views/emotions/records.vue'),
          meta: { title: '分析记录' },
        },
        {
          path: 'statistics',
          name: 'EmotionStatistics',
          component: () => import('@/views/emotions/statistics.vue'),
          meta: { title: '统计报表' },
        },
      ],
    },
    {
      path: '/settings',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Settings',
          component: () => import('@/views/settings/index.vue'),
          meta: { title: '系统设置', icon: 'Setting' },
        },
      ],
    },
  ],
})

// 添加导航守卫，帮助调试
router.beforeEach((to, from, next) => {
  console.log('路由变化:', { from: from.path, to: to.path })
  next()
})

router.onError((error) => {
  console.error('路由错误:', error)
})

export default router
