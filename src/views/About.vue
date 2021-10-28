<template>
  <div class="about">
    <el-dialog title="" :visible.sync="dialogVisible" width="width" :before-close="dialogBeforeClose">
      <el-form :model="form">
        <el-form-item label="" :label-width="50">
          <el-input v-model="aaa"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aaa: '',
      dialogVisible: false
    }
  }
}
</script>

<style lang="scss" scoped></style>
