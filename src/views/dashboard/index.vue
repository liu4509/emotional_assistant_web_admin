<script setup>
import { ref } from 'vue'

// 定义组件名称
defineOptions({
  name: 'DashboardIndex',
})

const greeting = ref('欢迎使用情感助手管理系统')
</script>

<template>
  <div class="dashboard-container">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <h3>系统概览</h3>
        </div>
      </template>
      <div class="card-content">
        <h2>{{ greeting }}</h2>
        <p>这是情感助手管理系统的仪表盘页面。</p>
      </div>
    </el-card>

    <div class="dashboard-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#409EFF">
                <User />
              </el-icon>
              <div class="stat-info">
                <div class="stat-count">256</div>
                <div class="stat-title">用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#67C23A">
                <ChatDotRound />
              </el-icon>
              <div class="stat-info">
                <div class="stat-count">1,286</div>
                <div class="stat-title">分析次数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#E6A23C">
                <Calendar />
              </el-icon>
              <div class="stat-info">
                <div class="stat-count">86</div>
                <div class="stat-title">今日活跃</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#F56C6C">
                <DataAnalysis />
              </el-icon>
              <div class="stat-info">
                <div class="stat-count">92%</div>
                <div class="stat-title">系统稳定性</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 20px;
}

.dashboard-stats {
  margin-top: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  font-size: 48px;
  margin-right: 15px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-count {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}
</style>
