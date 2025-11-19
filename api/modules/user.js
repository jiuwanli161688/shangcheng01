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
  return http.post('/yhb/updateYhInfo', data)
}
// 获取用户信息
export function getUserInfo() {
  return http.get('/yhb/getYhInfo')
  // return http.get('/yhscb/addSc')
}
/*
{
	"avatar": "",
	"birthday": "",
	"email": "",
	"qm": "",
	"rzbz": 0,
	"rzsj": "",
	"sex": 0,
	"sjId": 0,
	"sjhm": "",
	"status": 0,
	"sysRoleId": 0,
	"tenantId": "",
	"userId": 0,
	"userSjList": [
		{
			"kfdh": "",
			"lastAccessTime": "",
			"sjLogo": "",
			"sjid": 0,
			"sjjc": "",
			"sjjj": "",
			"sjmc": "",
			"xxdz": ""
		}
	],
	"yhnc": "",
	"yhsm": "",
	"yhzh": "",
	"zhYeb": {
		"hongbaoNum": 0,
		"kaquanNum": 0,
		"ljtx": 0,
		"remark": "",
		"userId": 0,
		"zhye": 0,
		"zsye": 0
	}
}
*/

// 用户注册
export function register(data) {
  return http.post('/user/register', data)
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