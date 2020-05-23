<template>
  <section>
    <el-dialog title="归还登记" :visible.sync="modalVisible" :before-close="modalClose" width="750px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="设备编号" prop="serialNum"><el-input v-model="ruleForm.serialNum" /></el-form-item>
        <el-form-item label="设备名称" prop="name"><el-input v-model="ruleForm.name" type="text" /></el-form-item>
        <el-form-item label="设备状态" prop="equ_status">
          <el-select v-model="ruleForm.equ_status" placeholder="设备状态">
            <el-option label="正常" value="1" />
            <el-option label="异常" value="6" />
            <el-option label="损坏" value="2" />
          </el-select>
          <el-input v-model="ruleForm.descText" type="text" style="width:50% text-align:center" placeholder="如果异常，请在此说明原因" />
        </el-form-item>
        <el-form-item label="归还时间" prop="date"><el-date-picker v-model="ruleForm.date" type="date" placeholder="请选择日期" formmat="yyyy年MM月dd日" /></el-form-item>
        <!-- <el-form-item label="处理人" prop="admin"><el-input v-model="ruleForm.admin" /></el-form-item> -->
        <el-form-item label="处理人" prop="admin">
          <el-select v-model="ruleForm.admin" placeholder="请选择人员">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-input v-model="ruleForm.admin" type="text" style="width:50% text-align:center" placeholder="手动输入...." />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark"><el-input v-model="ruleForm.remark" type="textarea" :rows="2" placeholder="请说明用途，预计归还日期" /></el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
// import { getLoan } from '../../../api/table'
export default {
  data() {
    return {
      ruleForm: {
        serialNum: '',
        name: '',
        equ_status: '',
        descText: '',
        date: '',
        admin: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        serialNum: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        equ_status: [
          { required: true, message: '状态', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        admin: [
          { required: true, message: '请选择处理人', trigger: 'blur' }
        ]
      },
      modalVisible: false
    }
  },
  methods: {
    init(row) {
      this.modalVisible = true
      this.ruleForm.serialNum = row.serialNum
      this.ruleForm.name = row.name
    },
    modalClose() {
      this.$refs['ruleForm'].resetFields()
      this.modalVisible = false
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          var ruleForm = JSON.stringify(this.ruleForm)
          this.$axios({
            method: 'post',
            url: 'api/equ/Repay/',
            headers: {
              'Content-type': 'application/json'
            },
            data: ruleForm
          }).then((res) => {
            console.log(res)
            if (res.data.code === '200') {
              this.ruleForm = {}
              this.$refs['ruleForm'].resetFields()
              this.modalVisible = false
              this.$parent.GetLoanList()
            } else {
              alert('提交失败')
            }
          })
        }
      })
    }
  }
}
</script>
