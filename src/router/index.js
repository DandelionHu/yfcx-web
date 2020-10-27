import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true, // 不展示
    children: [
      {
        path: '/redirect/:path(.*)', // 动态路由
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/dashboard'),
        name: 'dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true // 始终附着在tagview上
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/news',
    component: Layout,
    redirect: '/news/newList',
    name: 'news',
    meta: {
      title: '新闻资讯',
      icon: 'edit',
      roles: ['admin']
    },
    children: [
      {
        path: '/news/newsTag',
        component: () => import('@/views/news/newsTag'),
        name: 'newsTag',
        meta: {
          title: '新闻标签',
          roles: ['admin']
        }
      },
      {
        path: '/news/newList',
        component: () => import('@/views/news/newsList'),
        name: 'newsList',
        meta: {
          title: '新闻列表',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/addAuthority',
    name: 'setting',
    meta: {
      title: '系统设置',
      icon: 'edit'
    },
    children: [
      {
        path: '/setting/addAuthority',
        component: () => import('@/views/baseAuthority/addAuthority'),
        name: 'addAuthority',
        meta: {
          title: '权限控制'
        }
      }
    ]
  },
  // 没匹配到的路由重定向到404
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置路由: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
