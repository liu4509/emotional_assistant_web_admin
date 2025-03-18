<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Link, Edit, Delete, Plus } from '@element-plus/icons-vue'
import { createGame, deleteGame, getGameList, updateGame } from '@/api/game'
import { uploadImageUtil } from '@/utils/utils'

defineOptions({
  name: 'GamesManagement'
})

// 情绪分类选项
const emotionOptions = [
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]

// 当前选中的分类
const currentCategory = ref('')

const isEdit = ref(true)
const gamesList = ref([])
const loading = ref(false)

// 过滤后的游戏列表
const filteredGamesList = computed(() => {
  if (!currentCategory.value) return gamesList.value
  return gamesList.value.filter(item => item.category === currentCategory.value)
})

// 获取游戏列表
const fetchGameList = async () => {
  try {
    loading.value = true
    const res = await getGameList()
    if (res.code === 200) {
      let vo = []
      res.data.map(item => {
        vo.push({
          ...item,
          category: item.categorys[0]?.value
        })
      })
      gamesList.value = vo || []
    } else {
      ElMessage.error(res.message || '获取游戏列表失败')
    }
  } catch (error) {
    console.error('获取游戏列表失败:', error)
    ElMessage.error('获取游戏列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取游戏列表
onMounted(() => {
  fetchGameList()
})

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  description: '',
  image: '',
  url: '',
  category: '',
})

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入游戏标题', trigger: 'blur' }],
  url: [{ required: true, message: '请输入游戏链接', trigger: 'blur' }],
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

  if (isEdit.value) {
    try {
      await editFormRef.value.validate()
      // TODO: 调用保存API
      const res = await updateGame(editForm.value.id, {
        title: editForm.value.title,
        description: editForm.value.description,
        image: editForm.value.image,
        url: editForm.value.url,
        categoryValues: [editForm.value.category]
      })
      if (res.code === 200) {
        ElMessage.success('保存成功')
        fetchGameList()
        editDialogVisible.value = false
      } else {
        ElMessage.error(res.message || '保存失败')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('请检查表单填写是否正确')
    } finally {
      editDialogVisible.value = false
      isEdit.value = true
    }
  } else {
    // TODO: 调用保存API

    try {
      await editFormRef.value.validate()
      // TODO: 调用保存API
      const res = await createGame({
        title: editForm.value.title,
        description: editForm.value.description,
        image: editForm.value.image,
        url: editForm.value.url,
        categoryValues: [editForm.value.category]
      })
      if (res.code === 201) {
        ElMessage.success('新建游戏保存成功')
        fetchGameList()
        editDialogVisible.value = false
        isEdit.value = true
      } else {
        ElMessage.error(res.message || '新建游戏保存失败')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('请检查表单填写是否正确')
    } finally {
      editDialogVisible.value = false
      isEdit.value = true
    }
  }
}
// 处理头像上传
const handleAvatarChange = async (event) => {
  try {
    const url = await uploadImageUtil(event)
    editForm.value.image = url
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}
// 删除游戏
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除游戏 "${row.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除API
    const res = await deleteGame(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchGameList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 新增游戏
const handleAdd = () => {
  isEdit.value = false
  editForm.value = {
    id: '',
    title: '',
    description: '',
    image: '',
    url: '',
    category: '',
    categoryValues: []
  }
  editDialogVisible.value = true
}

// 打开游戏链接
const openGameUrl = (url) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="games-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>解压小游戏管理</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            添加游戏
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

      <!-- 游戏列表 -->
      <div v-loading="loading" class="games-grid">
        <el-card v-for="item in filteredGamesList" :key="item.id" class="game-card">
          <div class="game-image">
            <el-image :src="item.image" fit="cover" />
            <div class="game-category">
              <el-tag
                :type="item.category === 'positive' ? 'success' : item.category === 'negative' ? 'danger' : 'info'">
                {{emotionOptions.find(opt => opt.value === item.category)?.label}}
              </el-tag>
            </div>
          </div>

          <div class="game-content">
            <h4 class="game-title">{{ item.title }}</h4>
            <div class="game-description">{{ item.description }}</div>

            <div class="game-footer">
              <div class="game-time">{{ item.createTime }}</div>
              <div class="game-actions">
                <el-button size="small" type="success" @click="openGameUrl(item.url)">
                  <el-icon>
                    <Link />
                  </el-icon>
                  开始游戏
                </el-button>
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
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑游戏' : '添加游戏'" v-model="editDialogVisible" width="600px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="游戏标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="游戏图片" prop="image">
          <div class="avatar-container">
            <el-avatar :size="150" v-if="editForm.image" :src="editForm.image" shape="square" fit="cover" />
            <div class="avatar-upload">
              <input type="file" ref="fileInput" accept="image/jpeg,image/png" style="display: none"
                @change="handleAvatarChange" />
              <el-button size="small" type="primary" @click="$refs.fileInput.click()">
                上传图片
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="游戏链接" prop="url">
          <el-input v-model="editForm.url" placeholder="例如: https://example.com/game" />
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
.games-container {
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

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.game-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 4px;
}

.game-image .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.game-card:hover .game-image .el-image {
  transform: scale(1.05);
}

.game-category {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.game-content {
  padding: 15px 0;
}

.game-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.game-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.game-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-time {
  color: #999;
  font-size: 12px;
}

.game-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-preview {
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

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
