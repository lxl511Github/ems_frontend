<template>
  <section>
    <!-- // 此页面暂时不用 -->
    <el-dialog :title="id? '新增' : '修改'" :visible.sync="modalShow" :before-close="modalClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备编号">
          <el-input v-model="form.serialNum" autocomplete="off" />
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
            <el-radio label="正常">正常</el-radio>
            <el-radio label="损坏">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit($event)">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
    return {
      addFlag: true,
      form: {
      },
      modalShow: false
    }
  },
  methods: {
    init(id) {
      this.form.id = id || 0
      this.modalShow = true
      // this.$nextTick(() => {
      //   this.$nextTick['form'].resetFields()
      // })
    },
    onSubmit(event) {
      var formData = JSON.stringify(this.form)
      console.log(formData)
      // this.$axios.post('http://127.0.0.1:8000/equ/add_equ', formData).then((res) => {
      this.$axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/equ/add_equ',
        headers: {
          'Content-type': 'application/json'
        },
        data: formData
      }).then((res) => {
        if (res.data.code === 200) {
          alert('设备新增成功')
        } else {
          alert('设备新增失败')
        }
      })
      this.modalShow = false
    },
    modalClose() {
      this.modalShow = false
    }
  }
}
</script>
