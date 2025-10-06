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
         <div class="filter-section">
    <el-select v-model="filters.urgency" placeholder="紧急程度">
      <el-option label="紧急" value="urgent" />
      <el-option label="一般" value="normal" />
      <el-option label="低优先级" value="low" />
    </el-select>
    
    <el-select v-model="filters.status" placeholder="完结状态">
      <el-option label="未处理" value="pending" />
      <el-option label="处理中" value="processing" />
      <el-option label="已完成" value="completed" />
    </el-select>
    
    <el-button @click="applyFilters">筛选</el-button>
  </div>
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
          <button class="detail-btn" @click="viewDetail(item)">查看详情 &gt;</button>
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

      <div v-if="activeTab === 'myRepair'" class="my-repair">
        <h3>我的报修</h3>
        <p>这里显示用户自己提交的报修单列表。</p>
      </div>
    </main>
  </div>
 
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
interface TabItem {
  id: string
  name: string
}

interface RepairItem {
  id: string
  time: string
  user: string
  status: string
  statusText: string
  location: string
  description: string
}

interface FormData {
  location: string
  description: string
}

const activeTab = ref<string>('square')

const tabs = ref<TabItem[]>([
  { id: 'square', name: '报修广场' },
  { id: 'myRepair', name: '我的报修' },
  { id: 'report', name: '我要报修' }
])

const repairList = ref<RepairItem[]>([
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
])

const formData = reactive<FormData>({
  location: '',
  description: ''
})

const viewDetail = (item: RepairItem): void => {
  alert(`查看报修单 ${item.id} 的详情`)
}

const submitRepair = (): void => {
  if (!formData.location.trim() || !formData.description.trim()) {
    alert('请填写完整的报修信息！')
    return
  }
  
  alert(`报修提交成功！地点：${formData.location}，问题：${formData.description}`)
  formData.location = ''
  formData.description = ''
}
const filters = reactive({
  urgency: '',
  status: ''
});

const applyFilters = () => {
  
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
  transition: all 0.3s ease;
}

.nav-button.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.nav-button:hover {
  background-color: #f0f0f0;
}

.repair-list {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.repair-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.repair-item:last-child {
  border-bottom: none;
}

.repair-meta {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
  flex-wrap: wrap;
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
  padding: 5px 0;
}

.detail-btn:hover {
  text-decoration: underline;
}

.report-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.my-repair {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

</style>