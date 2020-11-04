<!--
 * @Date: 2020-11-03 15:24:06
 * @LastEditors: 小枫
 * @description: 书圈管理
 * @LastEditTime: 2020-11-04 10:16:34
 * @FilePath: \book-admin\src\views\dynamic\Discussion.vue
-->
<template>
  <div class="discussion">
    <el-table :data="bdList" style="width: 100%">
      <el-table-column prop="bdId" label="ID" width="50px"> </el-table-column>
      <el-table-column label="头像" width="50px">
        <template slot-scope="scope">
          <el-avatar shape="square" size="small" :src="$photoHeader+scope.row.bdPhoto"/>
        </template>
      </el-table-column>
      <el-table-column prop="bdName" label="书圈名称" width="200px"> </el-table-column>
      <el-table-column label="创建日期" width="100px">
        <template slot-scope="scope">
          {{ scope.row.bdDate | formatDate2 }}

        </template>
      </el-table-column>
      <el-table-column label="简介" width="">
        <template slot-scope="scope">
          <span style="font-size: 10px;">{{ scope.row.bdDes }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="peopleNum" label="人数" width="80px">
      </el-table-column>
      <el-table-column prop="userName" label="创建者" width="150px">
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-popconfirm
            confirmButtonText="继续"
            cancelButtonText="再想想"
            icon="el-icon-info"
            iconColor="red"
            title="确定要解散书圈吗？"
            @onConfirm="deleteDiscussion(scope.row)"
          >
            <el-button
              size="small"
              type="danger"
              slot="reference"
              >解散</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="allPageNum"
      :reviewPageNum="pageNum"
      @current-change="currentPageChange"
      style="flex: 1;"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bdList: [],
        allPageNum: null,
        pageNum: 1,
      }
    },
    methods: {
      getDiscussionList() {
        this.$http.get(`/admin/adminbd/querydiscussion?pageNumber=${this.pageNum}&pageSize=10`).then(
          res => {
            if(res) {
              // console.log(res);
              this.bdList = res.data.obj.content;
              this.allPageNum = res.data.obj.totalPages;
            }
          }
        )
      },
      deleteDiscussion(row) {
        this.$http.get(`/admin/adminbd/deletediscussion?discussionId=${row.bdId}`).then(
          res => {
            if(res) {
              this.$message.success('删除成功')
              this.getDiscussionList()
            }
          }
        )
      },
      currentPageChange(val) {
        this.pageNum = val;
        this.getDiscussionList();
      },
    },
    created () {
      this.getDiscussionList()
    },
  }
</script>

<style lang="less" scoped>

</style>