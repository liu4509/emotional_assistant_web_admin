<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, Edit, Delete } from '@element-plus/icons-vue'
import { getVideoList, createVideo, updateVideo, deleteVideo } from '@/api/video'
import { uploadImageUtil } from '@/utils/utils'

defineOptions({
  name: 'MediaVideo'
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
    if (res.code === 200) {
      videoList.value = res.data.map(item => ({
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
  url: [{ required: true, message: '请输入视频链接', trigger: 'blur' }],
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
    const url = await uploadImageUtil(event)
    if (url) {
      editForm.value.cover = url
    }
  } catch (error) {
    console.error('封面上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}

// 保存编辑
const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    const videoData = {
      title: editForm.value.title,
      description: editForm.value.description,
      cover: editForm.value.cover,
      url: editForm.value.url,
      categoryValues: [editForm.value.category]
    }

    let res
    if (editForm.value.id) {
      // 更新视频
      res = await updateVideo(editForm.value.id, videoData)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        await fetchVideoList() // 重新获取列表
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建视频
      res = await createVideo(videoData)
      if (res.code === 201) {
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
    if (res.code === 200) {
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
            <div class="video-description">{{ item.description }}</div>

            <div class="video-meta">
              <el-tag
                :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'"
                size="small">
                {{emotionOptions.find(opt => opt.value === item.category)?.label}}
              </el-tag>
              <span class="video-time">{{ new Date(item.createTime).toLocaleString() }}</span>
            </div>

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
    <el-dialog v-model="previewDialogVisible" :title="previewVideo?.title" width="800px" destroy-on-close center>
      <video v-if="previewVideo" :src="previewVideo.url" controls class="preview-video"></video>
      <div class="video-info">
        <el-tag
          :type="previewVideo?.category === 'positive' ? 'success' : previewVideo?.category === 'negative' ? 'danger' : 'info'">
          {{emotionOptions.find(opt => opt.value === previewVideo?.category)?.label}}
        </el-tag>
        <div class="video-description">{{ previewVideo?.description }}</div>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑视频' : '添加视频'" v-model="editDialogVisible" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" rows="3" />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <div class="avatar-container">
            <el-avatar :size="150" v-if="editForm.cover" :src="editForm.cover" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleCoverChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                上传图片
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="视频链接" prop="url">
          <el-input v-model="editForm.url" placeholder="例如: https://example.com/video.mp4" />
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

.video-time {
  color: #909399;
  font-size: 12px;
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
</style>
