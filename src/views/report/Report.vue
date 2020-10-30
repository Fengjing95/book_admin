<!--
 * @Date: 2020-10-29 20:41:29
 * @LastEditors: 小枫
 * @description: 处理举报
 * @LastEditTime: 2020-10-30 12:56:39
 * @FilePath: \book-admin\src\views\report\Report.vue
-->
<template>
  <div class="report">
    <div style="text-align: left;display: flex;">
      <el-select v-model="type" placeholder="请选择分类">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="allPageNumber"
        :reviewPageNum="pageNumber"
        @current-change="currentPageChange"
        style="flex: 1;"
      >
      </el-pagination>
    </div>
    <el-table :data="reportList" style="width: 100%">
      <el-table-column prop="reportId" label="ID" width="80px">
      </el-table-column>
      <el-table-column label="提交时间" width="200px">
        <template slot-scope="scope">
          {{ scope.row.reportDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="举报人" width="120px">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.reportType===0">{{scope.row.reportTypeName}}</el-tag>
          <el-tag v-else-if="scope.row.reportType===1" type="success">{{scope.row.reportTypeName}}</el-tag>
          <el-tag v-else type="warning">{{scope.row.reportTypeName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="targetId" label="目标ID" width="">
      </el-table-column>
      <el-table-column prop="reportDes" label="描述" width="450px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            confirmButtonText="是的"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="#409eff"
            title="已经处理完了吗？"
            @onConfirm="finishReport(scope.row)"
          >
            <el-button
              size="small"
              type="danger"
              slot="reference"
              :disabled="scope.row.reportState"
              >结束工单</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        reportList: [],
        pageNumber: 1,
        allPageNumber: null,
        type: 2,
        options: [
          {value: 0, label: '未处理'},
          {value: 1, label: '已处理'},
          {value: 2, label: '全部'}
        ]
      }
    },
    methods: {
      getReport() {
        this.$http.get(`/report/queryreport?pageNumber=${this.pageNumber}&pageSize=10&type=${this.type}`).then(
          res => {
            if(res) {
              // console.log(res);
              this.reportList = res.data.obj.content
              this.allPageNumber = res.data.obj.totalPages
            }
          }
        )
      },
      finishReport(row) {
        this.$http.get(`/report/solvereport?reportId=${row.reportId}`).then(
          res => {
            if(res) {
              this.getReport()
              this.$socket.emit('solve_report', row.userId)
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
        this.getReport()
      },
      type() {
        this.getReport()
      }
    },
    created () {
      this.getReport()
    },
  }
</script>

<style lang="less" scoped>

</style>