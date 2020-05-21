<template>
  <section class="home">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding: 10px 20px 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item><el-input v-model="keywords" placeholder="根据型号模糊查询" clearable /></el-form-item>
        <!-- <el-date-picker v-model="filters.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择日期时间" clearable /> -->
        <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入设备名称" clearable />
          <!-- <el-select v-model="filters.name" placeholder="请选择设备名称" clearable>
            <el-option v-for="item in EquNameOption" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.status" placeholder="请选择设备状态" clearable>
            <el-option v-for="item in EquStatusOption" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-search" @click="searchHandle(filters)">搜索</el-button></el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="addHandle">新增</el-button></el-form-item>
        <el-form-item><el-button type="primary" @click="loanHandle">出借</el-button></el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table highlight-current-row :data="search(keywords)" style="width: 100%" @selection-change="selsChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="serialNum" label="编号" sortable>
        <template slot-scope="scope">
          <el-link type="" @click="loanHandle(scope.row)">{{ scope.row.serialNum }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" sortable />
      <el-table-column prop="equ_type" label="型号" sortable />
      <el-table-column prop="add_time" label="录入时间" sortable />
      <el-table-column prop="equ_status" label="设备状态" sortable>
        <template slot-scope="scope">
          <el-link to="" type="success" @click="detail(scope.row)">{{ scope.row.equ_status }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="admin_per" label="管理员" sortable />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="mini" icon="" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="" @click="delHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 工具条 -->
    <el-col class="toolbar">
      <el-button type="danger" :disabled="sels.length===0" @click="batchRemove">批量处理</el-button>
      <el-pagination layout="prev, pager, next" :page-size="20" style="float:right;" />
    </el-col>
    <!-- 新增// 编辑界面 (共用)-->
    <el-dialog :title="addFlag? '新增':'修改'" :visible.sync="modalShow" :before-close="modalClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备编号">
          <el-input v-model="form.serialNum" :disabled="false" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备名称"><el-input v-model="form.name" type="text" /></el-form-item>
        <el-form-item label="设备型号"><el-input v-model="form.equ_type" type="text" /></el-form-item>
        <el-form-item label="管理员">
          <el-select v-model="form.admin_per" placeholder="选择管理员">
            <el-option label="zhnagsan" value="zhangsan" />
            <el-option label="lisi" value="lisi" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-radio-group v-model="form.equ_status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="2">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit($event)">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="信息说明" :visible.sync="dialog3Visible" style="30px">
      <el-table :data="LoanMsg" style="width: 100%">
        <el-table-column prop="loanName" label="借出人" />
        <el-table-column prop="jobNum" label="工号" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="date" label="时间" />
      </el-table>
    </el-dialog>
    <!-- 出借登记 -->
    <loanRegister v-if="loanDialogVisible" ref="loanRegister" />
    <!-- <addUpdate v-if="addUpdateVisible" ref="addUpdate" /> -->
  </section>
</template>
<script>
import { getEqu, batchRemove } from '../../../api/table'
import loanRegister from './loanRegister.vue'
// const EquNameOption = [
//   { key: '1', display_name: '震动传感器' },
//   { key: '2', display_name: '压力传感器' },
//   { key: '3', display_name: '风速传感器' }
// ]
const EquStatusOption = [
  { key: '1', display_name: '正常' },
  { key: '2', display_name: '损坏' },
  { key: '3', display_name: '借出' },
  { key: '4', display_name: '遗失' },
  { key: '5', display_name: '报废' }
]
const ValueMap = {
  '1': '正常',
  '2': '损坏',
  '3': '借出',
  '4': '报废',
  '5': '遗失'
}
export default {
  components: {
    loanRegister
  },
  data() {
    return {
      filters: {
        name: '',
        status: ''
      },
      form: {},
      addFlag: true,
      searchFlag: false,
      keywords: '',
      dialog2Visible: false,
      disabled: true,
      dialog3Visible: false,
      loanDialogVisible: false,
      modalShow: false,
      listLoading: false,
      equList: [], // 列表数据
      sels: [], // 列表选中列
      LoanMsg: [],
      newSearchList: [],
      EquStatusOption,
      value: ''
    }
  },
  mounted: function() {
    this.getEqus()
  },
  methods: {
    detail(row) {
      if (row.equ_status === '借出') {
        this.$axios.get('api/equ/LoanMsg/', { params: { equ_num: row.serialNum }}).then((res) => {
          var response = res.data
          if (response.error_num === 0) {
            var LoanList = response['list']
            this.LoanMsg = LoanList
            this.dialog3Visible = true
          }
        })
      }
    },
    // 获取设备列表
    getEqus() {
      this.listLoading = true
      getEqu().then((res) => {
      // this.$axios.get('api/equ/show_equ').then((res) => {
        var response = res.data
        if (response.error_num === 0) {
          var equList0 = response['list']
          for (var i = 0; i < equList0.length; i++) {
            var value = equList0[i].equ_status
            for (var key in ValueMap) {
              if (value === key) {
                equList0[i].equ_status = ValueMap[key]
              }
            }
          }
          this.equList = equList0
        } else {
          this.$message.error('查询数据失败')
        }
      })
        .catch((res) => {
          // console.log()
        })
    },
    // 点击弹出新增弹框
    addHandle() {
      this.modalShow = true
    },
    // 点击弹出编辑弹框
    editHandle(row) {
      this.form = row
      this.modalShow = true
      this.addFlag = false
      this.disabled = true
    },
    // 点击编辑/新增的提交按钮
    onSubmit(event) {
      var formData = JSON.stringify(this.form)
      // this.$axios.post('http://127.0.0.1:8000/equ/AddEqu', formData).then((res) => {
      this.$axios({
        method: 'POST',
        url: '/api/equ/AddEqu',
        headers: {
          'Content-type': 'application/json'
        },
        data: formData
      }).then((res) => {
        console.log(res.data.code)
        if (res.data.code === '200') {
          this.getEqus()
          this.form = {}
        } else {
          alert('设备新增失败')
        }
      })
      this.modalShow = false
    },
    modalClose() {
      this.modalShow = false
    },
    // 点击出借按钮
    loanHandle(row) {
      this.$confirm('点击‘确认’借用此设备', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loanDialogVisible = true
        this.$nextTick(() => {
          this.$refs.loanRegister.init(row)
        })
      })
    },
    // 点击删除按钮方法
    delHandle: function(row) {
      // this.dialog2Visible = true
      var ids = row.id
      this.$confirm('确认删除此项吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        var para = { ids: ids }
        batchRemove(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getEqus()
        })
      }).catch(() => {
      })
    },
    // 条件查询
    searchHandle: function(params) {
      getEqu(params).then((res) => {
        console.log(res)
        var response = res.data
        if (response.error_num === 0) {
          var equList0 = response['list']
          for (var i = 0; i < equList0.length; i++) {
            var value = equList0[i].equ_status
            for (var key in ValueMap) {
              if (value === key) {
                equList0[i].equ_status = ValueMap[key]
              }
            }
          }
          this.equList = equList0
        } else {
          this.$message.error('查询数据失败')
        }
      })
    },
    // 关键字搜索
    search(keywords) {
      var newEquList = []
      this.equList.filter(item => {
        if (item.equ_type.includes(keywords)) {
          newEquList.push(item)
        }
      })
      return newEquList
    },
    selsChange(sels) {
      this.sels = sels
    },
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中项吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        var para = { ids: ids }
        batchRemove(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getEqus()
        })
      }).catch(() => {
        alert('删除失败')
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
