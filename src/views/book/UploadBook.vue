<!--
 * @Date: 2020-11-11 17:01:49
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-11 17:23:08
 * @FilePath: \book-admin\src\views\book\UploadBook.vue
-->
<template>
<div class="upload">
  <div class="bg">
    <el-form ref="uploadForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-row :gutter="15">
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="formData.bookName" placeholder="请输入书名" clearable="" :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="formData.author" placeholder="请输入作者" clearable="" :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input v-model="formData.publisher" placeholder="请输入出版社" clearable="" :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-form-item label="出版日期" prop="publishDate">
              <el-date-picker v-model="formData.publishDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{ width: '100%' }" placeholder="请选择出版日期" clearable=""></el-date-picker>
            </el-form-item>
            <el-form-item label="分类" prop="type">
              <el-select v-model="formData.type" placeholder="请选择分类" clearable="" :style="{ width: '100%' }">
                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.typeName" :value="item.typeId" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <div class="btn">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
          </el-row>
        </el-col>
        <el-col :span="11">
          <el-row :gutter="15">
            <el-form-item label="PDF" prop="resource" required="">
              <el-upload ref="resource" drag="drag" :file-list="resourcefileList" :before-upload="resourceBeforeUpload" accept=".pdf" :limit="1" action="" :http-request="customUpload" :on-remove="removeList"><i class="el-icon-upload">
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </i></el-upload>
            </el-form-item>
            <el-form-item label="封面" prop="image" required="">
              <el-upload ref="image" :file-list="imagefileList" action="" :before-upload="imageBeforeUpload" accept="image/*" :limit="1" :http-request="uploadImage" list-type="picture">
                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-dialog :visible.sync="progressVisable" custom-class="el-dialog-custom" top="30vh">
    <el-progress v-if="!uploadOver" type="dashboard" :percentage="progress" :color="colors"></el-progress>
    <div class="complete" v-else>
      <p>{{overContent}}</p>
      <el-button type="primary" @click="progressVisable=false" size="small">继续</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import SparkMD5 from 'spark-md5'
export default {
  inject: ['reload'],
  data() {
    return {
      token: localStorage.getItem("token"),
      formData: {
        bookName: null,
        author: null,
        publisher: null,
        publishDate: null,
        type: null,
        resource: null,
        image: null,
        identity: null
      },
      rules: {
        bookName: [
          {
            required: true,
            message: "请输入书名",
            trigger: "blur",
          },
        ],
        author: [
          {
            required: true,
            message: "请输入作者",
            trigger: "blur",
          },
        ],
        publisher: [
          {
            required: true,
            message: "请输入出版社",
            trigger: "blur",
          },
        ],
        publishDate: [
          {
            required: true,
            message: "请选择出版日期",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择分类",
            trigger: "change",
          },
        ],
      },
      resourcefileList: [],
      imagefileList: [],
      typeOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
      progressVisable: false,
      percentage: [0,0,0,0,0,0,0,0,0,0],
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#1989fa', percentage: 60},
        {color: '#6f7ad3', percentage: 80},
        {color: '#5cb87a', percentage: 100}
      ],
      uploadOver: false,
      overContent: null,
      isLegal: null
    };
  },
  created() {
    this.getTypeList()
  },
  computed: {
    progress() {
      return this.percentage.reduce((a, b) => a + b)
    }
  },
  methods: {
    uploadImage(content) {
      // 自定义上传封面
      const imgForm = new FormData()
      imgForm.append('image', content.file)
      this.$http.post('/upload/uploadimage/', imgForm
      ).then((res) => {
        this.formData.image = res.data.obj
      })
    },
    getTypeList() {
      // 获取分类列表
      this.$http.get('/booktype/querytype').then(
        res => {
          if(res) {
            this.typeOptions = res.data.obj
          }
        }
      )
    },
    submitForm() {
      this.$refs["uploadForm"].validate((valid) => {
        if (!valid) return;
        // 提交表单
        const form = {...this.formData}
        form.publishDate = new Date(form.publishDate).getTime()
        this.$http.post('/book/uploadbook', form).then(
          res => {
            if(res) {
              this.$message.success('上传成功')
              this.$refs["uploadForm"].resetFields();
              this.reload()
              // console.log(res);
            }
          }
        )
      });
    },
    resetForm() {
      this.$refs["uploadForm"].resetFields();
    },
    async resourceBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 100;
      if (!isRightSize) {
        this.$message.error("文件大小超过 100MB");
      }
      let isAccept = new RegExp(".pdf").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择.pdf类型的文件");
      }
      let exist = await this.checkFile(file)
      this.isLegal = isRightSize && isAccept && exist
      return isRightSize && isAccept && exist;
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
    computeMd5(file) {
      // 计算文件MD5
      const fread = new FileReader()
      const spark = new SparkMD5.ArrayBuffer()
      return new Promise((resolve, reject) => {
        if(!file) {
          reject('no file')
        }
        fread.readAsArrayBuffer(file)
        fread.onload = (e) => {
          spark.append(e.target.result)
          const md5 = spark.end()
          resolve(md5)
        }
      })
    },
    async checkFile(file) {
      // 检验文件是否存在
      let md5 = await this.computeMd5(file)
      return await this.$http.get(`/book/isexist?identity=${md5}`).then(
        res => {
          if(res.data.obj) {
            this.$message.error('书籍已存在')
            this.resourcefileList = []
            return false
          } else {
            this.formData.identity = md5
            return true
          }
        }
      )
    },
    customUpload(content) {
      // 覆盖默认上传事件
      let file = content.file
      if (!file || !this.isLegal) return
      // 将切片固定成10分，也可以固定大小上传
      let axiosArray = []
      let chunkList = []
      let chunkSize = file.size / 10
      let current = 0
      let fileName = this.formData.identity + '.pdf'
      while (current < 10) {
        chunkList.push({
          chunk: file.slice(current * chunkSize, (current + 1) * chunkSize),
          fileName: current + "-" + fileName
        })
        current++
      }
      // 初始化数据
      this.percentage = [0,0,0,0,0,0,0,0,0,0]
      this.uploadOver = false
      this.progressVisable = true
      // 切片并发传给后端，要注意切片上传时请求头是 multipart/form-data 合并切片时请求头是x-www-form-urlencoded，只能上传键值对
      chunkList.map((item) => {
        const index = parseInt(item.fileName.split('-')[0])
        let form = new FormData()
        form.append("file", item.chunk, item.fileName)
        form.append("fileName", this.formData.identity)
        axiosArray.push(
          this.$http.post("/upload/part", form, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
              this.$set(this.percentage, index , e.loaded / e.total * 10 | 0)
            }
          })
        )
      })
      // 所有切片上传成功后合并
      Promise.all(axiosArray).then(res => {
        res
        this.$http.get(`/upload/merge?fileName=${this.formData.identity}`).then(res => {
          if(res) {
            // console.log(res);
            // this.progressVisable = false
            this.formData.resource = res.data.obj
            this.formData.bookName = file.name.replace('.pdf', '')
            this.uploadOver = true
            this.overContent = '上传成功，请完善信息后提交'
          }
        }).catch(err => {
          err
          this.uploadOver = true
          this.resourcefileList = []
          this.overContent = '传输失败，请重试'
        })
      })
    },
    removeList() {
      // 移除文件
      this.formData.resource = ''
    }
  },
};
</script>


<style lang="less">
  .el-dialog-custom {
    border-radius: 20px;
    width: 300px;
  }
</style>

<style lang="less" scoped>
.el-upload__tip {
  line-height: 1.2;
}
.upload {
  width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  padding: 50px 20px 20px 20px;
  box-sizing: border-box;
  .bg {
    width: auto;
    padding-bottom: 100px;
    position: relative;
    .btn {
      margin-top: 40px;
    }
    .tips {
      position: absolute;
      bottom: 0;
      left: 20px;
      font-size: 12px;
    }
  }
}
</style>