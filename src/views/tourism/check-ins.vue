<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'TourismCheckIns'
})

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 打卡图片列表
const checkInList = ref([
  {
    id: 1,
    image: 'https://img.picui.cn/free/2025/03/08/67cc4dfa9690f.png',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 2,
    image: 'https://img.picui.cn/free/2025/02/20/67b6eaddd1aa9.jpg',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 3,
    image: 'https://img.picui.cn/free/2025/01/25/679422be838f3.png',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 4,
    image: 'https://img.picui.cn/free/2024/11/04/6728a6c956362.png',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 5,
    image: 'https://img.picui.cn/free/2024/11/04/6728a6a145e9e.png',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 6,
    image: 'https://img.picui.cn/free/2025/01/25/679428ddcabd1.png',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 7,
    image: 'https://img.picui.cn/free/2025/01/25/6794231281d95.png',
    category: 'positive',
    createTime: Date.now()
  }
])

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

// 保存
const handleSave = async () => {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()
    // TODO: 调用保存API

    // 模拟新增
    const newItem = {
      ...addForm.value,
      id: Date.now(),
      createTime: Date.now()
    }
    checkInList.value.unshift(newItem)

    ElMessage.success('添加成功')
    addDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
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

    // TODO: 调用删除API
    const index = checkInList.value.findIndex(i => i.id === item.id)
    if (index !== -1) {
      checkInList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 处理图片上传
const handleImageSuccess = (response) => {
  if (response.code === 200 && response.data?.url) {
    addForm.value.image = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 上传前检查
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
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

      <div class="check-in-grid">
        <div v-for="item in checkInList" :key="item.id" class="check-in-item">
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
          </div>
        </div>
      </div>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog title="添加打卡图片" v-model="addDialogVisible" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="上传图片" prop="image">
          <div class="upload-container">
            <el-image v-if="addForm.image" :src="addForm.image" class="preview-image" />
            <el-upload class="image-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleImageSuccess" :before-upload="beforeImageUpload" accept="image/*">
              <el-button type="primary">
                {{ addForm.image ? '更换图片' : '上传图片' }}
              </el-button>
            </el-upload>
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

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.preview-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
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
