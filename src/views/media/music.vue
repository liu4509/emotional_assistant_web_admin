<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { formatDuration } from '@/utils/utils'

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

// 音乐列表
const musicList = ref([
  {
    id: 1,
    title: '罗生门',
    artist: '梨冻紧',
    cover: 'https://p2.music.126.net/yN1ke1xYMJ718FiHaDWtYQ==/109951165076380471.jpg?param=300y300',
    url: 'https://m701.music.126.net/20250315024344/c8cb579fd705785f686572577d673500/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096444542/bafc/a068/39f8/9a9e06e5634410b5e7e81df24749e656.mp3?vuutv=bDsTdetX9dDLrxN0LKNDawGMz7NHsfWdE09z4GH355ZoycsapBVc7v9tFcq3pOpZ239KqN1Mjl3rSqIumAyCwh8PPpMYn+lnxUlPON7iqRw=',
    duration: 180, // 总时长（秒）
    category: 'positive',
    description: '轻快的春日旋律'
  },
  {
    id: 2,
    title: '跳楼机',
    artist: 'LBI利比',
    cover: 'https://p1.music.126.net/cmoE8PsdK_Yn9VJ8ZVCGrw==/109951170507596121.jpg?param=300y300',
    url: 'https://m801.music.126.net/20250315024228/93e460f38dad08573524b483634a83fb/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/58134116941/6d6c/bb3f/6897/4ed130b22b010e87bf19ae65fe18eeb1.mp3?vuutv=IdV3izetV5ILp5SRo9iyi8nBKBiHinv4q6arzbQCY10KuNjuAgBJGVmsJ8M0DVPDCP3TqI1sEbThycfgjMyVUYZmjCh5rWN7/oc86GWc2zU=',
    duration: 180, // 总时长（秒）
    category: 'positive',
    description: '轻快的春日旋律'
  },
  {
    id: 3,
    title: '于是',
    artist: '郑润泽',
    cover: 'https://p2.music.126.net/PEGvmO3OqgGOkx4m9qxAJA==/109951163478499713.jpg?param=300y300',
    url: 'https://m801.music.126.net/20250315030232/66656a294ed786876098f6cbd3d40abe/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28481680626/8c3f/dd57/4c1c/84333f57c88a35512dd3ba34a1a1816f.mp3?vuutv=1Q7TlkDNq5Q4m+jVjA/G8luIw34qlYZTSqpHd4wW52vDNGvAGs0/DTN5vbgXbaClOUQsJouh/v93gYGPdhwYl4u9UzalKRya4Li3bf8/9nVZhzWMoWRjCTG6ZQqySfbo',
    duration: 180, // 总时长（秒）
    category: 'positive',
    description: '轻快的春日旋律'
  },
  {
    id: 4,
    title: '一点',
    artist: 'Muyoi',
    cover: 'https://p2.music.126.net/PiSqUS2bxc9x2Zbz2vt4sQ==/109951170099752710.jpg?param=300y300',
    url: 'https://m701.music.126.net/20250315030438/9283980ef70434d81d9041f30cf4febb/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/56768143391/d2fa/11cb/8724/33adbb19242520ec4597253da0db0a9a.mp3?vuutv=fFYQNyAWqV/b+PdJ1PjdN04VHuhiq+t7zKm/6bwEyTwdOgoiPzgKoiEVgB9yR1FY3k9bmrY+wWss2xxLxpkXYJA9LaUuSdUThLK1X94w5TBM915yvuqSqWeBB/HjX0N2',
    duration: 180, // 总时长（秒）
    category: 'positive',
    description: '轻快的春日旋律'
  },
])

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
  description: ''
})

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入音乐标题', trigger: 'blur' }],
  artist: [{ required: true, message: '请输入歌手', trigger: 'blur' }],
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
    const index = musicList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      musicList.value[index] = { ...editForm.value }
    } else {
      // 新增
      musicList.value.push({
        ...editForm.value,
        id: Date.now(),
        duration: 0
      })
    }

    ElMessage.success('保存成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
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

    // TODO: 调用删除API

    // 更新本地数据
    const index = musicList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      musicList.value.splice(index, 1)
      ElMessage.success('删除成功')
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
    description: ''
  }
  editDialogVisible.value = true
}
</script>

<template>
  <div class="music-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>音乐管理</h3>
          <el-button type="primary" @click="handleAdd">添加音乐</el-button>
        </div>
      </template>

      <!-- 音乐列表 -->
      <div class="music-list">
        <div v-for="item in musicList" :key="item.id" class="music-item"
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
            <el-progress :percentage="currentMusic?.id === item.id ? progress : 0"
              :format="() => formatDuration(currentTime)" :stroke-width="4" :show-text="currentMusic?.id === item.id" />
          </div>

          <div class="music-category">
            <el-tag :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'">
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
          <el-upload class="cover-uploader" action="/api/upload" :show-file-list="false" accept="image/*">
            <el-image v-if="editForm.cover" :src="editForm.cover" fit="cover" class="cover-preview" />
            <el-button v-else>上传封面</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="音乐文件" prop="url">
          <el-upload class="music-uploader" action="/api/upload" :show-file-list="false" accept="audio/*">
            <el-button>{{ editForm.url ? '重新上传' : '上传音乐' }}</el-button>
          </el-upload>
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

.cover-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
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
</style>
