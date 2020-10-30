<!--
 * @Date: 2020-10-22 15:43:27
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-30 12:08:52
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
            
            this.$store.commit('setReportNum',res.data.obj.totalSize)
          }
        }
      )
    },
  },
  created () {
    this.getReport()
  },
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
