<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'

defineOptions({
  name: 'MediaVideo'
})

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 视频列表
const videoList = ref([
  {
    id: 1,
    title: '阳光沙滩',
    description: '放松心情的海边风景',
    cover: 'https://img.picui.cn/free/2024/11/10/672fbdd53238b.jpg',
    url: 'http://vjs.zencdn.net/v/oceans.mp4',
    category: 'positive',
  }
])

// 预览对话框
const previewDialogVisible = ref(false)
const previewVideo = ref(null)

// 播放视频
const handlePreview = (video) => {
  previewVideo.value = video
  previewDialogVisible.value = true
}

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  description: '',
  cover: '',
  url: '',
  category: '',
})

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入视频标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 表单引用
const editFormRef = ref(null)

// 打开编辑对话框
const handleEdit = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 保存编辑
const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    // TODO: 调用保存API

    // 更新本地数据
    const index = videoList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      videoList.value[index] = { ...editForm.value }
    } else {
      // 新增
      videoList.value.push({
        ...editForm.value,
        id: Date.now(),
      })
    }

    ElMessage.success('保存成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  }
}

// 删除视频
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除视频 "${row.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API

    // 更新本地数据
    const index = videoList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      videoList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 新增视频
const handleAdd = () => {
  editForm.value = {
    id: '',
    title: '',
    description: '',
    cover: '',
    url: '',
    category: '',
  }
  editDialogVisible.value = true
}
</script>

<template>
  <div class="video-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>视频管理</h3>
          <el-button type="primary" @click="handleAdd">添加视频</el-button>
        </div>
      </template>

      <!-- 视频列表 -->
      <div class="video-grid">
        <el-card v-for="item in videoList" :key="item.id" class="video-card" :body-style="{ padding: '0px' }">
          <div class="video-cover" @click="handlePreview(item)">
            <el-image :src="item.cover" fit="cover" />
            <div class="play-overlay">
              <el-icon :size="32">
                <VideoPlay />
              </el-icon>
            </div>
          </div>

          <div class="video-content">
            <div class="video-title">{{ item.title }}</div>
            <div class="video-description">{{ item.description }}</div>

            <div class="video-meta">
              <el-tag
                :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'"
                size="small">
                {{emotionOptions.find(opt => opt.value === item.category)?.label}}
              </el-tag>
            </div>

            <div class="video-actions">
              <el-button size="small" type="primary" @click="handleEdit(item)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(item)">删除</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewDialogVisible" :title="previewVideo?.title" width="800px" destroy-on-close center>
      <video v-if="previewVideo" :src="previewVideo.url" controls class="preview-video"></video>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑视频' : '添加视频'" v-model="editDialogVisible" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" rows="3" />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <el-upload class="cover-uploader" action="/api/upload" :show-file-list="false" accept="image/*">
            <el-image v-if="editForm.cover" :src="editForm.cover" fit="cover" class="cover-preview" />
            <el-button v-else>上传封面</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="视频文件" prop="url">
          <el-upload class="video-uploader" action="/api/upload" :show-file-list="false" accept="video/*">
            <el-button>{{ editForm.url ? '重新上传' : '上传视频' }}</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="情绪分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择分类">
            <el-option v-for="item in emotionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.video-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.video-card {
  transition: transform 0.3s ease;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-cover {
  position: relative;
  height: 158px;
  cursor: pointer;
}

.video-cover .el-image {
  width: 100%;
  height: 100%;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-cover:hover .play-overlay {
  opacity: 1;
}

.video-content {
  padding: 14px;
}

.video-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-description {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}


.video-actions {
  display: flex;
  gap: 8px;
}

.preview-video {
  width: 100%;
  max-height: 450px;
  background: black;
}

.cover-preview {
  width: 100%;
  height: 150px;
  border-radius: 4px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
