<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit } from '@element-plus/icons-vue'

defineOptions({
  name: 'PsychologyArticles'
})

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 文章列表
const articleList = ref([
  {
    id: 1,
    title: '如何缓解焦虑情绪',
    description: '本文将介绍几种实用的焦虑情绪缓解方法...',
    content: `焦虑是一种常见的情绪反应，当我们面对不确定的情况或压力时，会产生焦虑感。
    以下是几种有效的缓解方法：

    1. 深呼吸练习
    通过缓慢的深呼吸，可以帮助我们平静下来。具体步骤如下：
    - 找一个安静的地方，采取舒适的坐姿
    - 缓慢吸气，数到4
    - 屏住呼吸，数到4
    - 缓慢呼气，数到4
    - 重复以上步骤

    2. 正念冥想
    正念冥想可以帮助我们专注于当下，而不是沉浸在焦虑中：
    - 闭上眼睛，关注呼吸
    - 观察当下的感受，不做评判
    - 当注意力分散时，温和地把它带回到呼吸上

    3. 运动
    适度的运动可以：
    - 释放压力
    - 产生快乐激素
    - 改善睡眠质量

    4. 与人交流
    与信任的人分享你的感受，这样可以：
    - 获得情感支持
    - 得到新的视角
    - 减轻心理负担

    记住，焦虑是正常的情绪反应，关键是学会如何与之相处。如果焦虑严重影响到日常生活，建议寻求专业心理咨询师的帮助。`,
    category: 'positive',
    createTime: '2024-03-15 10:00:00',
    cover: 'https://img.freepik.com/free-photo/woman-meditating-beach_23-2148739082.jpg'
  },
  {
    id: 2,
    title: '正念冥想入门指南',
    description: '正念冥想是一种有效的减压方法，本文将介绍基础的正念冥想技巧...',
    content: `正念冥想是一种源自古老佛教传统的练习，现在已被科学研究证明对心理健康有积极影响。

    什么是正念冥想？
    正念冥想是指有意识地、不带评判地关注当下的体验。它帮助我们摆脱对过去的遗憾和对未来的担忧，专注于此时此刻。

    基础练习步骤：
    1. 找一个安静的地方，采取舒适的坐姿
    2. 设定一个计时器（初学者可以从5分钟开始）
    3. 闭上眼睛或轻轻低垂目光
    4. 将注意力集中在呼吸上
    5. 当思绪漫游时，温和地将注意力带回呼吸

    科学证明的好处：
    - 减轻压力和焦虑
    - 改善注意力和集中力
    - 增强情绪调节能力
    - 提高自我意识

    坚持是关键。每天练习，即使只有几分钟，也会带来显著的变化。`,
    category: 'very_positive',
    createTime: '2024-03-16 14:30:00',
    cover: 'https://img.freepik.com/free-photo/woman-practicing-yoga-beach_23-2148739083.jpg'
  }
])

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
    // TODO: 调用保存API

    // 更新本地数据
    const index = articleList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      articleList.value[index] = { ...editForm.value }
    } else {
      // 新增
      articleList.value.push({
        ...editForm.value,
        id: Date.now(),
        createTime: new Date().toLocaleString()
      })
    }

    ElMessage.success('保存成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
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

    // TODO: 调用删除API

    // 更新本地数据
    const index = articleList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      articleList.value.splice(index, 1)
      ElMessage.success('删除成功')
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

      <!-- 文章列表 -->
      <div class="article-grid">
        <el-card v-for="item in articleList" :key="item.id" class="article-card" @click="handleDetail(item)">
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
            <span class="article-time">{{ item.createTime }}</span>
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
        <span class="article-time">{{ currentArticle?.createTime }}</span>
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
          <el-upload class="cover-uploader" action="/api/upload" :show-file-list="false" accept="image/*">
            <el-image v-if="editForm.cover" :src="editForm.cover" fit="cover" class="cover-preview" />
            <el-button v-else>上传封面</el-button>
          </el-upload>
          <el-input v-model="editForm.cover" placeholder="或输入图片URL" class="mt-2" />
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
</style>
