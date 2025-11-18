import { http } from '@/utils/request'

// 用户登录
export function login(data) {
  return http.post('/blade-auth/oauth/token', data)
}

// 用户注册
export function register(data) {
  return http.post('/user/register', data)
}

// 获取用户信息
export function getUserInfo() {
  return http.get('/user/info')
}

// 更新用户信息
export function updateUserInfo(data) {
  return http.put('/user/info', data)
}

// 退出登录
export function logout() {
  return http.post('/user/logout')
}

// 获取订单统计
export function getOrderStats() {
  return http.get('/user/order/stats')
}

// 修改密码
export function changePassword(data) {
  return http.post('/user/password', data)
}

// 获取优惠券列表
export function getCouponList(params) {
  return http.get('/user/coupon/list', params)
}