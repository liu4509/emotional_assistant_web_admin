<script setup>
import { ref, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

// 定义组件名称
defineOptions({
  name: 'DashboardIndex'
})

const { userInfo } = useUser()
const currentTime = ref('')
const greeting = ref('')

// 更新时间和问候语
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours()
  currentTime.value = now.toLocaleTimeString()

  if (hours >= 5 && hours < 12) {
    greeting.value = '早安'
  } else if (hours >= 12 && hours < 18) {
    greeting.value = '午安'
  } else {
    greeting.value = '晚安'
  }
}

// 心情卡片数据
const moodCards = ref([
  {
    title: '阳光明媚',
    desc: '今天是个好天气，适合出去走走',
    icon: '🌞',
    color: '#FFB549'
  },
  {
    title: '温暖舒适',
    desc: '一切都刚刚好的感觉',
    icon: '🌸',
    color: '#FF7F7F'
  },
  {
    title: '平静安宁',
    desc: '享受当下的宁静时光',
    icon: '🍃',
    color: '#95D5B2'
  },
  {
    title: '充满希望',
    desc: '期待美好的事情发生',
    icon: '⭐',
    color: '#7DB9DE'
  }
])

// 治愈文案
const healingQuotes = ref([
  "生活总有不如意，但请相信每个明天都是崭新的开始",
  "你的心情就像天气，阴天过后总会放晴",
  "慢慢来，每一步都算数",
  "保持希望，保持微笑，保持前进"
])

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="greeting-card">
        <div class="time">{{ currentTime }}</div>
        <h1 class="greeting">{{ greeting }}，{{ userInfo?.name || '访客' }}</h1>
        <p class="subtitle">今天也要保持好心情呢 ✨</p>
      </div>
    </div>

    <!-- 心情卡片区 -->
    <div class="mood-section">
      <div class="section-title">心情小站</div>
      <div class="card-grid">
        <div v-for="(card, index) in moodCards" :key="index" class="mood-card"
          :style="{ '--delay': `${index * 0.1}s`, '--color': card.color }">
          <div class="card-icon">{{ card.icon }}</div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>

    <!-- 治愈语录 -->
    <div class="quotes-section">
      <div class="section-title">治愈时刻</div>
      <div class="quotes-container">
        <div v-for="(quote, index) in healingQuotes" :key="index" class="quote-card"
          :style="{ '--delay': `${index * 0.2}s` }">
          {{ quote }}
        </div>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="decoration">
      <div class="floating-bubble" v-for="n in 6" :key="n"></div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  position: relative;
  overflow: hidden;
}

/* 欢迎区域样式 */
.welcome-section {
  margin-bottom: 40px;
}

.greeting-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  text-align: center;
  animation: slideDown 0.6s ease-out;
}

.time {
  font-size: 3rem;
  font-weight: 300;
  color: #666;
  margin-bottom: 10px;
  font-family: 'Monaco', monospace;
}

.greeting {
  font-size: 2rem;
  color: #333;
  margin: 10px 0;
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
}

/* 心情卡片区样式 */
.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.mood-card {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.mood-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.mood-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.mood-card p {
  color: #666;
  font-size: 0.9rem;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%),
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.mood-card:hover .card-glow {
  opacity: 1;
}

/* 治愈语录样式 */
.quotes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.quote-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
  color: #555;
  text-align: center;
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

/* 装饰元素样式 */
.floating-bubble {
  position: absolute;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
  border-radius: 50%;
  pointer-events: none;
  animation: float 20s infinite ease-in-out;
}

.floating-bubble:nth-child(1) {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.floating-bubble:nth-child(2) {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 20%;
  animation-delay: -5s;
}

.floating-bubble:nth-child(3) {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 30%;
  animation-delay: -10s;
}

.floating-bubble:nth-child(4) {
  width: 120px;
  height: 120px;
  bottom: 10%;
  right: 10%;
  animation-delay: -15s;
}

.floating-bubble:nth-child(5) {
  width: 70px;
  height: 70px;
  top: 50%;
  left: 50%;
  animation-delay: -7s;
}

.floating-bubble:nth-child(6) {
  width: 90px;
  height: 90px;
  bottom: 40%;
  right: 40%;
  animation-delay: -12s;
}

/* 动画关键帧 */
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(-20px, 20px);
  }

  50% {
    transform: translate(20px, -20px);
  }

  75% {
    transform: translate(20px, 20px);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .time {
    font-size: 2rem;
  }

  .greeting {
    font-size: 1.5rem;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
// 鼠标移动时更新卡片光效位置
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.mood-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / card.offsetWidth) * 100
    const y = ((e.clientY - rect.top) / card.offsetHeight) * 100
    card.style.setProperty('--x', `${x}%`)
    card.style.setProperty('--y', `${y}%`)
  })
})
</script>
