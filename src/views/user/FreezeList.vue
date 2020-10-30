<!--
 * @Date: 2020-10-22 17:15:14
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-30 15:37:47
 * @FilePath: \book-admin\src\views\user\FreezeList.vue
-->
<template>
  <div class="user-list">
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
        :page-count="allPageNum"
        :reviewPageNum="pageNum"
        @current-change="currentPageChange"
        style="flex: 1;"
      >
      </el-pagination>
    </div>

    <el-table :data="freezeList" style="width: 100%">
      <el-table-column prop="userId" label="用户ID" width="100px">
      </el-table-column>
      <el-table-column label="昵称" width="150px">
        <template slot-scope="scope">
          {{ scope.row.userPojo.userName }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="200px">
        <template slot-scope="scope">
          {{ scope.row.bannedDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200px">
        <template slot-scope="scope">
          {{ scope.row.removeDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="当前状态" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.removeDate >= new Date().getTime() ? 'danger' : 'success'">
            {{ scope.row.removeDate >= new Date().getTime() ? '禁言中' : '已过期' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bannedDes" label="封禁原因" width="">
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-popconfirm
            confirmButtonText="继续"
            cancelButtonText="不用了"
            icon="el-icon-info"
            iconColor="red"
            title="确定要为用户提前解禁吗？"
            @onConfirm="unFreeze(scope.row)"
          >
            <el-button
              size="small"
              type="success"
              :disabled="scope.row.removeDate <= new Date().getTime()"
              slot="reference"
              >解禁</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      freezeList: [],
      pageNum: 1,
      allPageNum: null,
      type: 2,
      options: [
        {value: 0, label: '禁言中'},
        {value: 1, label: '已解除'},
        {value: 2, label: '全部'}
      ]
    };
  },
  methods: {
    getFreezeList() {
      this.$http
        .get(`/admin/banned/querybanned?pageNumber=${this.pageNum}&pageSize=10&type=${this.type}`)
        .then((res) => {
          if (res) {
            this.freezeList = res.data.obj.content;
            this.allPageNum = res.data.obj.totalPages;
          }
        });
    },
    unFreeze(row) {
      this.$http
        .get(`/admin/banned/removebanned?bannedId=${row.bannedId}`)
        .then((res) => {
          if (res) {
            this.reload()
          }
        });
    },
    currentPageChange(val) {
      this.pageNum = val
      this.getFreezeList()
    },
  },
  watch: {
    type() {
      this.getFreezeList()
    }
  },
  created() {
    this.getFreezeList();
  },
};
</script>

<style lang="less" scoped>
</style>