// 存储数据
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('存储数据失败:', e)
    return false
  }
}

// 获取数据
export function getStorage(key) {
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    console.error('获取数据失败:', e)
    return null
  }
}

// 移除数据
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('移除数据失败:', e)
    return false
  }
}

// 清空数据
export function clearStorage() {
  try {
    uni.clearStorageSync()
    return true
  } catch (e) {
    console.error('清空数据失败:', e)
    return false
  }
}

// 获取存储信息
export function getStorageInfo() {
  return new Promise((resolve, reject) => {
    uni.getStorageInfo({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}