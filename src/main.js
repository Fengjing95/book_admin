/*
 * @Date: 2020-09-24 09:53:10
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-30 10:41:29
 * @FilePath: \book-admin\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import { Loading, Notification } from 'element-ui'
import { message as Message } from './plugins/resetMessage'
import md5 from 'md5'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueSocketIO from 'vue-socket.io'
import socket from 'socket.io-client';

// Socket
Vue.use(
  new VueSocketIO({
    debug: true,
    // connection: socket(`http://192.168.43.168:8081`, {
      connection: socket(`http://192.168.1.162:8081`, {
      path: '',
      transports: ['websocket', 'xhr-polling', 'jsonp-polling']
    }),
    vuex: {
      store,
      mutationPrefix: "SOCKET_",
      actionPrefix: ""
    },
  })
)

// 引入编辑器
Vue.use(mavonEditor)

// md5:密码加密使用
Vue.prototype.$md5 = md5

// 拼接图片地址
Vue.prototype.$photoHeader = 'http://192.168.1.162:8080/'
// Vue.prototype.$photoHeader = 'http://192.168.43.168:8080/'

Vue.config.productionTip = false

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true // 跨域
axios.defaults.baseURL = '/api' // baseUrl:方便修改http地址


// http request 请求拦截器
let loading
axios.interceptors.request.use(request => {
  loading = Loading.service({ fullscreen: true }) // 发出请求时启动加载动画
  request.headers.authorization = window.sessionStorage.getItem('token') // 请求头携带token
  return request
})
// http response 响应拦截器
axios.interceptors.response.use(response => {
  loading.close() // 关闭加载动画
  if (response.status === 200) { // 200状态码直接放行
    return Promise.resolve(response)
  } else {                       // 否则reject
    return Promise.reject(response)
  }
}, error => {
  loading.close()
  if (error.response.status) {
    // console.log(error.response);
    switch (error.response.status) {
      // 根据错误码拦截响应
      case 402:
        Message({
          type: 'error',
          message: error.response.data.msg
        });
        break;
      case 405:
        Message({
          type: 'error',
          message: error.response.data.msg
        });
        break;
      case 403:
        Message({
          type: 'error',
          message: '令牌过期或被非法修改请重新登陆'
        });
        window.localStorage.clear()
        store.commit('freshToken')
        router.push('/login')
        break;
      case 412:
        Notification.error({
          title: '错误',
          message: '参数错误'
        })
        break;
      case 414:
        Message.error({
          title: '错误',
          message: '请先登录'
        })
        break;
      case 413:
        Message.error({
          title: '错误',
          message: '异地登录，如果发生密码泄漏请尽快修改'
        })
        window.localStorage.clear()
        store.commit('freshToken')
        router.push('/login')
        break;
      default:
        Message({
          type: 'error',
          message: error.response.data.msg
        });
        break;
    }
  } else { // 没有获取响应
    Message({
      type: 'error',
      message: '连接服务器失败'
    });
  }
})
// TODO 500跳转页面

// 绑定axios到Vue原型
Vue.prototype.$http = axios

// 挂载过滤器=>格式化时间
Vue.filter('formatDate', function (date) {
  const n = new Date(date)
  return n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate()
    + ' ' + n.getHours() + ':' + n.getMinutes() + ':' + n.getSeconds()
})
// 挂载过滤器=>隐藏手机号中间4位
Vue.filter('hidePhone', function (val) {
  const reg = /^(\d{3})\d{4}(\d{4})$/
  if (val) {
    val = val.replace(reg, "$1****$2")
  }
  return val
})
// 挂载过滤器=>计算时间差
Vue.filter('intervalTime', function (startTime) {
  const endTime = new Date().getTime()
  const date = endTime - startTime

  // 计算相差天数
  const day = Math.floor(date / (24 * 3600 * 1000))
  // 计算相差小时
  const date2 = date % (24 * 3600 * 1000)
  const hour = Math.floor(date2 / (3600 * 1000))
  // 计算相差分钟
  const date3 = date2 % (3600 * 1000)
  const minutes = Math.floor(date3 / (60 * 1000))
  let result = ''
  if (day) {
    result = day + '天之前'
  } else if (hour) {
    result = hour + '小时之前'
  } else if (minutes) {
    result = minutes + '分钟之前'
  } else {
    result = '刚刚'
  }
  return result
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
