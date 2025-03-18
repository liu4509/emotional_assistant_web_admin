<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAttractionList, createAttraction, updateAttraction, deleteAttraction } from '@/api/attraction'
import { uploadImageUtil } from '@/utils/utils'

defineOptions({
  name: 'TourismRecommendations'
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

// 推荐列表数据
const recommendationList = ref([])

// 过滤后的推荐列表
const filteredRecommendationList = computed(() => {
  if (!currentCategory.value) return recommendationList.value
  return recommendationList.value.filter(item => item.category === currentCategory.value)
})

// 获取景点列表
const fetchAttractionList = async () => {
  try {
    loading.value = true
    const res = await getAttractionList()
    if (res.code === 200) {
      recommendationList.value = res.data.map(item => ({
        ...item,
        category: item.categorys[0]?.value || 'neutral'
      }))
    } else {
      ElMessage.error(res.message || '获取景点列表失败')
    }
  } catch (error) {
    console.error('获取景点列表失败:', error)
    ElMessage.error('获取景点列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取景点列表
onMounted(() => {
  fetchAttractionList()
})

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
  image: [
    { required: true, message: '请上传图片', trigger: 'change' }
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

    const attractionData = {
      title: editForm.value.title,
      details: editForm.value.details,
      image: editForm.value.image,
      categoryValues: [editForm.value.category]
    }

    let res
    if (editForm.value.id) {
      // 更新景点
      res = await updateAttraction(editForm.value.id, attractionData)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        await fetchAttractionList() // 重新获取列表
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建景点
      res = await createAttraction(attractionData)
      if (res.code === 201) {
        ElMessage.success('添加成功')
        await fetchAttractionList() // 重新获取列表
      } else {
        ElMessage.error(res.message || '添加失败')
      }
    }

    editDialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
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

    const res = await deleteAttraction(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      await fetchAttractionList() // 重新获取列表
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

// 处理图片上传
const handleImageChange = async (event) => {
  try {
    const url = await uploadImageUtil(event)
    if (url) {
      editForm.value.image = url
      ElMessage.success('图片上传成功')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
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

      <!-- 分类筛选 -->
      <div class="category-filter">
        <el-radio-group v-model="currentCategory" size="large">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="option in emotionOptions" :key="option.value" :label="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div v-loading="loading" class="recommendation-list">
        <el-card v-for="item in filteredRecommendationList" :key="item.id" class="recommendation-item">
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
                <span class="item-time">{{ new Date(item.createTime).toLocaleString() }}</span>
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
        <el-form-item label="景点图片" prop="image">
          <div class="avatar-container">
            <el-avatar :size="150" v-if="editForm.image" :src="editForm.image" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleImageChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                {{ editForm.image ? '更换图片' : '上传图片' }}
              </el-button>
            </div>
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

.category-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
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

.item-time {
  color: #909399;
  font-size: 12px;
}

.operations {
  display: flex;
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

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
