<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { formatDuration, uploadAudioUtil, uploadImageUtil } from '@/utils/utils'
import { getMediaList, createMedia, updateMedia, deleteMedia } from '@/api/media'

defineOptions({
  name: 'MediaMusic'
})

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 加载状态
const loading = ref(false)

// 当前选中的分类
const currentCategory = ref('')

// 音乐列表
const musicList = ref([])

// 过滤后的音乐列表
const filteredMusicList = computed(() => {
  if (!currentCategory.value) return musicList.value
  return musicList.value.filter(item => item.category === currentCategory.value)
})

// 获取音乐列表
const fetchMusicList = async () => {
  try {
    loading.value = true
    const res = await getMediaList()
    if (res.code === 201 || res.code === 200) {
      musicList.value = res.data.article.map(item => ({
        ...item,
        category: item.categorys[0]?.value || 'neutral'
      }))
    } else {
      ElMessage.error(res.message || '获取音乐列表失败')
    }
  } catch (error) {
    console.error('获取音乐列表失败:', error)
    ElMessage.error('获取音乐列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取音乐列表
onMounted(() => {
  fetchMusicList()
})

// 当前播放的音乐
const currentMusic = ref(null)
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)

// 计算当前播放进度
const progress = computed(() => {
  if (!currentMusic.value) return 0
  return (currentTime.value / currentMusic.value.duration) * 100
})

// 计算剩余时间
const remainingTime = computed(() => {
  if (!currentMusic.value) return 0
  return Math.max(0, currentMusic.value.duration - currentTime.value)
})

// 格式化剩余时间
const formatRemainingTime = computed(() => {
  return formatDuration(remainingTime.value)
})

// 播放音乐
const playMusic = (music) => {
  if (currentMusic.value?.id === music.id) {
    // 切换播放/暂停
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  } else {
    // 播放新的音乐
    currentMusic.value = music
    audioRef.value.src = music.url
    audioRef.value.play()
    isPlaying.value = true
  }
}

// 音频时间更新事件
const handleTimeUpdate = () => {
  currentTime.value = audioRef.value.currentTime
}

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  artist: '',
  cover: '',
  url: '',
  category: '',
  description: '',
  duration: 0
})

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入音乐标题', trigger: 'blur' }],
  artist: [{ required: true, message: '请输入歌手', trigger: 'blur' }],
  cover: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
  url: [{ required: true, message: '请上传音乐文件', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 表单引用
const editFormRef = ref(null)

// 打开编辑对话框
const handleEdit = (row) => {
  editForm.value = {
    id: row.id,
    title: row.title,
    artist: row.artist,
    cover: row.cover,
    url: row.url,
    category: row.category,
    description: row.description,
    duration: row.duration
  }
  editDialogVisible.value = true
}

// 保存编辑
const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    const formData = {
      title: editForm.value.title,
      artist: editForm.value.artist,
      cover: editForm.value.cover,
      url: editForm.value.url,
      duration: editForm.value.duration,
      description: editForm.value.description,
      categoryValues: [editForm.value.category]
    }

    let res

    if (editForm.value.id) {
      // 更新
      res = await updateMedia(editForm.value.id, formData)
      if (res.code === 201 || res.code === 200) {
        ElMessage.success('更新成功')
        await fetchMusicList() // 重新获取列表
        editDialogVisible.value = false
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 新增
      res = await createMedia(formData)
      if (res.code === 201 || res.code === 200) {
        ElMessage.success('添加成功')
        await fetchMusicList() // 重新获取列表
        editDialogVisible.value = false
      } else {
        ElMessage.error(res.message || '添加失败')
      }
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请检查表单填写是否正确')
  }
}

// 删除音乐
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除音乐 "${row.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteMedia(row.id)
    if (res.code === 201 || res.code === 200) {
      ElMessage.success('删除成功')
      await fetchMusicList() // 重新获取列表
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

// 新增音乐
const handleAdd = () => {
  editForm.value = {
    id: '',
    title: '',
    artist: '',
    cover: '',
    url: '',
    category: '',
    description: '',
    duration: 0
  }
  editDialogVisible.value = true
}

// 处理封面上传
const handleCoverChange = async (event) => {
  try {
    const url = await uploadImageUtil(event)
    if (url) {
      editForm.value.cover = url
      ElMessage.success('封面上传成功')
    }
  } catch (error) {
    console.error('封面上传失败:', error)
    ElMessage.error('封面上传失败，请重试')
  }
}

// 处理音乐文件上传
const handleMusicChange = async (event) => {
  try {
    const url = await uploadAudioUtil(event)
    if (url) {
      editForm.value.url = url

      // 创建临时音频元素获取时长
      const audio = new Audio(url)
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          editForm.value.duration = Math.round(audio.duration)
          ElMessage.success('音乐时长已更新: ' + formatDuration(editForm.value.duration))
        }
      })
      audio.addEventListener('error', () => {
        // 如果无法加载，设置默认时长
        editForm.value.duration = 180
        ElMessage.warning('无法获取音乐时长，已设置默认值')
      })
      fetchMusicList()
      ElMessage.success('音乐文件上传成功')
    }
  } catch (error) {
    console.error('音乐文件上传失败:', error)
    ElMessage.error('音乐文件上传失败，请重试')
  }
}
</script>

<template>
  <div class="music-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <h3>音乐管理</h3>
          <el-button type="primary" @click="handleAdd">添加音乐</el-button>
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

      <!-- 音乐列表 -->
      <div class="music-list">
        <div v-for="item in filteredMusicList" :key="item.id" class="music-item"
          :class="{ 'is-playing': currentMusic?.id === item.id, 'is-active': isPlaying }">
          <div class="music-cover" @click="playMusic(item)">
            <el-image :src="item.cover" fit="cover" />
            <div class="play-icon">
              <el-icon v-if="currentMusic?.id !== item.id || !isPlaying">
                <VideoPlay />
              </el-icon>
              <el-icon v-else>
                <VideoPause />
              </el-icon>
            </div>
          </div>

          <div class="music-info">
            <div class="music-title">{{ item.title }}</div>
            <div class="music-artist">{{ item.artist }}</div>
            <div class="progress-container">
              <el-progress :percentage="currentMusic?.id === item.id ? progress : 0" :stroke-width="4"
                :show-text="false" />
              <div class="time-display">
                {{ currentMusic?.id === item.id ? formatRemainingTime : formatDuration(item.duration) }}
              </div>
            </div>
          </div>

          <div class="music-category">
            <el-tag :type="item.category === 'positive' || item.category === 'very_positive' ? 'success' :
              item.category === 'negative' || item.category === 'very_negative' ? 'danger' : 'info'">
              {{emotionOptions.find(opt => opt.value === item.category)?.label}}
            </el-tag>
          </div>

          <div class="music-actions">
            <el-button size="small" type="primary" @click="handleEdit(item)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(item)">删除</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 音频播放器 -->
    <audio ref="audioRef" @timeupdate="handleTimeUpdate" @ended="isPlaying = false" />

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑音乐' : '添加音乐'" v-model="editDialogVisible" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="音乐标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="艺术家" prop="artist">
          <el-input v-model="editForm.artist" />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <div class="avatar-container">
            <el-avatar :size="100" v-if="editForm.cover" :src="editForm.cover" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleCoverChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                {{ editForm.cover ? '更换封面' : '上传封面' }}
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="音乐文件" prop="url">
          <div class="avatar-container">
            <div v-if="editForm.url" class="music-file-info">
              <el-icon>
                <VideoPlay />
              </el-icon>
              <span>已上传音乐文件 ({{ formatDuration(editForm.duration) }})</span>
            </div>
            <div class="avatar-upload">
              <input type="file" ref="musicInput" accept="audio/*" style="display: none" @change="handleMusicChange" />
              <el-button size="small" type="primary" @click="$refs.musicInput.click()">
                {{ editForm.url ? '更换音乐' : '上传音乐' }}
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="情绪分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择分类">
            <el-option v-for="item in emotionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" rows="3" />
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
.music-container {
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

.music-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.music-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.music-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.music-cover {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.music-cover .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.is-playing .music-cover .el-image {
  animation: rotate 8s linear infinite;
  animation-play-state: paused;
}

.is-playing.is-active .music-cover .el-image {
  animation-play-state: running;
}

.play-icon {
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

.music-cover:hover .play-icon {
  opacity: 1;
}

.music-info {
  flex: 1;
  margin: 0 20px;
  min-width: 0;
}

.music-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.music-artist {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.music-category {
  margin: 0 20px;
}

.music-actions {
  display: flex;
  gap: 10px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.input-url {
  width: 100%;
  margin-top: 10px;
}

.music-file-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #606266;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

.progress-container {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
}

.time-display {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: #909399;
}
</style>
