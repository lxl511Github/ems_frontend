<template>
  <section>
    <el-dialog title="出借登记" :visible.sync="modalVisible" :before-close="modalClose" width="750px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="loanName"><el-input v-model="ruleForm.loanName" /></el-form-item>
        <el-form-item label="工号" prop="jobNum"><el-input v-model="ruleForm.jobNum" type="text" /></el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="ruleForm.department" placeholder="请选择部门">
            <el-option label="应用所" value="应用所" />
            <el-option label="车间" value="车间" />
            <el-input v-model="ruleForm.department" type="text" style="width:50% text-align:center" placeholder="手动输入...." />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="equName"><el-input v-model="ruleForm.equName" type="text" placeholder="请输入所借设备名称" /></el-form-item>
        <el-form-item label="设备编号" prop="equ_num"><el-input v-model="ruleForm.equ_num" type="text" placeholder="请输入所借设备编号" /></el-form-item>
        <el-form-item label="出借时间" prop="date"><el-date-picker v-model="ruleForm.date" type="date" placeholder="请选择日期" formmat="yyyy年MM月dd日" /></el-form-item>
        <el-form-item label="用途说明" prop="desc"><el-input v-model="ruleForm.desc" type="textarea" :rows="2" placeholder="请说明用途，预计归还日期" /></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        loanName: '',
        jobNum: '',
        department: '',
        date: '',
        equName: '',
        equ_num: '',
        desc: ''

      },
      rules: {
        loanName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在2到5个字符', trigger: 'blur' }
        ],
        jobNum: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 6, max: 7, message: '长度在6到7个字符', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        equName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        equ_num: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '此栏不可为空', trigger: 'blur' }

        ]
      },
      modalVisible: false
    }
  },
  methods: {
    init(row) {
      this.modalVisible = true
      this.ruleForm.equ_num = row.serialNum
      this.ruleForm.equName = row.name
    },
    modalClose() {
      this.$refs['ruleForm'].resetFields()
      this.modalVisible = false
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          var ruleForm = JSON.stringify(this.ruleForm)
          console.log(ruleForm)
          this.$axios({
            method: 'post',
            url: 'api/equ/LoanMsg/',
            headers: {
              'Content-type': 'application/json'
            },
            data: ruleForm
          }).then((res) => {
            if (res.data.code === 200) {
              this.ruleForm = {}
              this.$refs['ruleForm'].resetFields()
              this.modalVisible = false
              this.$parent.getEqus()
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
