<!--
 * @Date: 2020-10-22 17:15:14
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-24 20:52:00
 * @FilePath: \book-admin\src\views\user\UserList.vue
-->
<template>
  <div class="user-list">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="userId" label="ID" width="80px"> </el-table-column>
      <el-table-column prop="userPhone" label="手机号" width="">
      </el-table-column>
      <el-table-column prop="userName" label="昵称" width=""> </el-table-column>
      <el-table-column prop="userCoin" label="源币数量" width="">
      </el-table-column>
      <el-table-column label="状态" width="">
        <template slot-scope="scope">
          {{ scope.row.bannedPojo === null ? "正常" : "禁言" }}
        </template>
      </el-table-column>
      <el-table-column label="身份" width="">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 1 ? 'danger' : 'success'">{{
            scope.row.role === 1 ? "管理员" : "用户"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            size="small"
            type="danger"
            :disabled="
              scope.row.over !== '' ? scope.row.over >= new Date().getTime() : false ||
              scope.row.role === 1
            "
            style="margin-right: 10px"
            >禁言</el-button
          >
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
              :disabled="
                scope.row.over === '' ? true : scope.row.over <= new Date().getTime()
              "
              slot="reference"
              >解禁</el-button
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
    >
    </el-pagination>

    <el-dialog
      title="封禁用户"
      :visible.sync="freezeFormVisible"
      width="500px"
      style="text-align: left"
    >
      <el-form :model="freezeUserInfo" label-width="100px">
        <el-form-item label="用户昵称">
          <el-input
            v-model="freezeUserInfo.userName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="freezeUserInfo.userPhone"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="封禁原因">
          <el-input v-model="des" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封禁时长">
          <el-select
            v-model="freezeUserInfo.duration"
            placeholder="请选择时长"
            @change="selectDisposeCode"
            :disabled="freezeUserInfo.custom"
          >
            <el-option label="1天" :value="1"></el-option>
            <el-option label="7天" :value="2"></el-option>
            <el-option label="15天" :value="3"></el-option>
            <el-option label="30天" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义">
          <el-switch
            v-model="freezeUserInfo.custom"
            @change="selectDisposeCode"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="时间（天）">
          <el-input
            v-model="time"
            autocomplete="off"
            :disabled="!freezeUserInfo.custom"
            @change="selectDisposeCode"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="freezeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="freeze">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      allPageNum: 1,
      pageNum: 1,
      tableData: [],
      freezeUserInfo: {},
      freezeFormVisible: false,
      des: null,
      time: null,
    };
  },
  methods: {
    handleClick(row) {
      this.freezeUserInfo = row;
      this.freezeUserInfo.custom = false;
      this.freezeUserInfo.duration = null;
      this.freezeFormVisible = true;
    },
    currentPageChange(val) {
      this.pageNum = val;
      this.getUserLIst();
    },
    getUserLIst() {
      this.$http
        .get(`/admin/queryalluser?pageNumber=${this.pageNum}&pageSize=10`)
        .then((res) => {
          if (res) {
            this.tableData = res.data.obj.content;
            this.tableData.forEach(item => {
              item.over = item.bannedPojo ? item.bannedPojo.removeDate : ''
            })
            this.allPageNum = res.data.obj.totalPages;
          }
        });
    },
    // 强制渲染解决select无法选中
    selectDisposeCode() {
      this.$forceUpdate();
    },
    freeze() {
      const freezeObj = {
        userId: this.freezeUserInfo.userId,
        custom: this.freezeUserInfo.custom,
        bannedDes: this.des,
        bannedType: this.freezeUserInfo.duration,
        time: this.time ? this.time * 24 * 60 * 60 * 1000 : null,
      };
      if (freezeObj.bannedType === null && freezeObj.time === null) {
        this.$message.error("请至少选择一种封禁方式");
      } else {
        this.$http.post("/admin/banned/banneduser", freezeObj).then((res) => {
          if (res) {
            // console.log(res);
            this.freezeFormVisible = false;
            this.reload();
          }
        });
      }
    },
    unFreeze(row) {
      this.$http
        .get(`/admin/banned/removebanned?bannedId=${row.bannedPojo.bannedId}`)
        .then((res) => {
          if (res) {
            this.reload()
          }
        });
    },
  },
  created() {
    this.getUserLIst();
  },
};
</script>

<style lang="scss" scoped>
</style>