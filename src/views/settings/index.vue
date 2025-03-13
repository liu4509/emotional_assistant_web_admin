<script setup>
import { ref, reactive } from 'vue'

// 定义组件名称
defineOptions({
  name: 'SettingsIndex'
})

const activeTab = ref('system')

const systemForm = reactive({
  siteName: '情感助手管理系统',
  siteDesc: '基于AI的情感分析管理平台',
  recordNumber: '京ICP备12345678号',
  enableRegister: true,
  enableCaptcha: true,
  maxUploadSize: 10
})

const submitSystem = () => {
  // 模拟提交
  console.log('保存系统设置', systemForm)
}

const apiForm = reactive({
  apiUrl: 'https://api.example.com',
  apiKey: 'sk-********************',
  timeout: 30,
  retryCount: 3,
  enableCache: true,
  cacheTime: 24
})

const submitApi = () => {
  // 模拟提交
  console.log('保存API设置', apiForm)
}
</script>

<template>
  <div class="settings-container">
    <el-card>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="系统设置" name="system">
          <el-form :model="systemForm" label-width="120px" class="settings-form">
            <el-form-item label="系统名称">
              <el-input v-model="systemForm.siteName" />
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input v-model="systemForm.siteDesc" type="textarea" />
            </el-form-item>
            <el-form-item label="备案号">
              <el-input v-model="systemForm.recordNumber" />
            </el-form-item>
            <el-form-item label="开放注册">
              <el-switch v-model="systemForm.enableRegister" />
            </el-form-item>
            <el-form-item label="启用验证码">
              <el-switch v-model="systemForm.enableCaptcha" />
            </el-form-item>
            <el-form-item label="最大上传大小">
              <el-input-number v-model="systemForm.maxUploadSize" :min="1" :max="50" />
              <span class="unit">MB</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSystem">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="API设置" name="api">
          <el-form :model="apiForm" label-width="120px" class="settings-form">
            <el-form-item label="API地址">
              <el-input v-model="apiForm.apiUrl" />
            </el-form-item>
            <el-form-item label="API密钥">
              <el-input v-model="apiForm.apiKey" show-password />
            </el-form-item>
            <el-form-item label="超时时间">
              <el-input-number v-model="apiForm.timeout" :min="5" :max="120" />
              <span class="unit">秒</span>
            </el-form-item>
            <el-form-item label="重试次数">
              <el-input-number v-model="apiForm.retryCount" :min="0" :max="5" />
              <span class="unit">次</span>
            </el-form-item>
            <el-form-item label="启用缓存">
              <el-switch v-model="apiForm.enableCache" />
            </el-form-item>
            <el-form-item label="缓存时间" v-if="apiForm.enableCache">
              <el-input-number v-model="apiForm.cacheTime" :min="1" :max="72" />
              <span class="unit">小时</span>
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

.unit {
  margin-left: 10px;
  color: #909399;
}
</style>
