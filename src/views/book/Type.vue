<!--
 * @Date: 2020-11-11 18:43:56
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-12 14:52:08
 * @FilePath: \book-admin\src\views\book\Type.vue
-->
<template>
    <div class="type">
      <div class="table">
        <el-table :data="typeList">
          <el-table-column prop="typeId" label="ID" width="80px"> </el-table-column>
          <el-table-column prop="typeName" label="分类名" width="">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="success" size="small" @click="updateType(scope.row)"
                >修改</el-button
              >
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
      </div>

      <div class="form">
        <h4 style="text-align: left;margin-left: 40px;margin-bottom: 30px;">添加分类</h4>
        <el-form ref="addTypeFormRef" :model="addTypeForm" :rules="rules" size="medium" label-width="100px">
          <el-form-item label="分类名" prop="typeName">
            <el-input v-model="addTypeForm.typeName" placeholder="请输入分类名" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      addTypeForm: {
        typeName: undefined,
      },
      rules: {
        typeName: [{
          required: true,
          message: '请输入分类名',
          trigger: 'blur'
        }],
      },
      typeList: [],
      allPageNumber: undefined,
      pageNumber: 1,
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    updateType(row) {
      this.$prompt('请输入新的分类名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\s\S]{1,7}/,
        inputErrorMessage: '长度限制1-7'
      }).then(({ value }) => {
        const updateForm = {
          typeId: row.typeId,
          typeName: value
        }
        this.$http.put('/booktype/update', updateForm).then(
          res => {
            if(res) {
              this.$message.success('修改成功')
              this.getTypeList()
            }
          }
        )
      }).catch(() => {})
    },
    currentPageChange(val) {
      this.pageNumber = val
      this.getTypeList()
    },
    submitForm() {
      this.$refs['addTypeFormRef'].validate(valid => {
        if (!valid) return
        this.$http.post('/booktype/add', this.addTypeForm).then(
          res => {
            if(res) {
              this.$refs['addTypeFormRef'].resetFields()
              this.getTypeList()
              this.$message.success('添加成功')
            }
          }
        )
        
      })
    },
    resetForm() {
      this.$refs['addTypeFormRef'].resetFields()
    },
    getTypeList() {
      this.$http.get(`/booktype/all?pageNumber=${this.pageNumber}&pageSize=10`).then(
        res => {
          if(res) {
            this.typeList = res.data.obj.content
            this.allPageNumber = res.data.obj.totalPages
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.type {
  display: flex;
  .table {
    flex: 1;
    border-right: solid 1px #f0f0f0;
  }
  .form {
    flex: 1;
    // position: relative;
    // top: 200px;
  }
}
</style>