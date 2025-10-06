
<template>
  <div class="profile-page">
    <!-- 页面头部 -->
    <div class="header">
      <div class="logo">
        <i class="el-icon-user"></i>
        <span>个人信息管理</span>
      </div>
      <div class="user-info">
        <el-button type="primary" @click="goBack">
          <i class="el-icon-back"></i>
          返回主页
        </el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="profile-container">
        <!-- 头像设置区域 -->
        <div class="avatar-section">
          <h3 class="section-title">头像设置</h3>
          <div class="avatar-upload">
            <el-avatar 
              :size="100" 
              :src="userInfo.avatar" 
              class="user-avatar"
            >
              {{ userInfo.nickname ? userInfo.nickname.charAt(0) : '用' }}
            </el-avatar>
            <div class="avatar-actions">
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="handleAvatarUpload"
              >
                <el-button type="primary" size="small">
                  <i class="el-icon-upload"></i>
                  更换头像
                </el-button>
              </el-upload>
              <el-button 
                size="small" 
                @click="userInfo.avatar = ''"
                v-if="userInfo.avatar"
              >
                移除头像
              </el-button>
            </div>
            <div class="upload-tip">支持 JPG、PNG 格式，大小不超过 2MB</div>
          </div>
        </div>

        <!-- 基本信息表单 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <el-form 
            :model="userInfo" 
            :rules="formRules" 
            ref="baseInfoForm"
            label-width="100px"
          >
            <el-form-item label="学号/工号">
              <el-input 
                v-model="userInfo.id" 
                disabled 
                placeholder="学号/工号不可修改"
              />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input 
                v-model="userInfo.nickname" 
                placeholder="请输入昵称"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
              <el-input 
                v-model="userInfo.phone" 
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="userInfo.email" 
                placeholder="请输入邮箱地址"
                type="email"
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                @click="updateBaseInfo" 
                :loading="saving"
              >
                <i class="el-icon-check"></i>
                保存基本信息
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 密码修改区域 -->
        <div class="password-section">
          <h3 class="section-title">修改密码</h3>
          <el-form 
            :model="passwordForm" 
            :rules="passwordRules" 
            ref="passwordForm"
            label-width="100px"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input 
                v-model="passwordForm.currentPassword" 
                type="password"
                placeholder="请输入当前密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="warning" 
                   @click="updatePassword" 
                :loading="changingPassword"
              >
                <i class="el-icon-lock"></i>
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProfilePage',
  
  data() {
    // 密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      // 加载状态
      saving: false,
      changingPassword: false,
      uploadingAvatar: false,
      
      // 用户基本信息
      userInfo: {
        id: 'S2024001', // 后期需要：从登录信息获取
        nickname: '张三',
        phone: '13800138000',
        email: 'student@example.com',
        avatar: ''
      },
      
      // 密码修改表单
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      // 表单验证规则
      formRules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      
      // 密码修改验证规则
      passwordRules: {
        currentPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
          { 
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/,
            message: '密码必须包含大小写字母和数字',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  
  computed: {
    // 计算用户头像显示
    userAvatar() {
      return this.userInfo.avatar || this.generateDefaultAvatar()
    }
  },
  
  methods: {
    /**
     * 返回主页面
     * 后期需要：根据实际路由配置调整
     */
    goBack() {
      this.$router.push('/mainpage')
    },
    
    /**
     * 头像上传前的验证
     * 后期需要：可以根据实际需求调整验证规则
     */
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPNG) {
        this.$message.error('头像只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('头像大小不能超过 2MB!')
        return false
      }
      return true
    },
    
    /**
     * 处理头像上传
     * 后期需要：连接后端文件上传接口
     */
    async handleAvatarUpload(options) {
      try {
        this.uploadingAvatar = true
        
        // 后期需要：替换为真实的上传接口
        // const formData = new FormData()
        // formData.append('avatar', options.file)
        // 
        // const response = await this.$http.post('/api/user/upload-avatar', formData, {
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // })
        // 
        // this.userInfo.avatar = response.data.avatarUrl
        
        // 模拟上传过程
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟上传成功，生成预览URL
        const previewUrl = URL.createObjectURL(options.file)
        this.userInfo.avatar = previewUrl
        
        this.$message.success('头像上传成功！')
        
        // 后期需要：这里可以调用更新用户信息的接口
        // await this.updateUserAvatar(response.data.avatarUrl)
        
      } catch (error) {
        console.error('头像上传失败:', error)
        this.$message.error('头像上传失败，请重试')
      } finally {
        this.uploadingAvatar = false
      }
    },
    
    /**
     * 更新用户头像到后端
     * 后期需要：连接后端更新头像接口
     */
    async updateUserAvatar(avatarUrl) {
      try {
        // 后期需要：替换为真实的API调用
        // await this.$http.patch('/api/user/avatar', {
        //   avatar: avatarUrl
        // })
        
        console.log('更新头像到后端:', avatarUrl)
      } catch (error) {
        console.error('更新头像失败:', error)
        throw error
      }
    },
    
    /**
     * 更新基本信息
     * 后期需要：连接后端用户信息更新接口
     */
    async updateBaseInfo() {
      try {
        // 表单验证
        await this.$refs.baseInfoForm.validate()
        
        this.saving = true
        
        // 后期需要：替换为真实的API调用
        // const response = await this.$http.put('/api/user/profile', {
        //   nickname: this.userInfo.nickname,
        //   phone: this.userInfo.phone,
        //   email: this.userInfo.email
        // })
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟成功响应
        // const updatedUser = response.data
        
        this.$message.success('基本信息更新成功！')
        
        // 后期需要：更新本地用户信息存储
        // localStorage.setItem('userInfo', JSON.stringify(updatedUser))
        
      } catch (error) {
        if (error.fields) {
          this.$message.error('请完善表单信息')
        } else {
          console.error('更新基本信息失败:', error)
          this.$message.error('更新失败，请重试')
        }
      } finally {
        this.saving = false
      }
    },
    
    /**
     * 修改密码
     * 后期需要：连接后端密码修改接口
     */
    async updatePassword() {
      try {
        // 表单验证
        await this.$refs.passwordForm.validate()
        
        this.changingPassword = true
        
        // 后期需要：替换为真实的API调用
        // const response = await this.$http.post('/api/user/change-password', {
        //   currentPassword: this.passwordForm.currentPassword,
        //   newPassword: this.passwordForm.newPassword
        // })
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        this.$message.success('密码修改成功！')
        
        // 清空密码表单
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        // 清除表单验证状态
        this.$refs.passwordForm.clearValidate()
        
        // 后期需要：可能需要重新登录
        // this.$message.info('请重新登录')
        // this.$router.push('/login')
        
      } catch (error) {
        if (error.fields) {
          this.$message.error('请完善密码信息')
        } else {
          console.error('修改密码失败:', error)
          // 后期需要：根据后端返回的具体错误信息显示
          // if (error.response?.data?.code === 'INCORRECT_PASSWORD') {
          //   this.$message.error('当前密码错误')
          // } else {
          this.$message.error('修改失败，请重试')
          // }
        }
      } finally {
        this.changingPassword = false
      }
    },
    
    /**
     * 生成默认头像（根据昵称首字母）
     */
    generateDefaultAvatar() {
      // 这里可以返回一个默认头像的URL
      // 或者使用CSS样式显示首字母
      return ''
    },
    
    /**
     * 加载用户信息
     * 后期需要：从后端获取用户信息
     */
    async loadUserInfo() {
      try {
        // 后期需要：替换为真实的API调用
        // const response = await this.$http.get('/api/user/profile')
        // this.userInfo = { ...this.userInfo, ...response.data }
        
        // 模拟从本地存储加载
        const savedUserInfo = localStorage.getItem('userInfo')
        if (savedUserInfo) {
          const userData = JSON.parse(savedUserInfo)
          this.userInfo = { ...this.userInfo, ...userData }
        }
        
      } catch (error) {
        console.error('加载用户信息失败:', error)
        this.$message.error('加载用户信息失败')
      }
    }
  },
  
  mounted() {
    // 组件挂载后加载用户信息
    this.loadUserInfo()
  }
}
</script>
<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 头部样式 - 与主页面保持一致 */
.header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.logo i {
  margin-right: 10px;
  font-size: 28px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 主内容区域 */
.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 区域标题 */
.section-title {
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
}

/* 头像设置区域 */
.avatar-section {
  margin-bottom: 40px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  border: 3px solid #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.avatar-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 10px;
}

/* 表单区域 */
.form-section {
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e6e6e6;
}

.form-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

/* 密码修改区域 */
.password-section {
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e6e6e6;
  border-left: 4px solid #E6A23C;
}

.password-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

/* 表单样式优化 */
.el-form {
  max-width: 500px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-form-item__label {
  font-weight: 600;
  color: #606266;
}

.el-input, .el-select {
  width: 100%;
}

/* 按钮样式 - 与主页面保持一致 */
.el-button {
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  padding: 12px 30px;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.el-button--warning {
  background: linear-gradient(135deg, #E6A23C, #F56C6C);
  border: none;
  padding: 12px 30px;
  color: white;
}

.el-button--warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(230, 162, 60, 0.4);
}

/* 返回按钮特殊样式 */
.header .el-button--primary {
  background: linear-gradient(135deg, #909399, #C0C4CC);
  padding: 10px 20px;
}

/* 上传按钮特殊样式 */
.avatar-actions .el-button--primary {
  padding: 8px 16px;
  font-size: 14px;
}

/* 禁用状态输入框样式 */
.el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
}

/* 加载状态 */
.el-button.is-loading {
  opacity: 0.7;
  transform: none !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px 20px;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .profile-container {
    max-width: 100%;
  }
  
  .avatar-section,
  .form-section,
  .password-section {
    padding: 20px;
    margin-bottom: 25px;
  }
  
  .avatar-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .el-form-item {
    margin-bottom: 18px;
  }
  
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .avatar-upload {
    gap: 15px;
  }
  
  .user-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .el-form {
    max-width: 100%;
  }
}

/* 特殊状态提示 */
.upload-tip {
  max-width: 300px;
  line-height: 1.4;
}

/* 表单分组视觉分隔 */
.form-section + .password-section {
  margin-top: 10px;
}

/* 输入框聚焦效果 */
.el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 密码强度提示样式 */
.password-strength {
  margin-top: 8px;
  font-size: 12px;
}

.password-strength.weak {
  color: #F56C6C;
}

.password-strength.medium {
  color: #E6A23C;
}

.password-strength.strong {
  color: #67C23A;
}

/* 头像上传区域特殊样式 */
.avatar-upload :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-upload :deep(.el-upload:hover) {
  border-color: #409EFF;
}

/* 确保Element Plus组件样式正确 */
:deep(.el-avatar) {
  flex-shrink: 0;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.el-input__inner) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 20px;
}
</style>