export default {
  data() {
    return {}
  },
  
  methods: {
    // 检查登录状态
    $checkLogin() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showModal({
          title: '提示',
          content: '请先登录',
          showCancel: false,
          success: () => {
            uni.navigateTo({
              url: '/subpackages/auth/pages/login'
            })
          }
        })
        return false
      }
      return true
    },
    
    // 格式化价格
    $formatPrice(price) {
      if (typeof price !== 'number') {
        price = parseFloat(price) || 0
      }
      return '¥' + price.toFixed(2)
    },
    
    // 格式化时间
    $formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
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
    },
    
    // 显示提示信息
    $showToast(title, icon = 'none') {
      uni.showToast({
        title,
        icon,
        duration: 2000
      })
    },
    
    // 显示加载框
    $showLoading(title = '加载中...') {
      uni.showLoading({
        title,
        mask: true
      })
    },
    
    // 隐藏加载框
    $hideLoading() {
      uni.hideLoading()
    },
    
    // 防抖函数
    $debounce(fn, delay = 500) {
      let timer = null
      return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, delay)
      }
    },
    
    // 节流函数
    $throttle(fn, delay = 500) {
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
  }
}