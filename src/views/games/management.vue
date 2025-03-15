<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Link, Edit, Delete, Plus } from '@element-plus/icons-vue'

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

// 游戏列表
const gamesList = ref([
  {
    id: 1,
    title: '色彩方块消消看',
    description: '这是一款消消看游戏，游戏虽然没有花哨的画面但是游戏性和挑战性依旧非常高，看看你能得到多少分，大家快来相互比一比吧！',
    image: 'https://img.freepik.com/free-vector/mobile-game-match-three-game-assets_107791-1836.jpg',
    url: 'https://www.7k7k.com/flash/79305.htm',
    category: 'positive',
    createTime: '2024-03-15 10:00:00'
  },
  {
    id: 2,
    title: '数独挑战',
    description: '玩数独游戏，感受数独游戏的规则，锻炼推理和逻辑思维能力，体会自主游戏的乐趣，初步养成乐于挑战的学习品质。拖动游戏下方的角色到上方的格子里，格子填满并且全部正确后过关。',
    image: 'https://img.freepik.com/free-vector/sudoku-game-concept-illustration_114360-1908.jpg',
    url: 'https://www.7k7k.com/flash/156420.htm',
    category: 'neutral',
    createTime: '2024-03-16 14:30:00'
  },
  {
    id: 3,
    title: '节奏大师电脑版',
    description: '火热的休闲音乐挑战类手机游戏《节奏大师》现在也有了电脑在线版本啦！老少咸宜的游戏模式吸引了无数粉丝，还在等什么，赶紧让热门，流行，动漫，经典四大种类的音乐冲击你的感官，赶紧让动人的旋律音符在你的指尖跃动，在音乐中忘我地游戏吧',
    image: 'https://img.freepik.com/free-vector/gradient-japanese-temple-with-lake_52683-44985.jpg',
    url: 'https://www.7k7k.com/flash/126556.htm',
    category: 'very_positive',
    createTime: '2024-03-17 09:15:00'
  }
])

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  description: '',
  image: '',
  url: '',
  category: ''
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

  try {
    await editFormRef.value.validate()
    // TODO: 调用保存API

    // 更新本地数据
    const index = gamesList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      gamesList.value[index] = { ...editForm.value }
    } else {
      // 新增
      gamesList.value.push({
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

    // 更新本地数据
    const index = gamesList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      gamesList.value.splice(index, 1)
      ElMessage.success('删除成功')
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
  editForm.value = {
    id: '',
    title: '',
    description: '',
    image: '',
    url: '',
    category: ''
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

      <!-- 游戏列表 -->
      <div class="games-grid">
        <el-card v-for="item in gamesList" :key="item.id" class="game-card">
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
          <el-upload class="image-uploader" action="/api/upload" :show-file-list="false" accept="image/*">
            <el-image v-if="editForm.image" :src="editForm.image" fit="cover" class="image-preview" />
            <el-button v-else>上传图片</el-button>
          </el-upload>
          <el-input v-model="editForm.image" placeholder="或输入图片URL" class="mt-2" />
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
</style>
