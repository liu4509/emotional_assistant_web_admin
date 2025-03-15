<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Edit, QuestionFilled } from '@element-plus/icons-vue'

defineOptions({
  name: 'QuestionnaireManagement'
})

// 问卷列表
const questionnaireList = ref([
  {
    id: 3,
    title: '日常心情评估',
    description: '评估您当前的心情状态，帮助您了解自己的情绪变化。',
    createTime: '2024-03-15 10:00:00',
    questions: [
      {
        id: 301,
        content: '您现在感觉如何？',
        options: [
          { id: 3001, content: '非常快乐', score: 5 },
          { id: 3002, content: '快乐', score: 4 },
          { id: 3003, content: '一般', score: 3 },
          { id: 3004, content: '悲伤', score: 2 },
          { id: 3005, content: '非常悲伤', score: 1 }
        ]
      },
      {
        id: 302,
        content: '您是否感到焦虑或紧张？',
        options: [
          { id: 3006, content: '从不', score: 5 },
          { id: 3007, content: '很少', score: 4 },
          { id: 3008, content: '有时', score: 3 },
          { id: 3009, content: '经常', score: 2 },
          { id: 3010, content: '总是', score: 1 }
        ]
      },
      {
        id: 303,
        content: '您现在的心情是平静的还是烦躁的？',
        options: [
          { id: 3011, content: '非常平静', score: 5 },
          { id: 3012, content: '平静', score: 4 },
          { id: 3013, content: '一般', score: 3 },
          { id: 3014, content: '烦躁', score: 2 },
          { id: 3015, content: '非常烦躁', score: 1 }
        ]
      },
      {
        id: 304,
        content: '您对未来的态度是乐观的还是悲观的？',
        options: [
          { id: 3016, content: '非常乐观', score: 5 },
          { id: 3017, content: '乐观', score: 4 },
          { id: 3018, content: '中立', score: 3 },
          { id: 3019, content: '悲观', score: 2 },
          { id: 3020, content: '非常悲观', score: 1 }
        ]
      },
      {
        id: 305,
        content: '您现在是否有压力感？',
        options: [
          { id: 3021, content: '没有压力', score: 5 },
          { id: 3022, content: '轻微压力', score: 4 },
          { id: 3023, content: '中等压力', score: 3 },
          { id: 3024, content: '较大压力', score: 2 },
          { id: 3025, content: '极大压力', score: 1 }
        ]
      },
    ]
  },
  {
    id: 1,
    title: '日常心情评估',
    description: '评估您当前的心情状态，帮助您了解自己的情绪变化。',
    createTime: '2024-03-15 10:00:00',
    questions: [
      {
        id: 101,
        content: '今天您的心情如何？',
        options: [
          { id: 1001, content: '非常好', score: 5 },
          { id: 1002, content: '比较好', score: 4 },
          { id: 1003, content: '一般', score: 3 },
          { id: 1004, content: '不太好', score: 2 },
          { id: 1005, content: '非常糟糕', score: 1 }
        ]
      },
      {
        id: 102,
        content: '您今天的压力水平如何？',
        options: [
          { id: 1006, content: '没有压力', score: 5 },
          { id: 1007, content: '轻微压力', score: 4 },
          { id: 1008, content: '中等压力', score: 3 },
          { id: 1009, content: '较大压力', score: 2 },
          { id: 1010, content: '极度压力', score: 1 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '工作压力评估',
    description: '评估您在工作中的压力水平，帮助您更好地管理工作压力。',
    createTime: '2024-03-16 14:30:00',
    questions: [
      {
        id: 201,
        content: '您对当前工作满意度如何？',
        options: [
          { id: 2001, content: '非常满意', score: 5 },
          { id: 2002, content: '比较满意', score: 4 },
          { id: 2003, content: '一般', score: 3 },
          { id: 2004, content: '不太满意', score: 2 },
          { id: 2005, content: '非常不满意', score: 1 }
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
  title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入问卷描述', trigger: 'blur' }]
}

// 表单引用
const editFormRef = ref(null)

// 打开编辑对话框
const handleEdit = (row) => {
  // 深拷贝问卷数据，避免直接修改原数据
  editForm.value = JSON.parse(JSON.stringify(row))
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
    }

    // TODO: 调用保存API

    // 更新本地数据
    const index = questionnaireList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      questionnaireList.value[index] = { ...editForm.value }
    } else {
      // 新增
      questionnaireList.value.push({
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

// 删除问卷
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除问卷 "${row.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API

    // 更新本地数据
    const index = questionnaireList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      questionnaireList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 新增问卷
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
  editForm.value.questions.push({
    id: newQuestionId,
    content: '',
    options: []
  })
}

// 删除问题
const removeQuestion = (index) => {
  editForm.value.questions.splice(index, 1)
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
    score: 3 // 默认分值
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

// 计算问卷总分值
const calculateTotalScore = (questionnaire) => {
  let totalScore = 0
  for (const question of questionnaire.questions) {
    for (const option of question.options) {
      totalScore += option.score
    }
  }
  return totalScore
}
</script>

<template>
  <div class="questionnaire-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>心情问卷管理</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            添加问卷
          </el-button>
        </div>
      </template>

      <!-- 问卷列表 -->
      <el-table :data="questionnaireList" style="width: 100%" border>
        <el-table-column prop="title" label="问卷标题" min-width="180" />
        <el-table-column prop="description" label="问卷描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="问题数量" width="100" align="center">
          <template #default="scope">
            {{ scope.row.questions.length }}
          </template>
        </el-table-column>
        <el-table-column label="总分值" width="100" align="center">
          <template #default="scope">
            {{ calculateTotalScore(scope.row) }}
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
    <el-dialog :title="editForm.id ? '编辑问卷' : '添加问卷'" v-model="editDialogVisible" width="800px"
      :before-close="handleCloseDialog">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="问卷标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item label="问卷描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="2" />
        </el-form-item>

        <div class="questions-section">
          <div class="questions-header">
            <h4>问卷问题</h4>
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
              :title="question.content || '新问题'">
              <div class="question-item">
                <div class="question-header">
                  <el-input v-model="question.content" placeholder="请输入问题内容" class="question-input">
                    <template #prefix>
                      <el-icon>
                        <QuestionFilled />
                      </el-icon>
                    </template>
                  </el-input>
                  <el-button type="danger" size="small" @click="removeQuestion(questionIndex)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
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
                      <el-input-number v-model="option.score" :min="1" :max="5" size="small" class="score-input" />
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
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.questionnaire-container {
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

.question-item {
  padding: 10px 0;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.question-input {
  flex: 1;
}

.options-section {
  margin-left: 20px;
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

.score-input {
  width: 120px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
