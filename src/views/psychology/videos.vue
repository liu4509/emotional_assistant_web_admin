<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, Edit, Delete } from '@element-plus/icons-vue'
import { getVideoList, createVideo, updateVideo, deleteVideo } from '@/api/video'
import { uploadImageUtil, uploadVideoUtil } from '@/utils/utils'

defineOptions({
  name: 'PsychologyVideos'
})

// 加载状态
const loading = ref(false)

// 当前选中的分类
const currentCategory = ref('')

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 视频列表
const videoList = ref([])

// 过滤后的视频列表
const filteredVideoList = computed(() => {
  if (!currentCategory.value) return videoList.value
  return videoList.value.filter(item => item.category === currentCategory.value)
})

// 获取视频列表
const fetchVideoList = async () => {
  try {
    loading.value = true
    const res = await getVideoList()
    if (res.code === 201 || res.code === 200) {
      videoList.value = res.data.article.map(item => ({
        ...item,
        category: item.categorys[0]?.value || 'neutral'
      }))
    } else {
      ElMessage.error(res.message || '获取视频列表失败')
    }
  } catch (error) {
    console.error('获取视频列表失败:', error)
    ElMessage.error('获取视频列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取视频列表
onMounted(() => {
  fetchVideoList()
})

// 预览对话框
const previewDialogVisible = ref(false)
const currentVideo = ref(null)

// 播放视频
const handlePreview = (video) => {
  currentVideo.value = video
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
  duration: 0
})

// 上传中状态
const uploading = ref(false)

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入视频标题', trigger: 'blur' }],
  url: [{ required: true, message: '请上传视频文件', trigger: 'change' }],
  cover: [{ required: true, message: '请上传视频封面', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 表单引用
const editFormRef = ref(null)

// 打开编辑对话框
const handleEdit = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 处理图片上传
const handleCoverChange = async (event) => {
  try {
    uploading.value = true
    const url = await uploadImageUtil(event)
    if (url) {
      editForm.value.cover = url
      ElMessage.success('封面上传成功')
    }
  } catch (error) {
    console.error('封面上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

// 处理视频文件上传
const handleVideoChange = async (event) => {
  try {
    uploading.value = true
    const url = await uploadVideoUtil(event)
    if (url) {
      editForm.value.url = url

      // 创建临时视频元素获取时长
      const video = document.createElement('video')
      video.src = url
      video.addEventListener('loadedmetadata', () => {
        if (video.duration && !isNaN(video.duration)) {
          editForm.value.duration = Math.round(video.duration)
          ElMessage.success('视频时长已更新: ' + Math.round(video.duration) + '秒')
        }
      })
      video.addEventListener('error', () => {
        // 如果无法加载，设置默认时长
        ElMessage.warning('无法获取视频时长')
      })

      ElMessage.success('视频文件上传成功')
    }
  } catch (error) {
    console.error('视频文件上传失败:', error)
    ElMessage.error('视频文件上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

// 保存编辑
const handleSave = async () => {
  if (!editFormRef.value) return
  if (uploading.value) {
    ElMessage.warning('正在上传文件，请稍候...')
    return
  }

  try {
    await editFormRef.value.validate()

    uploading.value = true

    const videoData = {
      title: editForm.value.title,
      description: editForm.value.description,
      cover: editForm.value.cover,
      url: editForm.value.url,
      duration: editForm.value.duration || 0,
      categoryValues: [editForm.value.category]
    }

    let res
    if (editForm.value.id) {
      // 更新视频
      res = await updateVideo(editForm.value.id, videoData)
      if (res.code === 201 || res.code === 200) {
        ElMessage.success('更新成功')
        await fetchVideoList() // 重新获取列表
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建视频
      res = await createVideo(videoData)
      if (res.code === 201 || res.code === 200) {
        ElMessage.success('创建成功')
        await fetchVideoList() // 重新获取列表
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }

    editDialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    uploading.value = false
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

    const res = await deleteVideo(row.id)
    if (res.code === 201 || res.code === 200) {
      ElMessage.success('删除成功')
      await fetchVideoList() // 重新获取列表
    } else {
      ElMessage.error(res.message || '删除失败')
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
    duration: 0
  }
  editDialogVisible.value = true
}
</script>

<template>
  <div class="video-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>心理视频管理</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <VideoPlay />
            </el-icon>
            添加视频
          </el-button>
        </div>
      </template>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <el-radio-group v-model="currentCategory" size="large">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="option in emotionOptions" :key="option.value" :label="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 视频列表 -->
      <div v-loading="loading" class="video-grid">
        <el-card v-for="item in filteredVideoList" :key="item.id" class="video-card" :body-style="{ padding: '0px' }">
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
            <div class="video-meta">
              <el-tag :type="item.category === 'positive' || item.category === 'very_positive' ? 'success' :
                item.category === 'negative' || item.category === 'very_negative' ? 'danger' : 'info'" size="small">
                {{emotionOptions.find(opt => opt.value === item.category)?.label}}
              </el-tag>
              <span class="video-time">{{ new Date(item.createTime).toLocaleString() }}</span>
            </div>
            <div class="video-description">{{ item.description }}</div>

            <div class="video-actions">
              <el-button size="small" type="primary" @click.stop="handleEdit(item)">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click.stop="handleDelete(item)">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewDialogVisible" :title="currentVideo?.title" width="800px" destroy-on-close center>
      <video v-if="currentVideo" :src="currentVideo.url" controls class="preview-video"></video>
      <div class="video-info">
        <el-tag :type="currentVideo?.category === 'positive' || currentVideo?.category === 'very_positive' ? 'success' :
          currentVideo?.category === 'negative' || currentVideo?.category === 'very_negative' ? 'danger' : 'info'">
          {{emotionOptions.find(opt => opt.value === currentVideo?.category)?.label}}
        </el-tag>
        <div class="video-description">{{ currentVideo?.description }}</div>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑视频' : '添加视频'" v-model="editDialogVisible" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="简要描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <div class="avatar-container">
            <el-avatar :size="150" v-if="editForm.cover" :src="editForm.cover" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleCoverChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()" :loading="uploading">
                {{ editForm.cover ? '更换封面' : '上传封面' }}
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="视频文件" prop="url">
          <div class="avatar-container">
            <div v-if="editForm.url" class="video-file-info">
              <el-icon>
                <VideoPlay />
              </el-icon>
              <span>已上传视频文件{{ editForm.duration ? ' (' + editForm.duration + '秒)' : '' }}</span>
            </div>
            <div class="avatar-upload">
              <input type="file" ref="videoInput" accept="video/*" style="display: none" @change="handleVideoChange" />
              <el-button size="small" type="primary" @click="$refs.videoInput.click()" :loading="uploading">
                {{ editForm.url ? '更换视频' : '上传视频' }}
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="情绪分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择分类">
            <el-option v-for="item in emotionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false" :disabled="uploading">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="uploading">确定</el-button>
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

.category-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 10px;
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
  margin-bottom: 10px;
}

.video-time {
  color: #909399;
  font-size: 12px;
}

.video-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-actions {
  display: flex;
  gap: 8px;
}

.preview-video {
  width: 100%;
  max-height: 450px;
  background: black;
  margin-bottom: 20px;
}

.video-info {
  margin-top: 20px;
}

.video-info .video-description {
  margin-top: 10px;
  color: #666;
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

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-upload {
  margin-top: 8px;
}

.video-file-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #606266;
}
</style>
