<!--
 * @Date: 2020-11-03 10:54:27
 * @LastEditors: 小枫
 * @description: 管理员操作日志
 * @LastEditTime: 2020-11-03 15:14:58
 * @FilePath: \book-admin\src\views\log\Log.vue
-->
<template>
  <div class="log">
    <el-table :data="logList" style="width: 100%">
      <el-table-column prop="logId" label="ID" width="">
      </el-table-column>
      <el-table-column label="操作时间" width="">
        <template slot-scope="scope">
          {{ scope.row.logDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="logOperate" label="操作内容" width="">
      </el-table-column>
      <el-table-column prop="userId" label="操作人" width="">
      </el-table-column>
      <el-table-column prop="logIp" label="登录IP" width="">
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logList: [],
        pageNumber: 1,
        allPageNumber: null,
      }
    },
    methods: {
      currentPageChange(val) {
        this.pageNumber = val
      },
      getLogList() {
        this.$http.get(`/admin/log/querylog?pageNumber=1&pageSize=10`).then(
          res => {
            if(res) {
              this.logList = res.data.obj.content
              this.allPageNumber = res.data.obj.totalPages
            }
          }
        )
      }
    },
    watch: {
      pageNumber() {
        this.getLogList()
      }
    },
    created() {
      this.getLogList()
    },
  }
</script>

<style lang="less" scoped>
.log {

}
</style>