<!--
 * @Date: 2020-11-11 18:47:25
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-18 09:54:08
 * @FilePath: \book-admin\src\views\Carousel.vue
-->
<template>
  <div class="carousel">
    <div style="display: flex">
      <el-button type="primary" @click="addShowVisiable = true" size="small"
        >添加轮播图</el-button
      >
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="allPageNumber"
        :reviewPageNum="pageNumber"
        @current-change="currentPageChange"
        style="flex: 1"
      >
      </el-pagination>
    </div>

    <el-table :data="showList" style="width: 100%">
      <el-table-column prop="showId" label="ID" width="80px"> </el-table-column>
      <el-table-column
        prop="showRequest"
        label="跳转地址"
        width=""
      ></el-table-column>
      <el-table-column label="展示图片" width="">
        <template slot-scope="scope">
          <el-image
            style="width: 120px; height: 50px"
            :src="$photoHeader + scope.row.showImage"
            :preview-src-list="[$photoHeader + scope.row.showImage]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteShow(scope.row)"
            >删除</el-button
          >
          <el-button :type="scope.row.showState ? 'primary' : 'default'" size="small" @click="changeState(scope.row)">{{
            scope.row.showState ? "取消展示" : "展示"
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加轮播图"
      :visible.sync="addShowVisiable"
      width="500px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :show-close="true"
    >
      <el-form
        ref="addShowFormRef"
        :model="addShowForm"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-form-item label="上传轮播图" prop="showImage" required>
          <el-upload
            ref="image"
            :file-list="imagefileList"
            action=""
            :before-upload="imageBeforeUpload"
            accept="image/*"
            :limit="1"
            :http-request="uploadImage"
            list-type="picture"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转地址" prop="showRequest">
          <el-input
            v-model="addShowForm.showRequest"
            placeholder="请输入跳转地址"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addShowVisiable = false">取消</el-button>
        <el-button type="primary" @click="addShow">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showList: [],
      addShowForm: {
        showImage: "",
        showRequest: "",
      },
      pageNumber: 1,
      allPageNumber: undefined,
      addShowVisiable: false,
      rules: {
        showRequest: [
          {
            required: true,
            message: "请输入跳转地址",
            trigger: "blur",
          },
        ],
      },
      imagefileList: [],
    };
  },
  methods: {
    changeState(row) {
      if(row.showState) {
        this.offShow(row.showId)
      } else {
        this.onShow(row.showId)
      }
    },
    offShow(showId) {
      this.$http.get(`/show/false?showId=${showId}`).then(
        res => {
          if(res) {
            // console.log(res);
            this.$message.success('修改成功')
            this.getShowList();
          }
        }
      )
    },
    onShow(showId) {
      this.$http.get(`/show/true?showId=${showId}`).then(
        res => {
          if(res) {
            // console.log(res);
            this.$message.success('修改成功')
            this.getShowList();
          }
        }
      )
    },
    currentPageChange(val) {
      this.pageNumber = val;
      this.getShowList();
    },
    getShowList() {
      this.$http
        .get(`/show/allshow?pageNumber=${this.pageNumber}&pageSize=6`)
        .then((res) => {
          if (res) {
            // console.log(res);
            this.showList = res.data.obj.content;
            this.allPageNumber = res.data.obj.totalPages;
          }
        });
    },
    addShow() {
      this.$refs["addShowFormRef"].validate((valid) => {
        if (!valid) return;
        this.$http.post("/show/addshow", this.addShowForm).then((res) => {
          if (res) {
            console.log(res);
            this.addShowVisiable = false;
            this.$message.success("添加成功");
            this.$refs["addShowFormRef"].resetFields();
            this.getShowList();
          }
        });
      });
    },
    deleteShow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.get(`/show/delete?showId=${row.showId}`).then((res) => {
            if (res) {
              this.$message.success("删除成功");
              this.getShowList();
            }
          });
        })
        .catch(() => {});
    },
    imageBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      let isAccept = new RegExp("image/*").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择image/*类型的文件");
      }
      return isRightSize && isAccept;
    },
    uploadImage(content) {
      // 自定义上传封面
      const imgForm = new FormData();
      imgForm.append("image", content.file);
      this.$http.post("/upload/uploadimage/", imgForm).then((res) => {
        this.addShowForm.showImage = res.data.obj;
      });
    },
  },
  created() {
    this.getShowList();
  },
};
</script>

<style lang="less" scoped>
.carousel {
  text-align: left;
}
</style>