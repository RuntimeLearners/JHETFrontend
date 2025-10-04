<template>
  <div class="service-hall">
    <header class="header">
      <div class="university-info">
        <div class="logo">浙江工业大学</div>
        <div class="title">学生服务平台</div>
      </div>
      <nav class="navigation">
        <a href='#'>用户信息</a> 
      </nav>
    </header>

    <main class="main-content">
      <div class="function-grid">
        <div class="function-item" v-for="item in mainFunctions" :key="item.id">
            <div class="icon">{{ item.icon }}</div>
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
       <div class="function-item" @click="goToFeedback">
          <div class="icon">🔧</div>
          <span class="label">问题反馈</span>
        </div>

   <div class="function-item" @click="goToUserInfo">
  <div class="icon">👤</div>
  <span class="label">用户信息</span>
</div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();

const goToFeedback = () => {
  router.push('/feedback'); 
};

const goToUserInfo = () => {
  router.push('/user');
};

const goToMyFeedback = () => {
  router.push('/feedback?tab=myRepair');  
};
const mainFunctions = ref([
  { id: 1, icon: '🔧', label: '问题反馈' },
  { id: 2, icon: '📋', label: '我的反馈' },
  { id: 3, icon: '👤', label: '用户信息' }
]);

</script>

<style scoped>
.router-link-style {
  text-decoration: none;
  color: inherit; 
  display: block; 
}
.service-hall {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.university-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.title {
  font-size: 18px;
  color: #3498db;
}

.navigation a {
  margin: 0 10px;
  text-decoration: none;
  color: #666;
}

.navigation a:hover {
  color: #3498db;
}

.main-content {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.function-item {
  background: white;
  padding: 30px 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.function-item:hover {
  transform: translateY(-5px);
}

.function-item .icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.function-item .label {
  font-size: 14px;
  color: #333;
}

.service-list {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.service-list h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.service-list ul {
  list-style: none;
  padding: 0;
}

.service-list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.service-list a {
  text-decoration: none;
  color: #666;
  transition: color 0.3s ease;
}

.service-list a:hover {
  color: #3498db;
}
</style>