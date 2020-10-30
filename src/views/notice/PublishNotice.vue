<!--
 * @Date: 2020-10-28 09:45:29
 * @LastEditors: 小枫
 * @description: 发布公告
 * @LastEditTime: 2020-10-28 21:00:39
 * @FilePath: \book-admin\src\views\notice\PublishNotice.vue
-->
<template>
  <div class="publish-notice">
    <el-button type="primary" style="margin-bottom: 9px;" @click="publish">发布</el-button>
    <mavon-editor v-model="oldContent" @change="changeData" style="min-height: 600px;" ref="mavon"/>
  </div>
</template>
// TODO 动态管理
<script>
  export default {
    data() {
      return {
        oldContent: '',
        notice: {
          noticeContent: '',
        },
      };
    },
    methods: {
      changeData(value, render) {
        // console.log(value);
        // console.log(render);
        this.notice.noticeContent = render
      },
      publish() {
        this.$confirm('发布之后将不可修改, 是否需要再修改一下?', '提示', {
          confirmButtonText: '改好了',
          cancelButtonText: '再改改',
          type: 'info'
        }).then(() => {
          const noticeObj = {...this.notice}
          noticeObj.noticeContent.match(/<h1><[\s\S]+><\/[\s\S]+>([\s\S]+)<\/h1>/)
          noticeObj.noticeTitle = RegExp.$1
          // console.log(noticeObj);
          this.$http.post("/notice/releasenotice", noticeObj).then((res) => {
            if (res) {
              // console.log(res);
              this.$message.success('发布成功')
              this.$socket.emit('send_notice', res.data.obj)
              this.oldContent = ''
            }
          })
        }).catch((error) => {
          // console.log(error);
          error
        })
      }
    },
  }
</script>

<style lang="less" scoped>
.publish-notice {
  text-align: right;
}
</style>