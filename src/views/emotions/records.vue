<script setup>
import { ref } from 'vue'

// 定义组件名称
defineOptions({
  name: 'EmotionRecordsPage'
})

const emotionRecords = ref([
  { id: 1, userId: 'U001', content: '今天心情很好！', emotion: '积极', score: 85, date: '2023-05-10 10:23:45' },
  { id: 2, userId: 'U002', content: '这个产品太差了，不推荐购买。', emotion: '消极', score: 25, date: '2023-05-11 14:15:28' },
  { id: 3, userId: 'U003', content: '服务态度一般，但是产品质量不错。', emotion: '中性', score: 60, date: '2023-05-12 09:45:13' }
])
</script>

<template>
  <div class="emotion-records-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>情感分析记录</h3>
          <el-button type="primary" size="small">导出数据</el-button>
        </div>
      </template>

      <el-table :data="emotionRecords" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="120" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="emotion" label="情感类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.emotion === '积极' ? 'success' :
                scope.row.emotion === '消极' ? 'danger' : 'info'
              ">
              {{ scope.row.emotion }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="情感分数" width="100" />
        <el-table-column prop="date" label="分析时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button size="small" type="primary">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.emotion-records-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
