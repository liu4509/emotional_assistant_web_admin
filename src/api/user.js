import request from '@/utils/request'

/**
 * 管理员登录
 * @param {Object} data
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/user/admin/login',
    method: 'post',
    data,
  })
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

/**
 * 管理员更新用户信息
 * @param {Object} data
 * @param {number} data.id - 用户ID
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱
 * @param {string} data.avatar - 头像
 * @returns {Promise}
 */
export function adminUpdateUser(data) {
  return request({
    url: '/user/admin/update',
    method: 'post',
    data,
  })
}

/**
 * 更新管理员密码
 * @param {Object} data
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export function updateAdminPassword(data) {
  return request({
    url: '/user/admin/update_password',
    method: 'post',
    data,
  })
}

/**
 * 获取用户列表（管理员）
 * @param {Object} params
 * @param {number} params.pageNo - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.username - 用户名（可选）
 * @param {string} params.email - 邮箱（可选）
 * @returns {Promise}
 */
export function getUserList(params) {
  return request({
    url: '/user/admin/list',
    method: 'get',
    params,
  })
}

/**
 * 验证码发送
 * @param {Object} params
 * @param {string} params.address - 邮箱地址
 * @param {number} params.ttl - 过期时间 （可选）
 * @returns {Promise}
 */
export function sendVerifyCodeAPI(params) {
  return request({
    url: '/user/register-captcha',
    method: 'get',
    params,
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}
