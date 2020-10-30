<!--
 * @Date: 2020-10-28 09:44:38
 * @LastEditors: 小枫
 * @description: 公告列表Page
 * @LastEditTime: 2020-10-30 12:08:07
 * @FilePath: \book-admin\src\views\notice\NoticeList.vue
-->
<template>
  <div class="notice-list">
    <el-table :data="noticeList" style="width: 100%">
      <el-table-column prop="noticeId" label="ID" width="80px">
      </el-table-column>
      <el-table-column label="发布时间" width="200px">
        <template slot-scope="scope">
          {{ scope.row.noticeDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="nums" label="已读人数" width="120px">
      </el-table-column>
      <el-table-column prop="noticeTitle" label="标题" width="450px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="chackNotice(scope.row)" size="small" style="margin-right: 10px">查看</el-button>
          <el-popconfirm
            confirmButtonText="继续"
            cancelButtonText="不用了"
            icon="el-icon-info"
            iconColor="red"
            title="确定要删除公告吗？"
            @onConfirm="deleteNotice(scope.row)"
          >
            <el-button
              size="small"
              type="danger"
              slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="allPageNumber"
      :reviewPageNum="pageNumber"
      @current-change="currentPageChange"
    >
    </el-pagination>

    <el-dialog :visible.sync="checkDialog" :title="check.noticeTitle" style="text-align: left;">
      <div class="markdown-body" v-html="check.noticeContent"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noticeList: [],
      pageNumber: 1,
      allPageNumber: null,
      check: {},
      checkDialog: false,
    };
  },
  methods: {
    getNoticeList() {
      this.$http
        .get(`/notice/querynotice?pageNumber=${this.pageNumber}&pageSize=10`)
        .then((res) => {
          if (res) {
            // console.log(res);
            this.noticeList = res.data.obj.content
            this.allPageNumber = res.data.obj.totalPages
          }
        });
    },
    chackNotice(row) {
      this.check = row;
      this.checkDialog = true;
    },
    deleteNotice(row) {
      // console.log(row.noticeId);
      this.$http.get(`/notice/deletenotice?noticeId=${row.noticeId}`).then(
        res => {
          if(res) {
            this.$message.success('删除成功')
            this.getNoticeList()
          }
        }
      )
    },
    currentPageChange(val) {
      this.pageNumber = val
    },
  },
  watch: {
    pageNumber() {
      this.getNoticeList()
    }
  },
  created() {
    this.getNoticeList()
  },
};
</script>

<style lang="less" scoped>
</style>