<template>
  <section class="chart-container">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <span style="font-size: 16px">设备类型：</span>
            <el-select v-model="filters.category" filterable placeholder="请选择设备类型" style="width: 150px;height: 10px;" clearable>
              <el-option v-for="item in equCategory" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-col :span="12"><div id="chartColumn" style="width:100%; height:400px;" /></el-col>
        <el-col :span="12"><div id="chartPie" style="width:100%; height:400px;" /></el-col>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import echarts from 'echarts'
const equCategory = [
  { key: '1', display_name: '传感器' },
  { key: '2', display_name: '电气类' },
  { key: '5', display_name: '其他类' }
]
export default {
  data() {
    return {
      chartColumn: null,
      chartPie: null,
      filters: {
        category: '1'
      },
      showData: [],
      equCategory,
      x_data: [],
      no_use_data: [],
      in_use_data: [],
      damage_data: []
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
      this.$axios.get('api/equ/eChart/', { params: { category: this.filters.category }}).then((response) => {
        var res = response.data
        if (res.code === 200) {
          var x_data = res['x_data_list']
          var no_use_data = res['no_use_list']
          var in_use_data = res['in_use_list']
          var damage_data = res['damage_list']
        }
        // var x_data = this.x_data
        // var data1 = [12, 13, 10, 13, 19, 32, 24, 25, 12, 43]	 // 损坏
        // var data2 = this.y_data1	// 使用中
        // var data3 = [22, 18, 19, 23, 29, 31, 22, 23, 12, 21]	 // 可使用
        // 总计
        var sum_data = function() {
          var datas = []
          for (var i = 0; i < x_data.length; i++) {
            datas.push(in_use_data[i] + no_use_data[i] + damage_data[i])
          }
          return datas
        }
        this.chartColumn.setOption({
          color: ['#fc648a', '#fcac62', '#eefe62'],
          title: {
            text: '设备使用频次top10',
            left: '1px',
            textStyle: {
              color: '#4366aa',
              fontsize: 5
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            selectedMode: true, // 取消图例上的点击事件
            itemWidth: 22,
            itemHeight: 15,
            data: ['可用', '使用中', '损坏'],
            top: 10
          },
          xAxis: {
            type: 'category',
            data: x_data,
            axisLabel: {
              rotate: 45,
              textStyle: {
                fontSize: '16',
                color: '#111111'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#789C9E'
              }
            },
            splitLine: {
              show: false
            }
          },
          yAxis: [{
            type: 'value',
            minInterval: 0, // 设置左侧Y轴最小刻度
            splitLine: {
              lineStyle: {
                color: '#CDDDE0'
              }
            },
            // 设置横线样式
            axisLabel: {
              textStyle: {
                fontSize: '12',
                color: '#CDDDE0'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#789CCC'
              }
            }
          }],
          series: [{
            name: '损坏',
            type: 'bar',
            stack: '使用情况',
            data: damage_data,
            barWidth: 25,
            itemStyle: {
              normal: {
                color: '#FF0000'
              }
            }
          },
          {
            name: '使用中',
            type: 'bar',
            stack: '使用情况',
            data: in_use_data,
            barWidth: 25,
            itemStyle: {
              normal: {
                color: '#FF8849'
              }
            }
          },
          {
            name: '可用',
            type: 'bar',
            stack: '使用情况',
            data: no_use_data,
            barWidth: 25,
            itemStyle: {
              normal: {
                color: '#2FDB49',
                barBorderRadius: [10, 10, 0, 0]
              }
            }
          },
          {
            name: '总计',
            type: 'bar',
            stack: '使用情况',
            data: sum_data(),
            label: {
              normal: {
                offset: ['50', '80'],
                show: true,
                position: 'insideBottom',
                formatter: '{c}', // 显示的总数
                textStyle: { color: '#02FCFA' }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(128,128,128,0)'
              }
            }
          }
          ]
        })
      })
    },
    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById('chartPie'))
      this.chartPie.setOption({
        title: {
          text: '频次占比',
          // subtext: '使用占比',
          x: 'center'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['传感器0', '传感器1', '传感器2', '传感器3', '传感器4']
        },
        series: [{
          name: '来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 235, name: '传感器0' },
            { value: 235, name: '传感器1' },
            { value: 235, name: '传感器2' },
            { value: 235, name: '传感器3' },
            { value: 235, name: '传感器4' },
            { value: 235, name: '传感器5' }
          ]
        }]
      })
    },
    drawCharts() {
      this.drawColumnChart()
      this.drawPieChart()
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
