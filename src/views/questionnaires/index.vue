<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Edit, QuestionFilled } from '@element-plus/icons-vue'
import { getQuestionnaireList, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire } from '@/api/questionnaire'

defineOptions({
  name: 'QuestionnaireManagement'
})

// 加载状态
const loading = ref(false)

// 问卷列表
const questionnaireList = ref([])

// 获取问卷列表
const fetchQuestionnaireList = async () => {
  try {
    loading.value = true
    const res = await getQuestionnaireList()
    if (res.code === 200 || res.code === 201) {
      questionnaireList.value = res.data
    } else {
      ElMessage.error(res.message || '获取问卷列表失败')
    }
  } catch (error) {
    console.error('获取问卷列表失败:', error)
    ElMessage.error('获取问卷列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取问卷列表
onMounted(() => {
  fetchQuestionnaireList()
})

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  description: '',
  questions: []
})

// 保存按钮加载状态
const saveLoading = ref(false)

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

    saveLoading.value = true

    let res
    if (editForm.value.id) {
      // 更新问卷
      res = await updateQuestionnaire(editForm.value.id, {
        title: editForm.value.title,
        description: editForm.value.description,
        questions: editForm.value.questions
      })

      if (res.code === 200 || res.code === 201) {
        ElMessage.success('更新成功')
        await fetchQuestionnaireList() // 重新获取列表
        editDialogVisible.value = false
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 新增问卷
      res = await createQuestionnaire({
        title: editForm.value.title,
        description: editForm.value.description,
        questions: editForm.value.questions.map(q => ({
          content: q.content,
          options: q.options.map(o => ({
            content: o.content,
            score: o.score
          }))
        }))
      })

      if (res.code === 200 || res.code === 201) {
        ElMessage.success('添加成功')
        await fetchQuestionnaireList() // 重新获取列表
        editDialogVisible.value = false
      } else {
        ElMessage.error(res.message || '添加失败')
      }
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请检查表单填写是否正确')
  } finally {
    saveLoading.value = false
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

    const res = await deleteQuestionnaire(row.id)
    if (res.code === 200 || res.code === 201) {
      ElMessage.success('删除成功')
      await fetchQuestionnaireList() // 重新获取列表
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
    <el-card v-loading="loading">
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
        <el-table-column label="创建时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.createTime).toLocaleString() }}
          </template>
        </el-table-column>
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
          <el-button @click="editDialogVisible = false" :disabled="saveLoading">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
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
