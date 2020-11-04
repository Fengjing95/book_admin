<!--
 * @Date: 2020-10-22 15:43:27
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-11-03 15:45:50
 * @FilePath: \book-admin\src\App.vue
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    getReport() {
      this.$http.get(`/report/queryreport?pageNumber=1&pageSize=1&type=2`).then(
        res => {
          if(res) {
            // console.log(res);
            this.$store.commit('setReportNum',res.data.obj.totalSize)
          }
        }
      )
    },
  },
  computed: {
    tn() {
      return this.$store.getters.getToken
    }
  },
  watch: {
    tn(newVal) {
      if(newVal !== null) {
        this.$socket.emit('set_info', {msg: newVal})
        this.getReport()
      }
    }
  },
  // created () {
  //   if(sessionStorage.getItem('token')) {
  //     this.getReport()
  //   }
  // },
  sockets: {
    connect() {
      if (sessionStorage.getItem('token')) {
        this.$socket.emit('set_info', {msg: this.$store.getters.getToken})
        this.getReport()
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
