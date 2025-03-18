<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, ZoomIn } from '@element-plus/icons-vue'
import { getClockList, createClock, deleteClock } from '@/api/clock'
import { uploadImageUtil } from '@/utils/utils'

defineOptions({
  name: 'TourismCheckIns'
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

// 打卡图片列表
const checkInList = ref([])

// 过滤后的打卡列表
const filteredCheckInList = computed(() => {
  if (!currentCategory.value) return checkInList.value
  return checkInList.value.filter(item => item.category === currentCategory.value)
})

// 获取打卡列表
const fetchClockList = async () => {
  try {
    loading.value = true
    const res = await getClockList()
    if (res.code === 200) {
      checkInList.value = res.data.map(item => ({
        ...item,
        category: item.categorys[0]?.value || 'neutral'
      }))
    } else {
      ElMessage.error(res.message || '获取打卡列表失败')
    }
  } catch (error) {
    console.error('获取打卡列表失败:', error)
    ElMessage.error('获取打卡列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取打卡列表
onMounted(() => {
  fetchClockList()
})

// 大图预览
const previewVisible = ref(false)
const previewImage = ref('')

// 显示大图
const showPreview = (url) => {
  previewImage.value = url
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  previewImage.value = ''
}

// 添加对话框
const addDialogVisible = ref(false)
const addForm = ref({
  image: '',
  category: ''
})

// 表单规则
const addRules = {
  image: [
    { required: true, message: '请上传图片', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

// 表单引用
const addFormRef = ref(null)

// 打开添加对话框
const handleAdd = () => {
  addForm.value = {
    image: '',
    category: ''
  }
  addDialogVisible.value = true
}

// 处理图片上传
const handleImageChange = async (event) => {
  try {
    const url = await uploadImageUtil(event)
    if (url) {
      addForm.value.image = url
      ElMessage.success('图片上传成功')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}

// 保存
const handleSave = async () => {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()

    const clockData = {
      image: addForm.value.image,
      categoryValues: [addForm.value.category]
    }

    const res = await createClock(clockData)
    if (res.code === 201) {
      ElMessage.success('添加成功')
      await fetchClockList() // 重新获取列表
      addDialogVisible.value = false
    } else {
      ElMessage.error(res.message || '添加失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 删除
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确定要删除这张图片吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteClock(item.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      await fetchClockList() // 重新获取列表
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
</script>

<template>
  <div class="tourism-check-ins">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>打卡图片管理</h3>
          <el-button type="primary" @click="handleAdd">添加图片</el-button>
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

      <div v-loading="loading" class="check-in-grid">
        <div v-for="item in filteredCheckInList" :key="item.id" class="check-in-item">
          <div class="image-container" :style="{ backgroundImage: `url(${item.image})` }">
            <!-- 查看遮罩 -->
            <div class="overlay view-overlay" @click="showPreview(item.image)">
              <el-icon>
                <ZoomIn />
              </el-icon>
              <span>查看</span>
            </div>
            <!-- 删除遮罩 -->
            <div class="overlay delete-overlay" @click="handleDelete(item)">
              <el-icon>
                <Delete />
              </el-icon>
              <span>删除</span>
            </div>
            <!-- 分类标签 -->
            <el-tag class="category-tag"
              :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'">
              {{emotionOptions.find(opt => opt.value === item.category)?.label}}
            </el-tag>
            <!-- 时间标签 -->
            <span class="time-tag">{{ new Date(item.createTime).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog title="添加打卡图片" v-model="addDialogVisible" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="上传图片" prop="image">
          <div class="avatar-container">
            <el-avatar :size="150" v-if="addForm.image" :src="addForm.image" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleImageChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                {{ addForm.image ? '更换图片' : '上传图片' }}
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="情绪分类" prop="category">
          <el-select v-model="addForm.category" placeholder="请选择情绪分类">
            <el-option v-for="item in emotionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 大图预览 -->
    <el-dialog v-model="previewVisible" :show-close="false" @click="closePreview" class="preview-dialog" :width="'auto'"
      :top="'5vh'" align-center>
      <div class="preview-container" @click.stop>
        <el-image :src="previewImage" fit="scale-down" />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.tourism-check-ins {
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

.check-in-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.check-in-item {
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}

.overlay {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.overlay:hover {
  opacity: 1;
}

.view-overlay {
  top: 0;
  left: 0;
  right: 50%;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.delete-overlay {
  top: 0;
  left: 50%;
  right: 0;
  bottom: 0;
  background: rgba(220, 38, 38, 0.5);
}

.overlay .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.category-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.time-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 5px;
  border-radius: 4px;
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

.preview-dialog :deep(.el-dialog) {
  margin: 0;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.preview-dialog :deep(.el-dialog__header) {
  display: none;
}

.preview-dialog :deep(.el-dialog__body) {
  padding: 0;
  flex: 1;
  overflow: hidden;
  margin: 0;
}

.preview-container {
  width: 50vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}

.preview-container .el-image {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
