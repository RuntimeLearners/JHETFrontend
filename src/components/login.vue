<script setup>
import { ref } from 'vue'

const dialogVisible = ref(true) 

const handleClose = () => {
  console.log('对话框已关闭')
}
</script>


<template>
  <div class="login-container">
    <el-button @click="dialogVisible = true">显示登录对话框</el-button>
    
    <el-dialog
      v-model="dialogVisible"
      title="欢迎登录学生服务平台"
      width="500px"
      @close="handleClose"
    >
      <span>这里是登录表单内容</span>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
          </el-button>
        </div>
      </template>
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
