<template>
  <div>
    <section>
      <el-col :span="24" class="toolbar" style="padding: 10px 10px 0px">
        <el-form :inline="true">
          <!-- <el-form-item><el-input v-model="keywords" placeholder="模糊查询" /></el-form-item> -->
          <el-date-picker v-model="filters.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择日期时间" clearable />
          <el-form-item>
            <el-input v-model="filters.name" placeholder="请输入借出人姓名" clearable />
            <!-- <el-select v-model="filters.name" placeholder="请选择设备名称" clearable>
              <el-option v-for="item in EquNameOption" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select> -->
          </el-form-item>
          <el-form-item><el-button type="primary" @click="searchHandle(filters)">搜索</el-button></el-form-item>
        </el-form>
      </el-col>
      <el-table :data="LoanMsgList" style="width: 100%">
        <el-table-column prop="serialNum" label="编号" sortable><template slot-scope="scope">{{ scope.row.serialNum }}</template></el-table-column>
        <el-table-column prop="name" label="名称" sortable />
        <el-table-column prop="equ_type" label="型号" sortable />
        <el-table-column prop="loanName" label="借出人" sortable />
        <el-table-column prop="jobNum" label="工号" sortable />
        <el-table-column prop="department" label="部门" sortable />
        <el-table-column prop="date" label="借出时间" sortable />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="repay(scope.row)">归还</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 归还登记 -->
      <repayMsg v-if="dialogRepay" ref="repayMsg" />
    </section>
    <div>
      <loanEchart ref="loanEchart" />
    </div>
  </div>
</template>

<script>
// import { parseTime } from '../../../utils/index'
import repayMsg from './repay_msg.vue'
import { getLoan } from '../../../api/table'
import loanEchart from './Echart/loanEchart.vue'
export default {
  components: { repayMsg, loanEchart },
  data() {
    return {
      filters: {
        date: '',
        name: ''
      },
      LoanMsgList: [],
      keywords: '',
      dialogRepay: false
    }
  },
  mounted: function() {
    this.GetLoanList()
  },
  methods: {
    formatter(thistime, fmt) {
      const $this = new Date(thistime)
      const o = {
        'M+': $this.getMonth() + 1,
        'd+': $this.getDate(),
        'h+': $this.getHours(),
        'm+': $this.getMinutes(),
        's+': $this.getSeconds(),
        'q+': Math.floor(($this.getMonth() + 3) / 3),
        'S': $this.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    GetLoanList() {
      // this.$axios.get('api/equ/LoanMsg/')
      getLoan().then((res) => {
        var response = res.data
        if (response.error_num === 0) {
          var LoanList = response['list']
          this.LoanMsgList = LoanList
        }
      })
    },
    // 条件查询
    searchHandle: function(params) {
      console.log(params)
      if (params.date) {
        var time = params.date.toString().split(',')
        var stime = this.formatter(time[0], 'yyyy-MM-dd hh:mm:ss')
        var etime = this.formatter(time[1], 'yyyy-MM-dd hh:mm:ss')
      }
      // console.log(stime, etime)
      var para = { name: params.name, s_time: stime, e_time: etime }
      getLoan(para).then((res) => {
        console.log(res)
        var response = res.data
        if (response.error_num === 0) {
          var LoanList = response['list']
          this.LoanMsgList = LoanList
          console.log(this.LoanMsgList)
        }
      })
    },
    // 关键词搜索
    search(keywords) {
      var NewLoanList = []
      this.LoanMsgList.filter(item => {
        if (item.equ_type.includes(keywords)) {
          NewLoanList.push(item)
        }
      })
      return NewLoanList
    },
    repay(row) {
      this.$confirm('点击‘确认’归还设备', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.dialogRepay = true
        this.$nextTick(() => {
          this.$refs.repayMsg.init(row)
        })
        getLoan
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .toolbar {
    background: #f7f7f7;
    padding: 10px;
    margin: 10px 0px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
