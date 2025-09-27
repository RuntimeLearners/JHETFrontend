<template>
  <div class="feedback-page">
    <header class="feedback-header">
      <h1>学生服务平台 - 问题反馈</h1>
      <nav class="feedback-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-button', { 'active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </nav>
    </header>
    <main class="feedback-main">
      <div v-if="activeTab === 'square'" class="repair-list">
        <h3>报修广场</h3>
        <div v-for="item in repairList" :key="item.id" class="repair-item">
          <div class="repair-meta">
            <span class="time">[{{ item.time }}] {{ item.id }}</span>
            <span class="user">{{ item.user }}</span>
            <span class="status" :class="item.status">{{ item.statusText }}</span>
          </div>
          <div class="repair-content">
            <p class="location">{{ item.location }}</p>
            <p class="description">{{ item.description }}</p>
          </div>
          <button class="detail-btn" @click="viewDetail(item)">查看详情 ></button>
        </div>
      </div>
      <div v-if="activeTab === 'report'" class="report-form">
        <h3>我要报修</h3>
        <form @submit.prevent="submitRepair">
          <div class="form-group">
            <label for="location">报修地点：</label>
            <input type="text" id="location" v-model="formData.location" required>
          </div>
          <div class="form-group">
            <label for="description">问题描述：</label>
            <textarea id="description" v-model="formData.description" required></textarea>
          </div>
          <button type="submit" class="submit-btn">提交报修</button>
        </form>
      </div>

      <div v-if="activeTab === 'myRepair'">
        <h3>我的报修</h3>
        <p>这里显示用户自己提交的报修单列表。</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 当前激活的Tab
const activeTab = ref('square');

// 导航Tabs数据
const tabs = ref([
  { id: 'square', name: '报修广场' },
  { id: 'myRepair', name: '我的报修' },
  { id: 'report', name: '我要报修' },
  { id: 'myWorkOrder', name: '我的工单' }
]);

// 报修列表数据（模仿右图）
const repairList = ref([
  {
    id: '2509007350',
    time: '09-27',
    user: '程**',
    status: 'completed',
    statusText: '已完工',
    location: '莫干山校区-教学楼及公共区域-食...',
    description: '下水道堵了，第二排实验台'
  },
  {
    id: '2509007349',
    time: '09-27',
    user: '陈**',
    status: 'dispatched',
    statusText: '已派工',
    location: '莫干山校区-学生公寓-德馨苑8号楼...',
    description: '厕所排气系统坏了，厕所有点反味'
  }
]);

const formData = reactive({
  location: '',
  description: ''
});

// 查看详情的方法
const viewDetail = (item) => {
  alert(`查看报修单 ${item.id} 的详情`);
  // 实际开发中，这里会用路由跳转到详情页
};

// 提交报修的方法
const submitRepair = () => {
  alert(`报修提交成功！地点：${formData.location}，问题：${formData.description}`);
  // 实际开发中，这里会调用API，将数据发送到后端服务器
  // 重置表单
  formData.location = '';
  formData.description = '';
};
</script>

<style scoped>
.feedback-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.feedback-header {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.feedback-nav {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.nav-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}
.nav-button.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}
.repair-list {
  background: white;
  padding: 15px;
  border-radius: 8px;
}
.repair-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.repair-meta {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
}
.status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8em;
}
.status.completed {
  background-color: #e8f5e8;
  color: #2ecc71;
}
.status.dispatched {
  background-color: #fff3cd;
  color: #f39c12;
}
.detail-btn {
  color: #3498db;
  background: none;
  border: none;
  cursor: pointer;
}
.report-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.submit-btn {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>