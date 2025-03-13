<script setup>
import { ref, onMounted } from 'vue'

// 定义组件名称
defineOptions({
  name: 'EmotionStatisticsPage'
})

// 图表配置（实际使用时会用到）
const chartOptions = ref({
  title: {
    text: '情感分析类型分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '情感类型',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 735, name: '积极' },
        { value: 310, name: '消极' },
        { value: 234, name: '中性' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

// 模拟统计数据
const statisticsData = ref({
  total: 1279,
  positive: 735,
  negative: 310,
  neutral: 234,
  avgScore: 68
})

// 渲染图表的方法
const renderChart = () => {
  console.log('渲染图表', chartOptions.value)
  // 在实际项目中，这里会调用图表库渲染图表
}

// 组件挂载时调用渲染图表方法
onMounted(() => {
  renderChart()
})
</script>

<template>
  <div class="statistics-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="summary-card">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="stat-box">
                <div class="stat-title">总分析数</div>
                <div class="stat-value">{{ statisticsData.total }}</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="stat-box positive">
                <div class="stat-title">积极情感</div>
                <div class="stat-value">{{ statisticsData.positive }}</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="stat-box negative">
                <div class="stat-title">消极情感</div>
                <div class="stat-value">{{ statisticsData.negative }}</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="stat-box neutral">
                <div class="stat-title">中性情感</div>
                <div class="stat-value">{{ statisticsData.neutral }}</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="stat-box">
                <div class="stat-title">平均分数</div>
                <div class="stat-value">{{ statisticsData.avgScore }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>情感分布图</h3>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-message">
              此处将显示情感分析饼图
              <div class="chart-info">(实际项目中使用ECharts等图表库)</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>情感趋势图</h3>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-message">
              此处将显示情感分析趋势图
              <div class="chart-info">(实际项目中使用ECharts等图表库)</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.statistics-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-card {
  margin-bottom: 20px;
}

.stat-box {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-box.positive {
  background-color: #f0f9eb;
  color: #67c23a;
}

.stat-box.negative {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-box.neutral {
  background-color: #f4f4f5;
  color: #909399;
}

.stat-title {
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.chart-message {
  text-align: center;
  color: #909399;
}

.chart-info {
  font-size: 12px;
  margin-top: 8px;
  color: #c0c4cc;
}
</style>
