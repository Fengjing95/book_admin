<!--
 * @Date: 2020-10-22 16:33:32
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-11-18 21:26:18
 * @FilePath: \book-admin\src\views\LayoutItem\Aside.vue
-->
<template>
  <div class="aside">
    <el-menu
      default-active="index"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      router
    >
      <h2 style="line-height: 80px;color: #fff;">书源</h2>
      <el-menu-item index="index">
        首页
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="userlist">用户列表</el-menu-item>
        <el-menu-item index="freezelist">冻结记录</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-claim"></i>
          <span>公告管理</span>
        </template>
        <el-menu-item index="noticelist">公告列表</el-menu-item>
        <el-menu-item index="publishnotice">发布公告</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-help"></i>
          <span>书圈管理</span>
        </template>
        <el-menu-item index="discussion">书圈列表</el-menu-item>
        <el-menu-item index="dynamic">动态列表</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-management"></i>
          <span>书籍管理</span>
        </template>
        <el-menu-item index="booklist">书籍列表</el-menu-item>
        <el-menu-item index="uploadbook">上传书籍</el-menu-item>
        <el-menu-item index="type">分类管理</el-menu-item>
      </el-submenu>

      <el-menu-item index="carousel">
        轮播管理
      </el-menu-item>

      <el-menu-item index="report">
        处理举报
        <el-badge v-show="$store.getters.getReportNum!==0" :value="$store.getters.getReportNum" :max="99">
        </el-badge>
      </el-menu-item>

      <el-menu-item index="log">
        操作日志
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.aside {
  height: 100vh;
  background-color: #545C64;
  
  .el-menu{
      border-right-width: 0;
  }
}
</style>