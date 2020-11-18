/*
 * @Date: 2020-10-22 15:44:58
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-18 19:19:07
 * @FilePath: \book-admin\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { Notification } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reportNumber: 0,
    token: window.sessionStorage.getItem('token'),
    peopleNum: 0
  },
  mutations: {
    freshToken(state) {
      state.token = window.sessionStorage.getItem('token')
    },
    setReportNum(state, num) {
      state.reportNumber = num
    },
    SOCKET_REPORT(state, repMsg) {
      state.reportNumber++
      Notification.success(repMsg)
    },
    SOCKET_peopleNum(state, num) {
      state.peopleNum = num
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getReportNum(state) {
      return state.reportNumber
    },
    getToken(state) {
      return state.token
    },
    getPeople(state) {
      return state.peopleNum
    }
  }
})
