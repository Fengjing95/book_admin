<!--
 * @Date: 2020-10-22 16:55:05
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-22 18:12:59
 * @FilePath: \book-admin\src\views\LayoutItem\Header.vue
-->
<template>
  <div class="header">
    {{$route.meta.title}}
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="less" scoped>
.header {
  background-color: #f5f5f5;
  line-height: 60px;
}
</style>