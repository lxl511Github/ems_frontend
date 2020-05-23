<template>
  <section class="chart-container">
    <el-row>
      <el-col :span="12"><div id="chartColumn" style="width:100%; height:400px;" /></el-col>
      <el-col :span="12"><div id="charPie" style="width:100%; height:400px;" /></el-col>
    </el-row>
  </section>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      chartColumn: null,
      chartPie: null
    }
  },
  mounted: function() {
    this.drawCharts()
  },
  updated: function() {
    this.drawCharts()
  },
  methods: {
    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({
        title: { text: '绩效总览' },
        tooltip: {},
        legend: {
          data: [{
            name: '绩效表',
            textStyle: {
              color: 'blue'
            }
          }]
        },
        xAxis: {
          data: ['熊二', '张三', '李四', '王五', '马六', '赵七', '老杨']
        },
        yAxis: {},
        series: [{
          name: '绩效表',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 99],
          textStyle: {
            color: 'blue'
          }
        }]
      })
    },
    drawCharts() {
      this.drawColumnChart()
    }

  }
}
</script>
<style scoped>
  .chart-container {
    width: 100%;
    float: left;
  }
  .el-col {
    padding: 30px 20px;
  }
</style>
