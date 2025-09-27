<template>
  <div class="information-page">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>用户信息</h1>
    </div>
    <div class="user-form">
      <form @submit.prevent="submitUserInfo">
        <div class="form-group">
          <label for="name">姓名：</label>
          <input 
            type="text" 
            id="name" 
            v-model="userInfo.name" 
            placeholder="请输入您的姓名"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="email">邮箱：</label>
          <input 
            type="email" 
            id="email" 
            v-model="userInfo.email" 
            placeholder="example@email.com"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="phone">电话：</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="userInfo.phone" 
            placeholder="请输入联系电话"
          >
        </div>
        
        <div class="form-group">
          <label for="studentId">学号：</label>
          <input 
            type="text" 
            id="studentId" 
            v-model="userInfo.studentId" 
            placeholder="请输入学号"
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">保存信息</button>
          <button type="button" class="cancel-btn" @click="goBack">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userInfo = ref({
  name: '',
  email: '',
  phone: '',
  studentId: ''
});

const goBack = () => {
  router.push('/firstpage');
};


onMounted(() => {
  const savedInfo = localStorage.getItem('userInfo');
  if (savedInfo) {
    try {
      const parsedInfo = JSON.parse(savedInfo);
      userInfo.value = { ...userInfo.value, ...parsedInfo };
      console.log('加载已保存的用户信息:', userInfo.value);
    } catch (error) {
      console.error('读取保存的数据失败：', error);
    }
  }
});


const submitUserInfo = () => {

  if (!userInfo.value.name.trim()) {
    alert('请输入姓名！');
    return;
  }
  
  if (!userInfo.value.email.trim()) {
    alert('请输入邮箱！');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userInfo.value.email)) {
    alert('请输入有效的邮箱地址！');
    return;
  }
  try {
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    alert('信息保存成功！');
    console.log('保存的用户信息：', userInfo.value);
    
  } catch (error) {
    console.error('保存失败：', error);
    alert('保存失败，请重试！');
  }
};
</script>

<style scoped>
.information-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
}

.user-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group input:required {
  border-left: 3px solid #3498db;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .information-page {
    padding: 15px;
  }
  
  .user-form {
    padding: 20px;
  }
  
  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>