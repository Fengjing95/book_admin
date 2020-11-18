<!--
 * @Date: 2020-11-03 15:24:13
 * @LastEditors: 小枫
 * @description: 动态管理
 * @LastEditTime: 2020-11-18 09:55:49
 * @FilePath: \book-admin\src\views\dynamic\Dynamic.vue
-->
<template>
  <div class="dynamic">
    <div style="display: flex;">
      <el-input size="small" style="width: 200px;" v-model="bdId" placeholder="输入书圈ID查询，按回车确认" @keyup.enter.native="searchByBdId" />
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="allPageNum"
        :reviewPageNum="pageNum"
        @current-change="currentPageChange"
      >
      </el-pagination>
    </div>
    <el-table :data="dynamicList" style="width: 100%">
      <el-table-column prop="did" label="ID" width="50px"> </el-table-column>
      <el-table-column prop="bdId" label="书圈ID" width="80px"> </el-table-column>
      <el-table-column label="发布时间" width="">
        <template slot-scope="scope">
          {{ scope.row.ddate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="likeNum" label="点赞" width="">
      </el-table-column>
      <el-table-column prop="reviewsNum" label="评论" width="">
      </el-table-column>
      <el-table-column label="作者" width="">
        <template slot-scope="scope">
          {{ scope.row.user.userName }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="">
        <template slot-scope="scope">
          <el-button type="primary" size="small" style="margin-right: 10px;" @click="checkDetail(scope.row)">查看</el-button>
          <el-popconfirm
            confirmButtonText="继续"
            cancelButtonText="再想想"
            icon="el-icon-info"
            iconColor="red"
            title="确定要删除动态？"
            @onConfirm="deleteDynamic(scope.row)"
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

    <el-dialog :visible.sync="checkDialog" style="text-align: left;">
      <div class="markdown-body" v-html="dialogHtml"></div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dynamicList: [],
        allPageNum: null,
        pageNum: 1,
        bdId: '',
        checkDialog: false,
        dialogHtml: ''
      }
    },
    watch: {
      bdId(newValue) {
        this.pageNum = 1
        if(!newValue) {
          this.getDynamicList()
        }
      }
    },
    methods: {
      checkDetail(row) {
        this.dialogHtml = row.dcontent
        this.checkDialog = true
      },
      searchByBdId() {
        this.$http.get(`/dynamic/querydynamic?bdId=${this.bdId}&pageNumber=${this.pageNum}&pageSize=10`).then(
          res => {
            if(res) {
              // console.log(res);
              this.dynamicList = res.data.obj.content;
              this.allPageNum = res.data.obj.totalPages;
            }
          }
        )
      },
      currentPageChange(val) {
        this.pageNum = val;
        this.getDynamicList();
      },
      getDynamicList() {
        this.$http.get(`/admin/dynamic/queryall?pageNumber=${this.pageNum}&pageSize=10&bdid=${this.bdId}`).then(
          res => {
            if(res) {
              // console.log(res);
              this.dynamicList = res.data.obj.content;
              this.allPageNum = res.data.obj.totalPages;
            }
          }
        )
      },
      deleteDynamic(row) {
        this.$http.get(`/admin/dynamic/deletedynamic?dynamicId=${row.did}`).then(
          res => {
            if(res) {
              this.$message.success('删除成功')
              this.getDynamicList()
            }
          }
        )
      }
    },
    created () {
      this.getDynamicList()
    },
  }
</script>

<style lang="less" scoped>

</style>