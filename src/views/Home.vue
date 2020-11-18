<!--
 * @Date: 2020-10-22 15:44:18
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-18 21:26:46
 * @FilePath: \book-admin\src\views\Home.vue
-->
<template>
  <div class="home">
    <my-header :discussionCount="discussion" :bookCount="bookCount"/>
    <div class="chart">
      <my-favorite class="fav"/>
      <my-type class="type" :bookInfo="cValue"/>
    </div>
  </div>
</template>

<script>
import MyFavorite from '../components/chart/MyFavorite.vue'
import MyHeader from '../components/chart/MyHeader.vue'
import MyType from '../components/chart/MyType.vue'
export default {
  name: 'Home',
  components: {
    MyFavorite,
    MyHeader,
    MyType,
  },
  data() {
    return {
      discussion: undefined,
      books: [],
      bookCount: 0,
      type: [],
      cValue:[]
    }
  },
  methods: {
    getDiscussion() {
      this.$http.get('/data/admin/discussion').then(
        res => {
          if(res) {
            this.discussion = res.data.obj
          }
        }
      )
    },
    getBookTypeInfo() {
      return this.$http.get('/data/admin/typedata').then(
        res => {
          if(res) {
            this.books = res.data.obj
            this.bookCount = res.data.obj.reduce((a, b) => {
              return a + b
            })
          }
        }
      )
    },
    getType() {
      this.$http.get('/booktype/querytype').then(
        res => {
          if(res) {
            this.type = res.data.obj
          }
        }
      ).then(() => {
        this.cValue = this.type.map((item, index) => {
          return {value: this.books[index], name: item.typeName}
        })
      })
    }
  },
  async created () {
    this.getDiscussion()
    await this.getBookTypeInfo()
    this.getType()
  },
}
</script>

<style lang="less" scoped>
.home {
  margin: 0;
  background-color: #fff;
  .fav {
    margin-left: 80px;
    margin-top: 20px;
  }
  .chart {
    display: flex;
  }
  .type {
    margin-left: 40px;
    margin-top: 20px;
  }
}  
</style>
