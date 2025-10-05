<template>
  <div class="service-hall">
    <header class="header">
      <div class="university-info">
        <div class="logo">浙江工业大学</div>
        <div class="title">学生服务平台</div>
      </div>
      <nav class="navigation">
        <a href=#>用户信息</a> |  
      </nav>
    </header>

    <main class="main-content">
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
import { useRouter } from 'vue-router'
const router = useRouter();
const goToFeedback = () => {
  router.push('/feedback'); 
};
const goToUserInfo = () => {
  router.push('/user');
};
</script>

<style scoped>
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 20px; 
  margin-top: -120px;
}
.function-container {
  display: flex;
  justify-content: center;
  gap: 150px; 
  width: 100%;
  max-width: 1000px;
}
.function-item {
  background: white;
  padding: 50px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  min-width: 500px;
  width: 100%;
  max-width: 00px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.function-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.2);
}
.function-item .icon {
  font-size: 4em;
  margin-bottom: 20px;
}
.function-item .label {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
}
@media (max-width: 768px) {
  .function-container {
    flex-direction: column;
    gap: 60px; 
  }
  .function-item {
    min-width: 250px;
    max-width: 300px;
    padding: 40px 30px;
  }
  
  .function-item .icon {
    font-size: 3em;
  }
  
  .function-item .label {
    font-size: 18px;
  }
}
@media (max-width: 480px) {
  .function-item {
    min-width: 200px;
    max-width: 100%;
    padding: 30px 20px;
  }
  .function-container {
    gap: 40px;
  }
}
</style>