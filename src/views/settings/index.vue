<script setup>
import { ref, reactive } from 'vue'

// 定义组件名称
defineOptions({
  name: 'SettingsIndex'
})

const activeTab = ref('server')

// 服务器运行详情
const serverStatus = reactive({
  uptime: '30 天 4 小时 12 分钟',
  cpuUsage: 45.2,
  memoryTotal: 16384,
  memoryUsed: 8192,
  diskTotal: 512000,
  diskUsed: 256000,
  osInfo: 'Linux ubuntu 5.15.0',
  nodeVersion: 'v18.16.0',
  npmVersion: '9.5.1',
  databaseVersion: 'MySQL 8.0.28',
  avgResponseTime: 235,
  peakResponseTime: 1250,
  onlineUsers: 128,
  taskCount: 56
})

// 格式化内存大小
const formatMemory = (mb) => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

// 格式化磁盘大小
const formatDisk = (mb) => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

// API设置表单
const apiForm = reactive({
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  enableCache: true,
  cacheTime: 24
})

// API模型选项
const modelOptions = [
  { label: 'Deepseek Chat', value: 'deepseek-chat' },
  { label: 'Deepseek Coder', value: 'deepseek-coder' },
  { label: 'Deepseek Code', value: 'deepseek-code' }
]

// 保存API设置
const submitApi = () => {
  // TODO: 调用保存API
  console.log('保存API设置', apiForm)
}
</script>

<template>
  <div class="settings-container">
    <el-card>
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 服务器运行详情 -->
        <el-tab-pane label="服务器状态" name="server">
          <div class="server-status">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="status-card" shadow="never">
                  <template #header>
                    <div class="card-header">
                      <span>系统资源</span>
                    </div>
                  </template>
                  <div class="status-item">
                    <span class="label">运行时间：</span>
                    <span class="value">{{ serverStatus.uptime }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">CPU使用率：</span>
                    <el-progress :percentage="serverStatus.cpuUsage"
                      :color="serverStatus.cpuUsage > 80 ? '#F56C6C' : '#67C23A'" />
                  </div>
                  <div class="status-item">
                    <span class="label">内存使用：</span>
                    <el-progress :percentage="(serverStatus.memoryUsed / serverStatus.memoryTotal * 100).toFixed(1)"
                      :format="() => `${formatMemory(serverStatus.memoryUsed)} / ${formatMemory(serverStatus.memoryTotal)}`" />
                  </div>
                  <div class="status-item">
                    <span class="label">磁盘使用：</span>
                    <el-progress :percentage="(serverStatus.diskUsed / serverStatus.diskTotal * 100).toFixed(1)"
                      :format="() => `${formatDisk(serverStatus.diskUsed)} / ${formatDisk(serverStatus.diskTotal)}`" />
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="status-card" shadow="never">
                  <template #header>
                    <div class="card-header">
                      <span>系统信息</span>
                    </div>
                  </template>
                  <div class="status-item">
                    <span class="label">操作系统：</span>
                    <span class="value">{{ serverStatus.osInfo }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">Node版本：</span>
                    <span class="value">{{ serverStatus.nodeVersion }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">NPM版本：</span>
                    <span class="value">{{ serverStatus.npmVersion }}</span>
                  </div>
                  <div class="status-item">
                    <span class="label">数据库：</span>
                    <span class="value">{{ serverStatus.databaseVersion }}</span>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- API设置 -->
        <el-tab-pane label="Deepseek API" name="api">
          <el-form :model="apiForm" label-width="120px" class="settings-form">
            <el-form-item label="API密钥" required>
              <el-input v-model="apiForm.apiKey" show-password placeholder="请输入Deepseek API密钥" />
            </el-form-item>

            <el-form-item label="接口地址">
              <el-input v-model="apiForm.baseUrl" placeholder="默认为官方接口地址" />
            </el-form-item>

            <el-form-item label="默认模型">
              <el-select v-model="apiForm.model" placeholder="请选择默认模型">
                <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="温度">
              <el-slider v-model="apiForm.temperature" :min="0" :max="2" :step="0.1" show-input />
              <div class="param-desc">较高的值会使输出更加随机，较低的值会使输出更加集中和确定</div>
            </el-form-item>

            <el-form-item label="最大Token">
              <el-input-number v-model="apiForm.maxTokens" :min="100" :max="8000" :step="100" />
              <div class="param-desc">生成文本的最大长度限制</div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitApi">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 20px;
}

.settings-form {
  max-width: 600px;
  margin: 20px;
}

.server-status {
  padding: 20px;
}

.status-card {
  margin-bottom: 20px;
}

.status-item {
  margin-bottom: 20px;
}

.status-item .label {
  display: inline-block;
  width: 100px;
  color: #606266;
}

.status-item .value {
  color: #303133;
  font-weight: 500;
}

.status-item .error {
  color: #F56C6C;
}

.param-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.unit {
  margin-left: 10px;
  color: #909399;
}

:deep(.el-progress-bar__inner) {
  transition: width 0.6s ease;
}
</style>
