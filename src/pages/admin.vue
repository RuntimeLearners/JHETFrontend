<template>
  <div class="admin-page">
    <!-- 页面头部 -->
    <div class="header">
      <div class="logo">
        <i class="el-icon-s-management"></i>
        <span>学生反馈管理平台</span>
      </div>
      <div class="admin-info">
        <el-avatar :size="40" :src="adminInfo.avatar" class="admin-avatar">
          {{ adminInfo.name ? adminInfo.name.charAt(0) : "管" }}
        </el-avatar>
        <div class="admin-details">
          <div class="admin-name">{{ adminInfo.name || "管理员" }}</div>
          <div class="admin-role">{{ adminInfo.role || "普通管理员" }}</div>
        </div>
        <el-button type="primary" @click="handleLogout">
          <i class="el-icon-switch-button"></i>
          退出登录
        </el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 统计卡片 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-card pending">
              <div class="stat-icon">
                <i class="el-icon-chat-dot-round"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.pendingCount }}</div>
                <div class="stat-label">待处理反馈</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card processing">
              <div class="stat-icon">
                <i class="el-icon-time"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.processingCount }}</div>
                <div class="stat-label">处理中反馈</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card completed">
              <div class="stat-icon">
                <i class="el-icon-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.completedCount }}</div>
                <div class="stat-label">已完成反馈</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card spam">
              <div class="stat-icon">
                <i class="el-icon-warning-outline"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.spamCount }}</div>
                <div class="stat-label">垃圾信息待审核</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <el-card shadow="never">
          <el-form :model="filterForm" inline>
            <el-form-item label="反馈状态">
              <el-select
                v-model="filterForm.status"
                style="width: 200px;"
                placeholder="全部状态"
                clearable
              >
                <el-option label="待接单" value="pending"></el-option>
                <el-option label="处理中" value="processing"></el-option>
                <el-option label="已完成" value="completed"></el-option>
                <el-option
                  label="垃圾信息待审核"
                  value="spam_pending"
                ></el-option>
                <el-option
                  label="已标记垃圾信息"
                  value="spam_confirmed"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="紧急程度">
              <el-select
                style="width: 200px;"
                v-model="filterForm.urgency"
                placeholder="全部"
                clearable
              >
                <el-option label="紧急" value="urgent"></el-option>
                <el-option label="普通" value="normal"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="反馈类别">
              <el-select
                 style="width: 200px;"
                v-model="filterForm.category"
                placeholder="全部类别"
                clearable
              >
                <el-option
                  v-for="category in categoryOptions"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="filterForm.keyword"
                placeholder="搜索反馈标题或内容"
                prefix-icon="el-icon-search"
                style="width: 250px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <i class="el-icon-search"></i>
                搜索
              </el-button>
              <el-button @click="handleReset">
                <i class="el-icon-refresh"></i>
                搜索
              </el-button>
              <el-button @click="handleReset">
                <i class="el-icon-refresh"></i>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 反馈记录列表 -->
      <div class="feedback-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>反馈记录列表</span>
              <el-button type="text" @click="refreshList">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
          </template>

          <el-table :data="feedbackList" v-loading="loading">
            <!-- 反馈基本信息 -->
            <el-table-column
              prop="id"
              label="反馈ID"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="title"
              label="反馈标题"
              min-width="150"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="{ 'urgent-title': row.isUrgent }">
                  {{ row.title }}
                  <el-tag v-if="row.isUrgent" type="danger" size="mini"
                    >紧急</el-tag
                  >
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="category"
              label="类别"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="studentId"
              label="学生ID"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column prop="submitTime" label="提交时间" width="160">
              <template #default="{ row }">
                {{ formatTime(row.submitTime) }}
              </template>
            </el-table-column>

            <!-- 处理状态 -->
            <el-table-column
              prop="status"
              label="状态"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 处理人信息 -->
            <el-table-column
              prop="handlerName"
              label="处理人"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                <span v-if="row.handlerName">{{ row.handlerName }}</span>
                <span v-else class="text-muted">未分配</span>
              </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column
              label="操作"
              width="300"
              fixed="right"
              align="center"
            >
              <template #default="{ row }">
                <!-- 查看详情 -->
                <el-button
                  type="text"
                  size="small"
                  @click="handleViewDetail(row)"
                >
                  <i class="el-icon-view"></i>
                  详情
                </el-button>

                <!-- 接单操作 -->
                <el-button
                  v-if="row.status === 'pending'"
                  type="text"
                  size="small"
                  style="color: #67c23a"
                  @click="handleAcceptOrder(row)"
                >
                  <i class="el-icon-finished"></i>
                  接单
                </el-button>

                <!-- 撤销接单 -->
                <el-button
                  v-if="row.status === 'processing'"
                  type="text"
                  size="small"
                  style="color: #e6a23c"
                  @click="handleCancelAccept(row)"
                >
                  <i class="el-icon-close"></i>
                  撤销接单
                </el-button>

                <!-- 回复反馈 -->
                <el-button
                  v-if="row.status === 'processing'"
                  type="text"
                  size="small"
                  style="color: #409eff"
                  @click="handleReply(row)"
                >
                  <i class="el-icon-chat-round"></i>
                  回复
                </el-button>
                <!-- 标记垃圾信息 -->
                <el-button
                  v-if="
                    row.status !== 'spam_pending' &&
                    row.status !== 'spam_confirmed'
                  "
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click="handleMarkSpam(row)"
                >
                  <i class="el-icon-warning"></i>
                  标记垃圾
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-section">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 回复反馈对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复反馈" width="600px">
      <div v-if="currentFeedback">
        <el-form :model="replyForm" label-width="80px">
          <el-form-item label="反馈标题">
            <el-input :value="currentFeedback.title" disabled></el-input>
          </el-form-item>
          <el-form-item label="回复内容">
            <el-input
              v-model="replyForm.content"
              type="textarea"
              :rows="6"
              placeholder="请输入回复内容..."
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="replying"
          @click="handleSubmitReply"
        >
          提交回复
        </el-button>
      </template>
    </el-dialog>

    <!-- 标记垃圾信息对话框 -->
    <el-dialog v-model="spamDialogVisible" title="标记垃圾信息" width="500px">
      <div v-if="currentFeedback">
        <el-alert
          title="请注意"
          type="warning"
          description="标记为垃圾信息后，该反馈将提交给超级管理员审核。审核通过后，系统将自动回复用户并不计入评价统计。"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        ></el-alert>
        <el-form :model="spamForm" label-width="100px">
          <el-form-item label="标记原因">
            <el-select v-model="spamForm.reason" placeholder="请选择标记原因">
              <el-option label="无意义内容" value="meaningless"></el-option>
              <el-option label="重复反馈" value="duplicate"></el-option>
              <el-option label="广告信息" value="advertisement"></el-option>
              <el-option label="不当言论" value="inappropriate"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细说明">
            <el-input
              v-model="spamForm.description"
              type="textarea"
              :rows="3"
              placeholder="请详细说明标记为垃圾信息的原因..."
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
       <template #footer>
          <el-button @click="spamDialogVisible = false">取消</el-button>
          <el-button
            type="warning"
            :loading="markingSpam"
            @click="handleSubmitSpamMark"
          >
            提交标记申请
          </el-button>
        </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "AdminPage",

  data() {
    return {
      // 管理员信息

      adminInfo: {
        id: "admin001",
        name: "管理员",
        avatar: "1",
        role: "普通管理员",
      },

      // 统计信息
      stats: {
        pendingCount: 0,
        processingCount: 0,
        completedCount: 0,
        spamCount: 0,
      },

      // 筛选表单
      filterForm: {
        status: "",
        urgency: "",
        category: "",
        keyword: "",
      },

      // 分类选项
      categoryOptions: [
        { label: "教学管理", value: "teaching" },
        { label: "后勤服务", value: "logistics" },
        { label: "网络问题", value: "network" },
        { label: "宿舍管理", value: "dormitory" },
        { label: "图书馆服务", value: "library" },
        { label: "其他问题", value: "other" },
      ],

      // 反馈列表
      feedbackList: [
        {
          id: "F1001",
          title: "图书馆网络问题",
          category: "network",
          studentId: "S2024001",
          submitTime: "2024-01-15 10:30:25",
          status: "pending",
          isUrgent: true,
          handlerName: "",
        },
        {
          id: "F1002",
          title: "食堂卫生建议",
          category: "logistics",
          studentId: "S2024002",
          submitTime: "2024-01-16 14:20:33",
          status: "processing",
          isUrgent: false,
          handlerName: "管理员",
        },
      ],
      loading: false,

      // 分页信息
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 2,
      },

      // 对话框控制
      replyDialogVisible: false,
      spamDialogVisible: false,

      // 当前操作的反馈
      currentFeedback: null,

      // 回复表单
      replyForm: {
        content: "",
      },
      replying: false,

      // 垃圾标记表单
      spamForm: {
        reason: "",
        description: "",
      },
      markingSpam: false,
    };
  },

  methods: {
    /**
     * 处理退出登录
     * 后期需要：调用退出登录接口
     */
    handleLogout() {
      // 待实现
      this.$message.info("退出登录功能待实现");
    },

    /**
     * 处理搜索
     * 后期需要：根据筛选条件重新加载反馈列表
     */
    handleSearch() {
      // 待实现
      this.$message.info("搜索功能待实现");
    },

    /**
     * 重置筛选条件
     * 后期需要：重置表单并重新加载数据
     */
    handleReset() {
      // 待实现
      this.filterForm = {
        status: "",
        urgency: "",
        category: "",
        keyword: "",
      };
    },

    /**
     * 刷新列表
     * 后期需要：重新加载所有数据
     */
    refreshList() {
      // 待实现
      this.$message.info("刷新功能待实现");
    },

    /**
     * 处理接单操作
     * 后期需要：调用接单接口
     */
    handleAcceptOrder(feedback) {
      // 待实现
      this.$message.success(`已接单反馈：${feedback.title}`);
    },

    /**
     * 处理撤销接单
     * 后期需要：调用撤销接单接口
     */
    handleCancelAccept(feedback) {
      // 待实现
      this.$message.info(`撤销接单：${feedback.title}`);
    },

    /**
     * 处理查看详情
     * 后期需要：获取反馈的完整信息
     */
    handleViewDetail(feedback) {
      // 待实现
      this.$message.info(`查看详情：${feedback.title}`);
    },

    /**
     * 处理回复操作
     * 后期需要：打开回复对话框
     */
    handleReply(feedback) {
      this.currentFeedback = feedback;
      this.replyForm.content = "";
      this.replyDialogVisible = true;
    },

    /**
     * 提交回复
     * 后期需要：调用回复接口
     */
    handleSubmitReply() {
      // 待实现
      this.$message.success("回复提交成功");
      this.replyDialogVisible = false;
    },

    /**
     * 处理标记垃圾信息
     * 后期需要：打开标记对话框
     */
    handleMarkSpam(feedback) {
      this.currentFeedback = feedback;
      this.spamForm.reason = "";
      this.spamForm.description = "";
      this.spamDialogVisible = true;
    },

    /**
     * 提交垃圾标记申请
     * 后期需要：调用标记垃圾信息接口
     */
    handleSubmitSpamMark() {
      // 待实现
      this.$message.success("垃圾标记申请已提交");
      this.spamDialogVisible = false;
    },

    /**
     * 处理分页大小变化
     * 后期需要：重新加载数据
     */
    handleSizeChange(newSize) {
      // 待实现
      console.log("分页大小变化:", newSize);
    },

    /**
     * 处理页码变化
     * 后期需要：加载对应页码的数据
     */
    handleCurrentChange(newPage) {
      // 待实现
      console.log("页码变化:", newPage);
    },

    /**
     * 格式化时间显示
     */
    formatTime(time) {
      return time;
    },

    /**
     * 获取状态对应的标签类型
     */
    getStatusType(status) {
      const typeMap = {
        pending: "info",
        processing: "warning",
        completed: "success",
        spam_pending: "danger",
        spam_confirmed: "danger",
      };
      return typeMap[status] || "info";
    },

    /**
     * 获取状态对应的显示文本
     */
    getStatusText(status) {
      const textMap = {
        pending: "待接单",
        processing: "处理中",
        completed: "已完成",
        spam_pending: "垃圾待审核",
        spam_confirmed: "垃圾信息",
      };
      return textMap[status] || status;
    },
  },

  mounted() {
    // 初始化一些模拟数据
    this.stats = {
      pendingCount: 5,
      processingCount: 3,
      completedCount: 12,
      spamCount: 2,
    };
  },
};
</script>
<style scoped>
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

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
  color: #409eff;
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
  border-bottom: 2px solid #409eff;
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
  border-left: 4px solid #409eff;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  border: 3px solid #409eff;
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
  border-left: 4px solid #e6a23c;
}

.password-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

/* 表单样式优化 */
.el-form {
  /* max-width: 500px; */
}

.el-form-item {
  margin-bottom: 22px;
}

.el-form-item__label {
  font-weight: 600;
  color: #606266;
}

.el-input,
.el-select {
  width: 100%;
}

/* 按钮样式 - 与主页面保持一致 */
.el-button {
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, #409eff, #67c23a);
  border: none;
  padding: 12px 30px;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.el-button--warning {
  background: linear-gradient(135deg, #e6a23c, #f56c6c);
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
  background: linear-gradient(135deg, #909399, #c0c4cc);
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
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 密码强度提示样式 */
.password-strength {
  margin-top: 8px;
  font-size: 12px;
}

.password-strength.weak {
  color: #f56c6c;
}

.password-strength.medium {
  color: #e6a23c;
}

.password-strength.strong {
  color: #67c23a;
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
  border-color: #409eff;
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