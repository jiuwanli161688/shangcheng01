const BASE_URL = 'https://cxjpft.zxdr.cc'

class Request {
  constructor() {
    this.interceptors = {
      request: [],
      response: []
    }
  }

  // 添加请求拦截器
  useRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  // 添加响应拦截器
  useResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }

  // 执行拦截器
  async runInterceptors(type, config) {
    let result = config
    for (const interceptor of this.interceptors[type]) {
      result = await interceptor(result)
    }
    return result
  }

  async request(options) {
    try {
      // 请求拦截
      let requestOptions = await this.runInterceptors('request', options)
      
      return new Promise((resolve, reject) => {
        console.log("请求收到---request", requestOptions)
        uni.request({
          url: BASE_URL + requestOptions.url,
          method: requestOptions.method || 'GET',
          data: requestOptions.data || {},
          header: {
            // 'Content-Type': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            ...requestOptions.header
          },
          success: async (res) => {
            // 响应拦截
            const response = await this.runInterceptors('response', res)
            if (response.statusCode === 200) {
              resolve(response.data)
            } else {
              reject(response)
            }
          },
          fail: (err) => {
            uni.showToast({
              title: '网络请求失败',
              icon: 'none'
            })
            reject(err)
          }
        })
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }
}

// 创建请求实例
const request = new Request()

// 添加请求拦截器 - token
request.useRequestInterceptor((config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
})

// 添加请求拦截器 - 超时设置
request.useRequestInterceptor((config) => {
  config.timeout = config.timeout || 10000
  return config
})

// 添加请求拦截器 - 加载提示
request.useRequestInterceptor((config) => {
  if (config.showLoading !== false) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  return config
})

// 添加响应拦截器 - 错误处理
request.useResponseInterceptor((response) => {
  // 隐藏加载提示
  uni.hideLoading()
  
  if (response.data.code === 401) {
    // token失效，跳转到登录页
    uni.removeStorageSync('token')
    uni.showModal({
      title: '提示',
      content: '登录已过期，请重新登录',
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: '/pages/auth/login'
        })
      }
    })
    return Promise.reject(response)
  }
  
  if (response.data.code !== 200 && response.data.code !== 0) {
    uni.showToast({
      title: response.data.message || '请求失败',
      icon: 'none'
    })
    return Promise.reject(response)
  }
  
  return response
})

export const http = request