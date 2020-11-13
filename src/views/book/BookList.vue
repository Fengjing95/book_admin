<!--
 * @Date: 2020-11-11 17:01:19
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-13 17:22:47
 * @FilePath: \book-admin\src\views\book\BookList.vue
-->
<template>
  <div>
    <div style="display: flex;">
      <el-switch
        style="margin-top: 5px"
        v-model="remainOn"
        active-text="未上架"
        inactive-text="已上架">
      </el-switch>
      <div v-if="!remainOn" style="display: flex;">
        <el-select v-model="type" placeholder="请选择分类" size="small" clearable style="width: 150px;margin: 0 20px">
          <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.typeName" :value="item.typeId">
          </el-option>
        </el-select>
        <el-input v-model="search" size="small" placeholder="输入关键字或ID查询，回车确认" @keyup.enter.native="getBookList"/>
      </div>
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
    <el-table :data="bookList">
      <el-table-column prop="bookId" label="ID" width="80px"> </el-table-column>
      <el-table-column prop="bookName" label="书名" width=""> </el-table-column>
      <el-table-column label="分类" width="">
        <template slot-scope="scope">
          {{chooseType(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width=""> </el-table-column>
      <el-table-column prop="publisher" label="出版社" width=""> </el-table-column>
      <el-table-column label="上传人" width="">
        <template slot-scope="scope">
          {{scope.row.user.userName}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :type="scope.row.bookState ? 'danger' : 'success'" size="small" @click="shelves(scope.row)"
            >{{scope.row.bookState ? '下架' : '上架'}}</el-button
          >
          <el-button type="default" size="small" @click="checkDetail(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详细信息" :visible.sync="detailVisiable" width="600px">
      <div style="display: flex;">
        <el-image style="width: 156px;height: 208px; margin-top: 40px" :src="$photoHeader+bookForm.image"></el-image>
        <el-form style="flex: 1;" ref="bookFormRef" :model="bookForm" :rules="rules" size="medium" label-width="100px">
          <el-form-item label="书名" prop="bookName">
            <el-input v-model="bookForm.bookName" placeholder="请输入书名" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="bookForm.author" placeholder="请输入作者" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="出版社" prop="publisher">
            <el-input v-model="bookForm.publisher" placeholder="请输入出版社" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
          <el-form-item label="标识码" prop="identity">
            <el-input v-model="bookForm.identity" placeholder="请输入标识码" readonly :disabled='true' clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="出版日期" prop="publishDate">
            <el-date-picker v-model="bookForm.publishDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择出版日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="分类" prop="type">
            <el-select v-model="bookForm.type" placeholder="请选择分类" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.typeName" :value="item.typeId"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="detailVisiable=false">取消</el-button>
        <el-button type="primary" @click="updataBook">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bookList: [],
        search: '',
        type: 0,
        pageNumber: 1,
        allPageNumber: undefined,
        detailVisiable: false,
        remainOn: false,
        bookForm: {
          bookName: undefined,
          author: undefined,
          publisher: undefined,
          identity: undefined,
          publishDate: null,
          type: undefined,
        },
        rules: {
          bookName: [{
            required: true,
            message: '请输入书名',
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: '请输入作者',
            trigger: 'blur'
          }],
          publisher: [{
            required: true,
            message: '请输入出版社',
            trigger: 'blur'
          }],
          identity: [],
          publishDate: [{
            required: true,
            message: '请选择出版日期',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '请选择分类',
            trigger: 'change'
          }],
        },
        typeOptions: [{
          typeId: 0,
          typeName: "全部",
        }],
      }
    },
    watch: {
      remainOn() {
        this.getBookList()
      },
      type() {
        this.getBookList()
      }
    },
    methods: {
      currentPageChange(val) {
        this.pageNumber = val;
        this.getBookList();
      },
      getBookList() {
        if(this.remainOn) {
          this.getBadBook()
        } else {
          this.getNomalBook()
        }
      },
      getNomalBook() {
        this.$http.get(`/book/fuzzy?key=${this.search}&type=${this.type}&pageNumber=${this.pageNumber}&pageSize=10`).then(
          res => {
            if(res) {
              // console.log(res)
              this.bookList = res.data.obj.content
              this.allPageNumber = res.data.obj.totalPages
            }
          }
        )
      },
      getBadBook() {
        this.$http.get(`/book/unbook?pageNumber=${this.pageNumber}&pageSize=10`).then(
          res => {
            if(res) {
              // console.log(res)
              this.bookList = res.data.obj.content
              this.allPageNumber = res.data.obj.totalPages
            }
          }
        )
      },
      getTypeList() {
        this.$http.get('/booktype/querytype').then(
          res => {
            if(res) {
              this.typeOptions.push(...res.data.obj)
            }
          }
        )
      },
      checkDetail(row) {
        this.bookForm = {
          bookId: row.bookId,
          bookName: row.bookName,
          author: row.author,
          publisher: row.publisher,
          publishDate: new Date(row.publishDate),
          type: row.type,
          identity: row.identity,
          image: row.image,
        }
        this.detailVisiable = true
      },
      chooseType(typeId) {
        const target = this.typeOptions.find(item => item.typeId === typeId)
        return target.typeName
      },
      shelves(row) {
        const text = row.bookState ? '下架书籍' : '上架书籍'
        this.$confirm(`此操作将${text}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          if(row.bookState) {
            this.sum(row.bookId)
          } else {
            this.add(row.bookId)
          }
        }).catch(() => {})
      },
      add(bookId) {
        this.$http.get(`/adminbook/true?bookId=${bookId}`).then(
          res => {
            if(res) {
              this.$message.success('已上架')
              this.getBookList()
            }
          }
        )
      },
      sum(bookId) {
        this.$http.get(`/adminbook/false?bookId=${bookId}`).then(
          res => {
            if(res) {
              this.$message.success('已下架')
              this.getBookList()
            }
          }
        )
      },
      updataBook() {
        const updateBook = {...this.bookForm}
        updateBook.publishDate = new Date(updateBook.publishDate).getTime()
        this.$http.put('/adminbook/update', updateBook).then(
          res => {
            if(res) {
              this.$message.success('修改成功')
              this.detailVisiable = false
              this.getBookList()
            }
          }
        )
      }
    },
    created () {
      this.getTypeList()
      this.getBookList()
    },
  }
</script>

<style lang="less" scoped>

</style>