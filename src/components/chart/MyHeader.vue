<!--
 * @Date: 2020-11-18 18:30:05
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-18 21:27:50
 * @FilePath: \book-admin\src\components\chart\MyHeader.vue
-->
<template>
  <div class="header">
    <div class="book-count">
      <i class="el-icon-s-management"></i>
      <div class="content">
        <div class="text">书籍资源</div>
        <div class="value">{{bookCount}}本</div>
      </div>
    </div>
    <div class="discussion-count">
      <i class="el-icon-s-help"></i>
      <div class="content">
        <div class="text">书圈</div>
        <div class="value">{{discussionCount}}个</div>
      </div>
    </div>
    <div class="online-user">
      <i class="el-icon-user-solid"></i>
      <div class="content">
        <div class="text">当前在线</div>
        <div class="value">{{$store.getters.getPeople}}人</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      bookCount: Number,
      discussionCount: Number,
    },
  }
</script>

<style lang="less" scoped>
@width: 350px;
@height: 100px;
@border: solid 1px #f0f0f0;
@border-radius: 10px;
@background-color: #f5f5f5;
.header {
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px 60px;
  .book-count {
    width: @width;
    height: @height;
    border: @border;
    border-radius: @border-radius;
    background-color: @background-color;
    position: relative;
    margin: 10px 0;
    i {
      font-size: 60px;
      margin-top: 20px;
      position: relative;
      right: 120px;
      color: #52CECC;
    }
    .content {
      height: 60px;
      position: absolute;
      top: 20px;
      right: 40px;
      .text {
        font-size: 20px;
        color: #777;
      }
      .value {
        margin-top: 15px;
      }
    }
  }
  .discussion-count {
    width: @width;
    height: @height;
    border: @border;
    border-radius: @border-radius;
    background-color: @background-color;
    position: relative;
    margin: 10px 0;
    i {
      font-size: 60px;
      margin-top: 20px;
      position: relative;
      right: 120px;
      color: #36A3F7;
    }
    .content {
      height: 60px;
      position: absolute;
      top: 20px;
      right: 40px;
      .text {
        font-size: 20px;
        color: #777;
      }
      .value {
        margin-top: 15px;
      }
    }
  }
  .online-user {
    width: @width;
    height: @height;
    border: @border;
    border-radius: @border-radius;
    background-color: @background-color;
    position: relative;
    margin: 10px 0;
    i {
      font-size: 60px;
      margin-top: 20px;
      position: relative;
      right: 120px;
      color: #F4516C;
    }
    .content {
      height: 60px;
      position: absolute;
      top: 20px;
      right: 40px;
      .text {
        font-size: 20px;
        color: #777;
      }
      .value {
        margin-top: 15px;
      }
    }
  }
}
</style>