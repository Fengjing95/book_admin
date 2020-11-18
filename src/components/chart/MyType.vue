<!--
 * @Date: 2020-11-18 17:10:59
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-18 21:27:57
 * @FilePath: \book-admin\src\components\chart\MyType.vue
-->
<template>
  <div class="type" ref="typeRef">
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
export default {
  props: {
    bookInfo: Array,
  },
  watch: {
    bookInfo() {
      this.draw()
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      let chart = echarts.init(this.$refs.typeRef);
      chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: this.bookInfo.map((item) => {
            return item.name
          }),
        },
        series: [
          {
            center: ['65%', '50%'],
            name: "分类统计",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.bookInfo,
          },
        ],
      });
    }
  },
};
</script>

<style lang="less" scoped>
.type {
  width: 600px;
  height: 400px;
  border: solid 1px #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  background-color: #f5f5f5;
}
</style>