import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import { useUser } from '@/composables/useUser'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', noAuth: true },
    },
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
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: '个人信息', hidden: true },
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
    {
      path: '/tourism',
      component: Layout,
      meta: { title: '旅游推荐管理', icon: 'Location' },
      children: [
        {
          path: 'recommendations',
          name: 'TourismRecommendations',
          component: () => import('@/views/tourism/recommendations.vue'),
          meta: { title: '景点推荐', icon: 'Star' },
        },
        {
          path: 'check-ins',
          name: 'TourismCheckIns',
          component: () => import('@/views/tourism/check-ins.vue'),
          meta: { title: '打卡图片', icon: 'Picture' },
        },
      ],
    },
    {
      path: '/media',
      component: Layout,
      meta: { title: '媒体管理', icon: 'Film' },
      children: [
        {
          path: 'music',
          name: 'MediaMusic',
          component: () => import('@/views/media/music.vue'),
          meta: { title: '音乐推荐', icon: 'Headset' },
        },
        {
          path: 'video',
          name: 'MediaVideo',
          component: () => import('@/views/media/video.vue'),
          meta: { title: '视频推荐', icon: 'VideoCamera' },
        },
      ],
    },
  ],
})

// TODO:添加导航守卫，实现权限控制
router.beforeEach((to, from, next) => {
  console.log('路由变化:', { from: from.path, to: to.path })
  const { accessToken } = useUser()
  // 获取登录状态
  const token = accessToken.value

  if (to.meta.noAuth) {
    // 不需要身份验证的页面
    if (token && to.path === '/login') {
      // 如果已登录且访问的是登录页，重定向到首页
      next('/')
    } else {
      next()
    }
  } else {
    // 需要身份验证的页面
    if (token) {
      next()
    } else {
      // 未登录，重定向到登录页
      next('/login')
    }
  }
})

router.onError((error) => {
  console.error('路由错误:', error)
})

export default router
