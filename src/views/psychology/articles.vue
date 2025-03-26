<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit } from '@element-plus/icons-vue'
import { getArticleList, createArticle, updateArticle, deleteArticle } from '@/api/article'
import { uploadImageUtil } from '@/utils/utils'

defineOptions({
  name: 'PsychologyArticles'
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

// 文章列表
const articleList = ref([])

// 过滤后的文章列表
const filteredArticleList = computed(() => {
  if (!currentCategory.value) return articleList.value
  return articleList.value.filter(item => item.category === currentCategory.value)
})

// 获取文章列表
const fetchArticleList = async () => {
  try {
    loading.value = true
    const res = await getArticleList()
    if (res.code === 201 || res.code === 200) {
      articleList.value = res.data.article.map(item => ({
        ...item,
        category: item.categorys[0]?.value || 'neutral',
        cover: item.cover
      }))
    } else {
      ElMessage.error(res.message || '获取文章列表失败')
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取文章列表
onMounted(() => {
  fetchArticleList()
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentArticle = ref(null)

// 显示详情
const handleDetail = (article) => {
  currentArticle.value = article
  detailDialogVisible.value = true
}

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  description: '',
  content: '',
  category: '',
  cover: ''
})

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
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

    const articleData = {
      title: editForm.value.title,
      description: editForm.value.description,
      content: editForm.value.content,
      cover: editForm.value.cover,
      categoryValues: [editForm.value.category]
    }

    let res
    if (editForm.value.id) {
      // 更新文章
      res = await updateArticle(editForm.value.id, articleData)
      if (res.code === 201 || res.code === 200) {
        ElMessage.success('更新成功')
        await fetchArticleList() // 重新获取列表
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建文章
      res = await createArticle(articleData)
      if (res.code === 201 || res.code === 200) {
        ElMessage.success('创建成功')
        await fetchArticleList() // 重新获取列表
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

// 删除文章
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章 "${row.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteArticle(row.id)
    if (res.code === 201 || res.code === 200) {
      ElMessage.success('删除成功')
      await fetchArticleList() // 重新获取列表
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

// 新增文章
const handleAdd = () => {
  editForm.value = {
    id: '',
    title: '',
    description: '',
    content: '',
    category: '',
    cover: ''
  }
  editDialogVisible.value = true
}

// 处理图片上传
const handleAvatarChange = async (event) => {
  try {
    const url = await uploadImageUtil(event)
    editForm.value.cover = url
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}
</script>

<template>
  <div class="article-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>心理文章管理</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Document />
            </el-icon>
            添加文章
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

      <!-- 文章列表 -->
      <div v-loading="loading" class="article-grid">
        <el-card v-for="item in filteredArticleList" :key="item.id" class="article-card" @click="handleDetail(item)">
          <div class="article-cover">
            <el-image :src="item.cover" fit="cover" />
          </div>
          <template #header>
            <div class="article-card-header">
              <h4 class="article-title">{{ item.title }}</h4>
              <el-tag
                :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'"
                size="small">
                {{emotionOptions.find(opt => opt.value === item.category)?.label}}
              </el-tag>
            </div>
          </template>

          <div class="article-description">{{ item.description }}</div>

          <div class="article-footer">
            <span class="article-time">{{ new Date(item.createTime).toLocaleString() }}</span>
            <div class="article-actions" @click.stop>
              <el-button size="small" type="primary" @click="handleEdit(item)">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(item)">
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

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" :title="currentArticle?.title" width="800px" class="article-detail-dialog">
      <div class="article-meta">
        <el-tag
          :type="currentArticle?.category === 'positive' ? 'success' : currentArticle?.category === 'negative' ? 'danger' : 'info'">
          {{emotionOptions.find(opt => opt.value === currentArticle?.category)?.label}}
        </el-tag>
        <span class="article-time">{{ new Date(currentArticle?.createTime).toLocaleString() }}</span>
      </div>
      <div class="article-content" v-html="currentArticle?.content?.replace(/\n/g, '<br>')"></div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑文章' : '添加文章'" v-model="editDialogVisible" width="800px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="简要描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <div class="avatar-container">
            <el-avatar :size="150" v-if="editForm.cover" :src="editForm.cover" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleAvatarChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                上传图片
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <el-input v-model="editForm.content" type="textarea" :rows="10" />
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
.article-container {
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

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-cover {
  height: 160px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 10px;
}

.article-cover .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.article-card:hover .article-cover .el-image {
  transform: scale(1.05);
}

.article-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.article-title {
  margin: 0;
  flex: 1;
  font-size: 16px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.article-time {
  color: #999;
  font-size: 12px;
}

.article-actions {
  display: flex;
  gap: 8px;
}

.article-meta {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.article-detail-cover {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
}

.article-detail-cover .el-image {
  width: 100%;
}

.article-content {
  line-height: 1.8;
  color: #333;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

.article-content::-webkit-scrollbar {
  width: 6px;
}

.article-content::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.article-content::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.cover-preview {
  width: 100%;
  height: 160px;
  border-radius: 4px;
  object-fit: cover;
}

.mt-2 {
  margin-top: 8px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.article-detail-dialog .el-dialog__body) {
  padding-top: 10px;
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
