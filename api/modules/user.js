import { http } from '@/utils/request'

// 用户登录
export function login(data) {
  return http.post('/blade-auth/oauth/token', data, { contentType: 'application/x-www-form-urlencoded' })
}

// 更新用户信息
/**
 * 
{
  "avatar": "",
  "sex": 0,
  "sjhm": "",
  "smsCode": "",
  "yhnc": ""
}
 */
export function updateUserInfo(data) {
  return http.post('/yonghu/yhb/updateYhInfo', data, { contentType: 'application/json' })
}
// 获取用户信息
export function getUserInfo() {
  return http.get('/yonghu/yhb/getYhInfo')
}
// 退出登录
export function logout() {
  return http.get('/blade-auth/oauth/logout')
}
// 获取钱包余额
export function getWalltApi() {
  return http.get('/yonghu/yhzhYeb/getInfo')
}

