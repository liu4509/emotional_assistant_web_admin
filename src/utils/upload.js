import { ElMessage } from 'element-plus'

/**
 * 图片上传前的验证处理
 * @param {File} file 文件对象
 * @param {Object} options 配置选项
 * @param {number} options.maxSize 最大文件大小(MB)
 * @param {string[]} options.acceptTypes 接受的文件类型
 * @returns {boolean} 是否通过验证
 */
export const validateImageUpload = (file, options = {}) => {
  const { maxSize = 2, acceptTypes = ['image/jpeg', 'image/png'] } = options

  if (!file) {
    ElMessage.error('请选择要上传的文件')
    return false
  }

  // 检查文件类型
  const isValidType = acceptTypes.includes(file.type)
  if (!isValidType) {
    ElMessage.error(`只能上传 ${acceptTypes.join('、')} 格式的图片!`)
    return false
  }

  // 检查文件大小
  const isLtMax = file.size / 1024 / 1024 < maxSize
  if (!isLtMax) {
    ElMessage.error(`图片大小不能超过 ${maxSize}MB!`)
    return false
  }

  return true
}

/**
 * 上传图片
 * @param {File} file 文件对象
 * @param {Object} options 配置选项
 * @param {string} options.action 上传地址
 * @param {Object} options.headers 请求头
 * @param {number} options.maxSize 最大文件大小(MB)
 * @param {string[]} options.acceptTypes 接受的文件类型
 * @returns {Promise<string>} 图片URL
 */
export const uploadImage = async (file, options = {}) => {
  const {
    action = '/api/upload',
    headers = {},
    maxSize = 2,
    acceptTypes = ['image/jpeg', 'image/png'],
  } = options

  // 上传前验证
  if (!validateImageUpload(file, { maxSize, acceptTypes })) {
    return Promise.reject(new Error('图片验证失败'))
  }

  // 创建表单数据
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(action, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const data = await response.json()

    if (data.code === 200 && data.data?.url) {
      ElMessage.success('上传成功')
      return data.data.url
    } else {
      throw new Error(data.message || '上传失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '上传失败，请重试')
    return Promise.reject(error)
  }
}

/**
 * 创建自定义上传处理器
 * @param {Object} options 配置选项
 * @returns {Object} Element Plus Upload 组件的处理器
 */
export const createUploadHandler = (options = {}) => {
  return {
    beforeUpload: (file) => validateImageUpload(file, options),
    customUpload: async (file) => {
      try {
        const url = await uploadImage(file, options)
        return { url }
      } catch (error) {
        return Promise.reject(error)
      }
    },
  }
}
