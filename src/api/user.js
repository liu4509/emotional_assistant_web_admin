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
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data,
  })
}

/**
 * 更新用户密码
 * @param {Object} data - 用户密码
 * @returns {Promise}
 */
export function updateUserPwd(data) {
  return request({
    url: '/user/admin/update_password',
    method: 'post',
    data,
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
