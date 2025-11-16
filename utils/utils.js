// 格式化价格
export function formatPrice(price) {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0
  }
  return '¥' + price.toFixed(2)
}

// 格式化时间
export function formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hour.toString().padStart(2, '0'))
    .replace('mm', minute.toString().padStart(2, '0'))
    .replace('ss', second.toString().padStart(2, '0'))
}

// 防抖函数
export function debounce(fn, delay = 500) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
export function throttle(fn, delay = 500) {
  let timer = null
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime > delay) {
      fn.apply(this, args)
      lastTime = now
    } else {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
        lastTime = now
      }, delay)
    }
  }
}

// 深拷贝
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const newObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepClone(obj[key])
      }
    }
    return newObj
  }
}

// 生成随机ID
export function generateId() {
  return Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
}

// 手机号脱敏
export function maskPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 计算距离当前时间
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(new Date(time)) / 1000
  if (between < 3600) {
    return ~~(between / 60) + '分钟前'
  } else if (between < 86400) {
    return ~~(between / 3600) + '小时前'
  } else {
    return ~~(between / 86400) + '天前'
  }
}