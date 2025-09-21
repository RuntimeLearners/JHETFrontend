<script setup>
import { ref } from 'vue'

const dialogVisible = ref(true) 

const handleClose = () => {
  console.log('对话框已关闭')
}
</script>


<template>
  <div class="login-container">
   
    <el-dialog
      v-model="dialogVisible"
      title="欢迎登录学生服务平台"
      width="500px"
      @close="handleClose"
    >

     <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="账号">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input type='password' v-model="form.name" />
    </el-form-item>
     </el-form>
      <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
      </el-dialog>
  </div>
</template>

<style scoped>
.login-container {
  padding: 20px;
}
</style>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
