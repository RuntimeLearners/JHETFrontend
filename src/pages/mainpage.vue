

<template>
  <div class="student-main-page">
    <!-- 页面头部 -->
    <div class="header">
      <div class="logo">
        <i class="el-icon-school"></i>
        <span>学生服务平台</span>
      </div>
      <div class="user-info">
       
        <div class="user-details">
          
          <div class="username">{{ userInfo.name || '学生用户' }}</div>
          <div class="student-id">学号: {{ userInfo.id || '未设置' }}</div>
        </div>
        <el-button 
          type="primary" 
          @click="goToinfo" 
          class="profile-btn"
        >
          <i class="el-icon-user"></i>
          修改个人信息
        </el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 标签页导航 -->
      <el-tabs v-model="activeTab" class="main-tabs">
        <!-- 问题反馈标签页 -->
        <el-tab-pane label="问题反馈" name="feedback">
          <div class="feedback-form">
            <h2 class="form-title">📝 提交问题反馈</h2>
            
            <el-form 
              :model="feedbackForm" 
              :rules="formRules" 
              ref="feedbackFormRef"
              label-width="120px"
            >
              <!-- 反馈标题 -->
              <el-form-item label="反馈标题" prop="title">
                <el-input 
                  v-model="feedbackForm.title" 
                  placeholder="请简要描述问题标题"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>

              <!-- 问题类别 -->
              <el-form-item label="问题类别" prop="category">
                <el-select 
                  v-model="feedbackForm.category" 
                  placeholder="请选择问题类别"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <!-- 紧急程度和匿名选择 -->
              <el-form-item label="反馈设置">
                <div class="form-settings">
                  <div class="setting-item">
                    <span class="setting-label">是否紧急:</span>
                    <el-switch
                      v-model="feedbackForm.isUrgent"
                      active-text="紧急"
                      inactive-text="普通"
                    />
                  </div>
                  <div class="setting-item">
                    <span class="setting-label">是否匿名:</span>
                    <el-switch
                      v-model="feedbackForm.isAnonymous"
                      active-text="匿名"
                      inactive-text="实名"
                    />
                  </div>
                </div>
              </el-form-item>

              <!-- 问题内容 -->
              <el-form-item label="问题内容" prop="content">
                <el-input
                  v-model="feedbackForm.content"
                  type="textarea"
                  :rows="6"
                  placeholder="请详细描述您遇到的问题、建议或需求..."
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>

              <!-- 图片上传 -->
              <el-form-item label="上传图片">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :file-list="feedbackForm.images"
                  :on-change="handleImageUpload"
                  :on-remove="handleImageRemove"
                  :auto-upload="false"
                  :limit="3"
                  accept="image/*"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
                <div class="upload-tip">最多上传3张图片，支持jpg、png格式</div>
              </el-form-item>

              <!-- 提交按钮 -->
              <el-form-item>
                <el-button 
                  type="primary" 
                  @click="submitFeedback" 
                  :loading="submitting"
                  class="submit-btn"
                >
                  <i class="el-icon-s-promotion"></i>
                  提交反馈
                </el-button>
                <el-button class="trycss" @click="resetForm">重置表单</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
                <!-- 反馈记录标签页 -->
        <el-tab-pane label="反馈记录" name="records">
          <div class="records-section">
            <h2 class="form-title">📋 我的反馈记录</h2>
            
            <!-- 记录统计 -->
            <div class="records-stats">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-number">{{ totalRecords }}</div>
                    <div class="stat-label">总反馈数</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-number waiting">{{ waitingReplyCount }}</div>
                    <div class="stat-label">待回复</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-number replied">{{ repliedCount }}</div>
                    <div class="stat-label">已回复</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-number urgent">{{ urgentCount }}</div>
                    <div class="stat-label">紧急反馈</div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 记录列表 -->
            <div class="records-list">
              <div v-if="feedbackRecords.length === 0" class="empty-state">
                <i class="el-icon-document"></i>
                <p>暂无反馈记录</p>
                <el-button type="primary" @click="activeTab = 'feedback'">
                  去提交第一个反馈
                </el-button>
              </div>

              <div v-else>
                <div 
                  v-for="record in feedbackRecords" 
                  :key="record.id" 
                  class="record-card"
                  :class="{ 'urgent-card': record.isUrgent }"
                >
                  <!-- 记录头部信息 -->
                  <div class="record-header">
                    <div class="record-basic-info">
                      <span class="record-id">反馈ID: {{ record.id }}</span>
                      <el-divider direction="vertical" />
                      <span class="student-id">学号: {{ record.studentId }}</span>
                      <el-divider direction="vertical" />
                      <span class="submit-time">{{ record.submitTime }}</span>
                    </div>
                    <div class="record-tags">
                      <el-tag v-if="record.isUrgent" type="danger" size="small">
                        <i class="el-icon-warning"></i>紧急
                      </el-tag>
                      <el-tag v-if="record.isAnonymous" type="info" size="small">
                        匿名
                      </el-tag>
                      <el-tag 
                        :type="record.status === 'replied' ? 'success' : 'warning'" 
                        size="small"
                      >
                        {{ record.status === 'replied' ? '已回复' : '待回复' }}
                      </el-tag>
                    </div>
                  </div>

                  <!-- 反馈内容 -->
                  <div class="record-content">
                    <div class="content-item">
                      <strong>标题：</strong>{{ record.title }}
                    </div>
                    <div class="content-item">
                      <strong>类别：</strong>{{ record.category }}
                    </div>
                    <div class="content-item">
                      <strong>问题描述：</strong>
                      <div class="problem-content">{{ record.content }}</div>
                    </div>
                  </div>

                  <!-- 管理员回复区域 -->
                  <div class="reply-section" :class="{ 'waiting': record.status === 'waiting' }">
                    <div class="reply-header">
                      <i class="el-icon-chat-dot-round"></i>
                      <strong>管理员回复</strong>
                    </div>
                    <div v-if="record.status === 'replied'" class="reply-content">
                      {{ record.reply }}
                    </div>
                    <div v-else class="waiting-reply">
                      <i class="el-icon-loading"></i>
                      等待管理员回复中...
                    </div>
                    <div v-if="record.replyTime" class="reply-time">
                      回复时间: {{ record.replyTime }}
                    </div>
                  </div>

                  <!-- 评价区域（仅当有回复时显示） -->
                  <div v-if="record.status === 'replied'" class="evaluation-section">
                    <div class="evaluation-header">
                      <i class="el-icon-star-off"></i>
                      <strong>服务评价</strong>
                    </div>
                    <el-input
                      v-model="record.evaluation"
                      type="textarea"
                      :rows="3"
                      placeholder="请对管理员的回复和服务进行评价..."
                      style="margin-bottom: 10px;"
                    />
                    <el-button 
                      type="success" 
                      @click="submitEvaluation(record)"
                      :disabled="!record.evaluation"
                      size="small"
                    >
                      <i class="el-icon-check"></i>
                      提交评价
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script >
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// 后期需要：根据实际项目结构调整导入方式
// import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'StudentMainPage',
  
  // 后期需要：如果使用Composition API可以改为setup语法
  data() {
    return {
      // 当前激活的标签页
      activeTab: 'feedback',
      
      // 提交加载状态
      submitting: false,
      
      // 用户信息
      userInfo: {
        id: 'S2024001', // 后期需要：从登录接口获取
        name: '张三',
        avatar: '',
        department: '计算机科学学院'
      },
      
      // 问题反馈表单数据
      feedbackForm: {
        title: '',
        category: '',
        isUrgent: false,
        isAnonymous: false,
        content: '',
        images: []
      },
      
      // 表单验证规则
      formRules: {
        title: [
          { required: true, message: '请输入反馈标题', trigger: 'blur' },
          { min: 5, max: 50, message: '标题长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择问题类别', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入问题内容', trigger: 'blur' },
          { min: 10, max: 500, message: '内容长度在 10 到 500 个字符', trigger: 'blur' }
        ]
      },
      
      // 问题类别选项
      categoryOptions: [
        { label: '教学管理', value: 'teaching' },
        { label: '后勤服务', value: 'logistics' },
        { label: '网络问题', value: 'network' },
        { label: '宿舍管理', value: 'dormitory' },
        { label: '图书馆服务', value: 'library' },
        { label: '其他问题', value: 'other' }
      ],
      
      // 反馈记录数据
      feedbackRecords: [
        {
          id: 'F1001',
          studentId: 'S2024001',
          title: '图书馆网络连接问题',
          category: 'network',
          isUrgent: true,
          isAnonymous: false,
          content: '图书馆三楼自习区的WiFi信号非常不稳定，经常断线，严重影响在线学习和资料查阅。希望技术部门能够尽快检修。',
          reply: '同学你好，我们已经安排技术人员对图书馆三楼的网络设备进行检修，预计本周内完成。感谢你的反馈！',
          status: 'replied',
          evaluation: '回复很及时，问题已经得到解决，非常感谢！',
          submitTime: '2024-01-15 10:30:25',
          replyTime: '2024-01-15 14:20:10'
        },
        {
          id: 'F1002',
          studentId: 'S2024001',
          title: '食堂卫生改进建议',
          category: 'logistics',
          isUrgent: false,
          isAnonymous: true,
          content: '建议加强食堂餐具的消毒工作，最近发现部分餐具清洗不够干净。',
          reply: '',
          status: 'waiting',
          evaluation: '',
          submitTime: '2024-01-16 14:20:33',
          replyTime: ''
        }
      ]
    }
  },
  
  computed: {
    // 总反馈数
    totalRecords() {
      return this.feedbackRecords.length
    },
    
    // 待回复数量
    waitingReplyCount() {
      return this.feedbackRecords.filter(record => record.status === 'waiting').length
    },
    
    // 已回复数量
    repliedCount() {
      return this.feedbackRecords.filter(record => record.status === 'replied').length
    },
    
    // 紧急反馈数量
    urgentCount() {
      return this.feedbackRecords.filter(record => record.isUrgent).length
    }
  },
    methods: {
    /**
     * 提交问题反馈
     * 后期需要：连接后端API
     */
    async submitFeedback() {
      try {
        // 表单验证
        await this.$refs.feedbackFormRef.validate()
        
        this.submitting = true
        
        // 后期需要：替换为真实的API调用
        // const response = await this.$http.post('/api/feedback/submit', this.feedbackForm)
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 创建新的反馈记录
        const newRecord = {
          id: 'F' + (1000 + this.feedbackRecords.length + 1),
          studentId: this.userInfo.id,
          title: this.feedbackForm.title,
          category: this.feedbackForm.category,
          isUrgent: this.feedbackForm.isUrgent,
          isAnonymous: this.feedbackForm.isAnonymous,
          content: this.feedbackForm.content,
          reply: '',
          status: 'waiting',
          evaluation: '',
          submitTime: new Date().toLocaleString('zh-CN'),
          replyTime: ''
        }
        
        // 添加到记录列表开头
        this.feedbackRecords.unshift(newRecord)
        
        // 重置表单
        this.resetForm()
        
        // 显示成功消息
        this.$message.success('问题反馈提交成功！')
        
        // 自动切换到记录页面
        this.activeTab = 'records'
        
      } catch (error) {
        if (error.fields) {
          this.$message.error('请完善表单信息')
        } else {
          this.$message.error('提交失败，请重试')
        }
      } finally {
        this.submitting = false
      }
    },
    
    /**
     * 重置反馈表单
     */
    resetForm() {
      this.feedbackForm = {
        title: '',
        category: '',
        isUrgent: false,
        isAnonymous: false,
        content: '',
        images: []
      }
      this.$refs.feedbackFormRef?.clearValidate()
    },
    
    /**
     * 处理图片上传
     * 后期需要：实现真实的文件上传
     */
    handleImageUpload(file) {
      console.log('上传文件:', file)
      // 后期需要：这里调用文件上传接口
      // const formData = new FormData()
      // formData.append('file', file.raw)
      this.$message.success('图片上传成功（模拟）')
    },
    
    /**
     * 处理图片移除
     */
    handleImageRemove(file) {
      console.log('移除文件:', file)
      this.feedbackForm.images = this.feedbackForm.images.filter(item => item.uid !== file.uid)
    },
    
    /**
     * 提交评价
     * 后期需要：连接后端API
     */
    async submitEvaluation(record) {
      if (!record.evaluation.trim()) {
        this.$message.warning('请填写评价内容')
        return
      }
      
      try {
        // 后期需要：替换为真实的API调用
        // await this.$http.post('/api/feedback/evaluate', {
        //   recordId: record.id,
        //   evaluation: record.evaluation
        // })
        
        this.$message.success('评价提交成功！')
      } catch (error) {
        this.$message.error('评价提交失败')
      }
    },
    
    /**
     * 跳转到个人信息页面
     * 后期需要：根据路由配置调整
     */
    goToinfo() {
    this.$router.push('/info')
      
    this.$message.info('跳转到个人信息修改页面（功能待实现）')
      // 临时方案：在新窗口打开或跳转
      // window.open('/profile', '_blank')
    },
    
    /**
     * 加载反馈记录
     * 后期需要：从后端API获取数据
     */
    async loadFeedbackRecords() {
      try {
        // 后期需要：替换为真实的API调用
        // const response = await this.$http.get('/api/feedback/records')
        // this.feedbackRecords = response.data
        
        console.log('加载反馈记录...')
      } catch (error) {
        this.$message.error('加载反馈记录失败')
      }
    }
  },
  
  mounted() {
    // 组件挂载后加载数据
    this.loadFeedbackRecords()
  }
}
</script>
<style scoped>
.student-main-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 头部样式 */
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

.user-details {
  text-align: right;
}

.username {
  font-weight: bold;
  font-size: 16px;
}

.student-id {
  font-size: 12px;
  color: #666;
}
.trycss{
 margin: 20px,0 ;
  border: none;
  border-radius: 30px;
 width: 120px;
 height:30px;

}
.profile-btn {
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  border-radius: 30px;
 width: 120px;
 height:30px;
}

/* 主内容区域 */
.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-tabs {
  min-height: 500px;
}

/* 表单样式 */
.feedback-form {
  max-width: 1000px;
  margin: auto;
  /* height: 400px; */
}

.form-title {
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.form-settings {
  display: flex;
  gap: 40px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-label {
  color: #606266;
  font-size: 14px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 30px;
  margin-bottom: 20px;
  
}

.submit-btn {
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  padding: 12px 40px;
    border-radius: 30px;
  margin-top: auto;
  height: 50px;

}

/* 记录统计 */
.records-stats {
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #409EFF;
}

.stat-card .waiting {
  color: #E6A23C;
}

.stat-card .replied {
  color: #67C23A;
}

.stat-card .urgent {
  color: #F56C6C;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* 反馈记录卡片 */
.records-section {
  max-width: 1000px;
  margin: auto;
}

.records-list {
  max-height: 600px;
  overflow-y: auto;
}

.record-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e6e6e6;
  transition: all 0.3s ease;
}

.record-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.urgent-card {
  border-left: 4px solid #F56C6C;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.record-basic-info {
  font-size: 14px;
  color: #666;
}

.record-tags {
  display: flex;
  gap: 8px;
}

.record-content {
  margin-bottom: 20px;
}

.content-item {
  margin-bottom: 10px;
}

.problem-content {
  margin-top: 5px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
}

/* 回复区域 */
.reply-section {
  background: #f0f9ff;
  border-radius: 6px;
  padding: 15px;
  margin: 15px 0;
  border-left: 4px solid #409EFF;
}

.reply-section.waiting {
  background: #fdf6ec;
  border-left: 4px solid #E6A23C;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #409EFF;
}

.reply-content {
  line-height: 1.6;
  color: #333;
}

.waiting-reply {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #E6A23C;
}

.reply-time {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  text-align: right;
}

/* 评价区域 */
.evaluation-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e6e6e6;
}

.evaluation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #E6A23C;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 60px;
  margin-bottom: 20px;
  color: #C0C4CC;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .student-main-page {
    padding: 10px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
  }
  
  .form-settings {
    flex-direction: column;
    gap: 20px;
  }
  
  .record-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .record-tags {
    justify-content: flex-start;
  }
}
</style>