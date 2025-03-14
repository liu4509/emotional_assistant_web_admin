<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'TourismRecommendations'
})

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 推荐列表数据
const recommendationList = ref([
  {
    id: 1,
    title: '美丽的西湖',
    image: 'https://img.picui.cn/free/2025/03/08/67cc4dfa9690f.png',
    details: '西湖景区包含了丰富的自然和人文景观，是杭州市的标志性景点之一。景区内有断桥残雪、平湖秋月等著名景点...',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 2,
    title: '美丽的西湖',
    image: 'https://cdn.picui.cn/vip/2025/02/16/67b1f3d628c67.jpg',
    details: '西湖景区包含了丰富的自然和人文景观，是杭州市的标志性景点之一。景区内有断桥残雪、平湖秋月等著名景点...',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 3,
    title: '美丽的西湖',
    image: 'https://cdn.picui.cn/vip/2025/01/24/679332c414c07.jpg',
    details: '西湖景区包含了丰富的自然和人文景观，是杭州市的标志性景点之一。景区内有断桥残雪、平湖秋月等著名景点...',
    category: 'positive',
    createTime: Date.now()
  },
  {
    id: 4,
    title: '美丽的西湖',
    image: 'https://img.picui.cn/free/2025/03/08/67cc4dfa9690f.png',
    details: '西湖景区包含了丰富的自然和人文景观，是杭州市的标志性景点之一。景区内有断桥残雪、平湖秋月等著名景点...',
    category: 'positive',
    createTime: Date.now()
  }
])

// 图片预览
const previewVisible = ref(false)
const previewImage = ref('')
const showPreview = (url) => {
  previewImage.value = url
  previewVisible.value = true
}

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  image: '',
  details: '',
  category: ''
})

// 表单规则
const editRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  details: [
    { required: true, message: '请输入详情', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

// 表单引用
const editFormRef = ref(null)

// 打开编辑对话框
const handleEdit = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 新增景点
const handleAdd = () => {
  editForm.value = {
    id: '',
    title: '',
    image: '',
    details: '',
    category: ''
  }
  editDialogVisible.value = true
}

// 保存
const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    // TODO: 调用保存API
    const isNew = !editForm.value.id

    if (isNew) {
      // 模拟新增
      const newItem = {
        ...editForm.value,
        id: Date.now(),
        createTime: Date.now()
      }
      recommendationList.value.unshift(newItem)
      ElMessage.success('添加成功')
    } else {
      // 模拟更新
      const index = recommendationList.value.findIndex(item => item.id === editForm.value.id)
      if (index !== -1) {
        recommendationList.value[index] = { ...editForm.value }
      }
      ElMessage.success('更新成功')
    }

    editDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个景点吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用删除API
    const index = recommendationList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      recommendationList.value.splice(index, 1)
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
    editForm.value.image = response.data.url
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
  <div class="tourism-recommendations">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>旅游推荐管理</h3>
          <el-button type="primary" @click="handleAdd">添加景点</el-button>
        </div>
      </template>

      <div class="recommendation-list">
        <el-card v-for="item in recommendationList" :key="item.id" class="recommendation-item">
          <div class="item-content">
            <div class="item-image" @mouseenter="showPreview(item.image)" @mouseleave="previewVisible = false">
              <el-image :src="item.image" fit="cover" />
              <!-- 图片预览 -->
              <div v-if="previewVisible && previewImage === item.image" class="image-preview">
                <el-image :src="item.image" fit="contain" />
              </div>
            </div>
            <div class="item-info">
              <h4>{{ item.title }}</h4>
              <p class="details" :title="item.details">{{ item.details }}</p>
              <div class="item-footer">
                <el-tag
                  :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'">
                  {{emotionOptions.find(opt => opt.value === item.category)?.label || item.category}}
                </el-tag>
                <div class="operations">
                  <el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
                  <el-button type="danger" link @click="handleDelete(item)">删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑景点' : '添加景点'" v-model="editDialogVisible" width="600px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="景点图片">
          <div class="upload-container">
            <el-image v-if="editForm.image" :src="editForm.image" class="preview-image" />
            <el-upload class="image-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleImageSuccess" :before-upload="beforeImageUpload" accept="image/*">
              <el-button type="primary">
                {{ editForm.image ? '更换图片' : '上传图片' }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="详情" prop="details">
          <el-input v-model="editForm.details" type="textarea" :rows="4" placeholder="请输入景点详情描述" />
        </el-form-item>

        <el-form-item label="情绪分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择情绪分类">
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
.tourism-recommendations {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recommendation-item {
  margin-bottom: 0;
}

.item-content {
  display: flex;
  gap: 20px;
}

.item-image {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.item-image .el-image {
  width: 100%;
  height: 100%;
}

.image-preview {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 4px;
}

.image-preview .el-image {
  max-width: 80vw;
  max-height: 80vh;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-info h4 {
  margin: 0 0 10px;
  font-size: 18px;
}

.details {
  flex: 1;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operations {
  display: flex;
  gap: 10px;
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

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
