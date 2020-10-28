/*
 * @Date: 2020-10-22 15:44:18
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-28 09:47:09
 * @FilePath: \book-admin\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('../views/Home'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/userlist',
        component: () => import('../views/user/UserList'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/freezelist',
        component: () => import('../views/user/FreezeList'),
        meta: {
          title: '已冻结用户'
        }
      },
      {
        path: '/noticelist',
        component: () => import('../views/notice/NoticeList'),
        meta: {
          title: '公告列表'
        }
      },
      {
        path: '/publishnotice',
        component: () => import('../views/notice/PublishNotice'),
        meta: {
          title: '发布公告'
        }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About'),
        meta: {
          title: '关于'
        }
      },
    ],
    beforeEnter: (to, from, next) => {
      if (window.sessionStorage.getItem('token')) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
]

const router = new VueRouter({
  routes
})

export default router
