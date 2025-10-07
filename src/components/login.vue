<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus' 
const router = useRouter()
const dialogVisible = ref(true)
const loading = ref(false) 
const form = reactive({
  name: '',
  password: '',
  userType: 'student'
})
const rules = reactive({
  name: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
})
const formRef = ref() 
const onSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
  } catch (error) {
    ElMessage.warning('请正确填写表单')
    return
  }
  loading.value = true
  try {
const response = await fetch('http://coco-29.wang:8080/api/auth/login/combo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
   // 'Authorization': 'EAAAAAAAAAAAAABAAAAVynVbgAAAAAAAAAAiuj8c3mhRaavKhv-6VUNTV7KQ5bmtLrz' 
  },
 body: JSON.stringify({
  account: form.name, 
  password: form.password,
  userType: form.userType
})
})
    const result = await response.json()
    if (response.status === 200) {
      ElMessage.success('登录成功')
      localStorage.setItem('token', result.token || result.data?.token || '')
      router.push('/firstpage')
    } else if (response.status === 401) {
      ElMessage.error(result.message || '登录失败: 没有权限')
    } else {
      ElMessage.error(result.message || '登录失败，请稍后重试')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}
const handleClose = () => {
  dialogVisible.value = false
}
</script>
<template>
  <div class="login-container">
    <el-dialog
      v-model="dialogVisible"
      title="欢迎登录学生服务平台"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" style="max-width: 600px">
        <el-form-item label="账号" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type='password' v-model="form.password" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-radio-group v-model="form.userType">
            <el-radio value="student">学生</el-radio>
            <el-radio value="vip">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit" :loading="loading">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
          <el-button>注册</el-button>
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
