import store from "@/store";

const BASE_URL = "https://cxjpft.zxdr.cc";

function getAuthToken() {
  console.log("开始获取token", store.token);
  return store.token ? store.token : "";
}

class Request {
  constructor() {
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  // 添加请求拦截器
  useRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // 添加响应拦截器
  useResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // 执行拦截器
  async runInterceptors(type, config) {
    let result = config;
    for (const interceptor of this.interceptors[type]) {
      result = await interceptor(result);
    }
    return result;
  }

  async request(options) {
    try {
      // 请求拦截
      let requestOptions = await this.runInterceptors("request", options);
      const token = getAuthToken();

      return new Promise((resolve, reject) => {
        console.log("请求收到---request", requestOptions);
        uni.request({
          url: BASE_URL + requestOptions.url,
          method: requestOptions.method || "GET",
          data: requestOptions.data || {},
          header: {
            Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
            'Blade-Auth': token ? `bearer ${token}` : "bearer ",
            token: token,

            // 'Content-Type': 'application/json',
            "Content-Type": requestOptions.contentType
              ? requestOptions.contentType
              : "application/x-www-form-urlencoded",
            ...requestOptions.header,
          },
          success: async (res) => {
            console.log("响应request", res);
            if (res.statusCode === 200) {
              if (res.data && res.data.code && res.data.code !== 200) {
                uni.hideLoading();
                uni.showToast({
                  title: res.data.msg,
                  icon: "none",
                });
                reject(res);
                return;
              }
              resolve(res);
            } else {
              reject(res);
            }
          },
          fail: (err) => {
            uni.showToast({
              title: "网络请求失败",
              icon: "none",
            });
            reject(err);
          },
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: "GET",
      data,
      ...options,
    });
  }

  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: "POST",
      data,
      ...options,
    });
  }

  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: "PUT",
      data,
      ...options,
    });
  }

  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: "DELETE",
      data,
      ...options,
    });
  }
}

// 创建请求实例
const request = new Request();

// 添加请求拦截器 - token
request.useRequestInterceptor((config) => {
  const token = uni.getStorageSync("token");
  if (token) {
    config.header = {
      ...config.header,
      'Blade-Auth': `Bearer ${token}`,
      token,
    };
  }
  return config;
});

// 添加请求拦截器 - 超时设置
request.useRequestInterceptor((config) => {
  config.timeout = config.timeout || 10000;
  return config;
});

// 添加请求拦截器 - 加载提示
request.useRequestInterceptor((config) => {
  if (config.showLoading !== false) {
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
  }
  return config;
});

// 添加响应拦截器 - 错误处理
request.useResponseInterceptor((response) => {
  // 隐藏加载提示
  uni.hideLoading();

  if (response.data.code === 401) {
    // token失效，跳转到登录页
    uni.removeStorageSync("token");
    uni.showModal({
      title: "提示",
      content: "登录已过期，请重新登录",
      showCancel: false,
      success: () => {
        // uni.navigateTo({
        //   url: '/pages/auth/login'
        // })
      },
    });
    return Promise.reject(response);
  }

  if (response.data.code !== 200 && response.data.code !== 0) {
    uni.showToast({
      title: response.data.message || "请求失败",
      icon: "none",
    });
    return Promise.reject(response);
  }

  return response;
});

export const http = request;
