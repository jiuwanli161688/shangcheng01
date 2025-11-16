// 获取token
export function getToken() {
  return uni.getStorageSync('token')
}

// 设置token
export function setToken(token) {
  return uni.setStorageSync('token', token)
}

// 移除token
export function removeToken() {
  return uni.removeStorageSync('token')
}

// 检查登录状态
export function checkLogin() {
  const token = getToken()
  if (!token) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: '/pages/auth/login'
        })
      }
    })
    return false
  }
  return true
}

// 微信登录
export function wxLogin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        resolve(res.code)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取用户信息
export function getUserProfile() {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}