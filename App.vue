<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    
    // 检查登录状态
    this.checkLoginStatus()
    
    // 获取系统信息
    this.getSystemInfo()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      if (token) {
        // this.$store.dispatch('user/getUserInfo')
      }
    },
    
    // 获取系统信息
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          this.$store.commit('common/SET_SYSTEM_INFO', res)
          // 设置状态栏高度
          if (res.statusBarHeight) {
            uni.setStorageSync('statusBarHeight', res.statusBarHeight)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 引入样式文件 */
@import '@/styles/common.scss';

/* 全局样式 */
page {
  background-color: $bg-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 
               'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 
               SimSun, sans-serif;
}

/* 通用样式 */
.container {
  padding: 0 30rpx;
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-multi-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 价格样式 */
.price {
  color: $primary-color;
  font-weight: bold;
  
  &.original {
    color: $text-color-light;
    text-decoration: line-through;
    font-size: 24rpx;
    margin-left: 10rpx;
  }
}

/* 按钮样式 */
.btn {
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  text-align: center;
  font-size: 28rpx;
  
  &.btn-primary {
    background: $primary-color;
    color: #fff;
  }
  
  &.btn-disabled {
    color: $text-color-light;
  }
}
</style>