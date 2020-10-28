<!--
 * @Date: 2020-10-22 16:16:51
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-24 17:46:39
 * @FilePath: \book-admin\src\views\Layout.vue
-->
<template>
  <div id="layout">
    <el-container>
      <el-aside width="250px">
        <layout-aside />
      </el-aside>
      <el-container>
        <el-header style="background-color: #f5f5f5;">
          <layout-header />
        </el-header>
        <el-main style="padding: 17px 20px">
          <router-view v-if="isRouterAlive"/>
        </el-main>
        <el-footer style="height: 20px">
          <layout-footer />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LayoutAside from './LayoutItem/Aside';
import LayoutHeader from './LayoutItem/Header';
import LayoutFooter from './LayoutItem/Footer';
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  name: "layout",
  components: {
    LayoutAside,
    LayoutHeader,
    LayoutFooter,
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
          this.isRouterAlive = true
      })
    }
  },
}
</script>

<style lang="less" scoped>

</style>