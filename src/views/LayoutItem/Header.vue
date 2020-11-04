<!--
 * @Date: 2020-10-22 16:55:05
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-11-03 15:46:27
 * @FilePath: \book-admin\src\views\LayoutItem\Header.vue
-->
<template>
  <div class="header">
    <div class="title">{{$route.meta.title}}</div>
    <el-button class="btn" type="danger" @click="exit">退出</el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      exit() {
        this.$http.get('/user/logout').then(
          res => {
            if(res) {
              sessionStorage.clear()
              this.$store.commit('freshToken')
              this.$router.push('/login')
            }
          }
        )
      }
    },
  }
</script>

<style lang="less" scoped>
.header {
  background-color: #f5f5f5;
  line-height: 60px;
  position: relative;
  .btn {
    position: absolute;
    top: 9px;
    right: 20px;
  }
}
</style>