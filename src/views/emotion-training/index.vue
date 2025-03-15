<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Edit, QuestionFilled, Top, Bottom, Rank } from '@element-plus/icons-vue'

defineOptions({
  name: 'EmotionTrainingManagement'
})

// 训练列表
const trainingList = ref([
  {
    id: 1,
    title: '认知重构训练',
    description: '通过识别和改变消极思维模式来调节情绪的训练。',
    createTime: '2024-03-15 10:00:00',
    questions: [
      {
        id: 101,
        content: '当遇到挫折时，我应该如何调整思维？',
        order: 1,
        options: [
          { id: 1001, content: '将挫折视为成长的机会，思考可以从中学到什么', isCorrect: true },
          { id: 1002, content: '认为这是命运的安排，无法改变', isCorrect: false }
        ]
      },
      {
        id: 102,
        content: '面对批评，以下哪种反应更有助于情绪调节？',
        order: 2,
        options: [
          { id: 1003, content: '将批评视为对方的恶意攻击，产生防御心理', isCorrect: false },
          { id: 1004, content: '客观分析批评内容，从中找出有价值的建议', isCorrect: true }
        ]
      },
      {
        id: 103,
        content: '当感到焦虑时，以下哪种认知方式更健康？',
        order: 3,
        options: [
          { id: 1005, content: '认为焦虑是正常的情绪反应，接纳它的存在', isCorrect: true },
          { id: 1006, content: '认为焦虑是软弱的表现，应该压抑这种情绪', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '情绪觉察训练',
    description: '提高对自身情绪的觉察能力，学会识别和命名情绪。',
    createTime: '2024-03-16 14:30:00',
    questions: [
      {
        id: 201,
        content: '以下哪种做法有助于提高情绪觉察能力？',
        order: 1,
        options: [
          { id: 2001, content: '每天记录自己的情绪变化和触发因素', isCorrect: true },
          { id: 2002, content: '尽量忽略负面情绪，只关注积极情绪', isCorrect: false }
        ]
      },
      {
        id: 202,
        content: '当感到愤怒时，以下哪种做法更有助于情绪调节？',
        order: 2,
        options: [
          { id: 2003, content: '立即表达愤怒，发泄出来', isCorrect: false },
          { id: 2004, content: '先暂停一下，识别愤怒背后的原因，再决定如何回应', isCorrect: true }
        ]
      }
    ]
  }
])

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  description: '',
  questions: []
})

// 编辑表单规则
const editRules = {
  title: [{ required: true, message: '请输入训练标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入训练描述', trigger: 'blur' }]
}

// 表单引用
const editFormRef = ref(null)

// 打开编辑对话框
const handleEdit = (row) => {
  // 深拷贝训练数据，避免直接修改原数据
  editForm.value = JSON.parse(JSON.stringify(row))
  // 确保问题按顺序排列
  editForm.value.questions.sort((a, b) => a.order - b.order)
  editDialogVisible.value = true
}

// 保存编辑
const handleSave = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    // 验证问题和选项
    if (editForm.value.questions.length === 0) {
      ElMessage.warning('请至少添加一个问题')
      return
    }

    for (const question of editForm.value.questions) {
      if (!question.content.trim()) {
        ElMessage.warning('问题内容不能为空')
        return
      }

      if (question.options.length === 0) {
        ElMessage.warning(`问题"${question.content}"至少需要一个选项`)
        return
      }

      for (const option of question.options) {
        if (!option.content.trim()) {
          ElMessage.warning(`问题"${question.content}"的选项内容不能为空`)
          return
        }
      }

      // 检查是否有正确选项
      const hasCorrectOption = question.options.some(option => option.isCorrect)
      if (!hasCorrectOption) {
        ElMessage.warning(`问题"${question.content}"至少需要一个正确选项`)
        return
      }
    }

    // 更新问题顺序
    editForm.value.questions.forEach((question, index) => {
      question.order = index + 1
    })

    // TODO: 调用保存API

    // 更新本地数据
    const index = trainingList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      trainingList.value[index] = { ...editForm.value }
    } else {
      // 新增
      trainingList.value.push({
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

// 删除训练
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除训练 "${row.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API

    // 更新本地数据
    const index = trainingList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      trainingList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 新增训练
const handleAdd = () => {
  editForm.value = {
    id: '',
    title: '',
    description: '',
    questions: []
  }
  editDialogVisible.value = true
}

// 添加问题
const addQuestion = () => {
  const newQuestionId = Date.now()
  const newOrder = editForm.value.questions.length + 1
  editForm.value.questions.push({
    id: newQuestionId,
    content: '',
    order: newOrder,
    options: []
  })
}

// 删除问题
const removeQuestion = (index) => {
  editForm.value.questions.splice(index, 1)
  // 重新排序
  editForm.value.questions.forEach((question, idx) => {
    question.order = idx + 1
  })
}

// 添加选项
const addOption = (questionIndex) => {
  const question = editForm.value.questions[questionIndex]

  // 检查是否已达到最大选项数
  if (question.options.length >= 5) {
    ElMessage.warning('每个问题最多只能有5个选项')
    return
  }

  const newOptionId = Date.now() + Math.floor(Math.random() * 1000)
  question.options.push({
    id: newOptionId,
    content: '',
    isCorrect: false
  })
}

// 删除选项
const removeOption = (questionIndex, optionIndex) => {
  editForm.value.questions[questionIndex].options.splice(optionIndex, 1)
}

// 关闭对话框前确认
const handleCloseDialog = (done) => {
  ElMessageBox.confirm('确定要关闭吗？未保存的更改将会丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}

// 计算训练总问题数
const calculateTotalQuestions = (training) => {
  return training.questions.length
}

// 计算训练正确选项数
const calculateCorrectOptions = (training) => {
  let count = 0
  for (const question of training.questions) {
    for (const option of question.options) {
      if (option.isCorrect) {
        count++
      }
    }
  }
  return count
}

// 移动问题位置
const moveQuestion = (index, direction) => {
  const questions = editForm.value.questions
  if (direction === 'up' && index > 0) {
    // 向上移动
    [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]]
  } else if (direction === 'down' && index < questions.length - 1) {
    // 向下移动
    [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]]
  }

  // 更新顺序
  questions.forEach((question, idx) => {
    question.order = idx + 1
  })
}

// 拖拽相关
const draggedItem = ref(null)

const onDragStart = (question) => {
  draggedItem.value = question
}

const onDragOver = (event, targetQuestion) => {
  event.preventDefault()
  if (draggedItem.value && draggedItem.value.id !== targetQuestion.id) {
    const questions = editForm.value.questions
    const draggedIndex = questions.findIndex(q => q.id === draggedItem.value.id)
    const targetIndex = questions.findIndex(q => q.id === targetQuestion.id)

    // 交换位置
    questions.splice(draggedIndex, 1)
    questions.splice(targetIndex, 0, draggedItem.value)

    // 更新顺序
    questions.forEach((question, idx) => {
      question.order = idx + 1
    })
  }
}

const onDragEnd = () => {
  draggedItem.value = null
}
</script>

<template>
  <div class="training-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>情绪调节训练管理</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            添加训练
          </el-button>
        </div>
      </template>

      <!-- 训练列表 -->
      <el-table :data="trainingList" style="width: 100%" border>
        <el-table-column prop="title" label="训练标题" min-width="180" />
        <el-table-column prop="description" label="训练描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="问题数量" width="100" align="center">
          <template #default="scope">
            {{ calculateTotalQuestions(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="正确选项数" width="100" align="center">
          <template #default="scope">
            {{ calculateCorrectOptions(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :title="editForm.id ? '编辑训练' : '添加训练'" v-model="editDialogVisible" width="800px"
      :before-close="handleCloseDialog">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="训练标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="训练描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="2" />
        </el-form-item>

        <div class="questions-section">
          <div class="questions-header">
            <h4>训练问题</h4>
            <el-button type="primary" size="small" @click="addQuestion">
              <el-icon>
                <Plus />
              </el-icon>
              添加问题
            </el-button>
          </div>

          <div v-if="editForm.questions.length === 0" class="no-questions">
            <el-empty description="暂无问题，请添加问题" />
          </div>

          <el-collapse v-else accordion>
            <el-collapse-item v-for="(question, questionIndex) in editForm.questions" :key="question.id"
              draggable="true" @dragstart="onDragStart(question)" @dragover="(event) => onDragOver(event, question)"
              @dragend="onDragEnd" class="question-item-wrapper">
              <template #title>
                <div class="collapse-title-container">
                  <span class="question-title">{{ question.order }}. {{ question.content || '新问题' }}</span>
                  <div class="drag-handle">
                    <el-icon>
                      <Rank />
                    </el-icon>
                  </div>
                </div>
              </template>
              <div class="question-item">
                <div class="question-header">
                  <div class="question-order">
                    <span class="order-number">{{ question.order }}</span>

                  </div>
                  <el-input v-model="question.content" placeholder="请输入问题内容" class="question-input">
                    <template #prefix>
                      <el-icon>
                        <QuestionFilled />
                      </el-icon>
                    </template>
                  </el-input>
                  <div class="question-actions">
                    <el-button type="primary" size="small" :disabled="questionIndex === 0"
                      @click="moveQuestion(questionIndex, 'up')">
                      <el-icon>
                        <Top />
                      </el-icon>
                    </el-button>
                    <el-button type="primary" size="small" :disabled="questionIndex === editForm.questions.length - 1"
                      @click="moveQuestion(questionIndex, 'down')">
                      <el-icon>
                        <Bottom />
                      </el-icon>
                    </el-button>
                    <el-button type="danger" size="small" @click="removeQuestion(questionIndex)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </el-button>
                  </div>
                </div>

                <div class="options-section">
                  <div class="options-header">
                    <h5>问题选项</h5>
                    <el-button type="primary" size="small" @click="addOption(questionIndex)">
                      <el-icon>
                        <Plus />
                      </el-icon>
                      添加选项
                    </el-button>
                  </div>

                  <div v-if="question.options.length === 0" class="no-options">
                    <el-empty description="暂无选项，请添加选项" :image-size="60" />
                  </div>

                  <div v-else class="option-list">
                    <div v-for="(option, optionIndex) in question.options" :key="option.id" class="option-item">
                      <el-input v-model="option.content" placeholder="请输入选项内容" class="option-input" />
                      <el-switch v-model="option.isCorrect" active-text="正确" inactive-text="错误" class="option-switch" />
                      <el-button type="danger" size="small" @click="removeOption(questionIndex, optionIndex)">
                        <el-icon>
                          <Delete />
                        </el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <span class="drag-hint ">拖动 <el-icon :size="13">
              <Rank />
            </el-icon>来排列问题顺序</span>
          <div class="dialog-buttons">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.training-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.questions-section {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  background-color: #f8f9fa;
}

.questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.questions-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.no-questions {
  padding: 20px 0;
}

.question-item-wrapper {
  cursor: move;
  border-left: 3px solid transparent;
}

.question-item-wrapper:hover {
  border-left-color: #409eff;
}

.question-item {
  padding: 10px 0;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.question-order {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.question-input {
  flex: 1;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 18px;
  cursor: move;
  padding: 0 5px;
  margin-right: 10px;
}

.drag-handle:hover {
  color: #409eff;
}

.question-actions {
  display: flex;
  gap: 5px;
}

.options-section {
  margin-left: 40px;
  padding: 10px;
  border-left: 2px solid #e6e6e6;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.options-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.no-options {
  padding: 10px 0;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-input {
  flex: 1;
}

.option-switch {
  width: 120px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drag-hint {
  color: #909399;
  font-size: 13px;
  font-style: italic;
}

.dialog-buttons {
  display: flex;
  gap: 10px;
}

.collapse-title-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.question-title {
  flex: 1;
  text-align: left;
  margin-right: 10px;
}
</style>
