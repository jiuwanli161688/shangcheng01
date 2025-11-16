<template>
  <view class="custom-navbar" :style="navbarStyle">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px', background: backgroundColor }"></view>
    <!-- <view class="status-bar" :style="{ height: safeAreaInsets.top + 'px', background: backgroundColor }"></view> -->
    
    <!-- 导航栏内容 -->
    <view class="nav-content" :style="navContentStyle">
      <!-- 返回按钮 -->
      <view class="nav-left" @click="handleBack" v-if="showBack">
        <view class="back-btn" :class="{ 'back-btn-active': isBackPressed }" @touchstart="onBackTouchStart" @touchend="onBackTouchEnd">
          <text class="back-icon">‹</text>
          <text class="back-text" v-if="showBackText">返回</text>
        </view>
      </view>
      <view class="nav-left" v-else></view>
      
      <!-- 标题 -->
      <view class="nav-title">
        <text class="title-text" :style="{ color: titleColor }">{{ title }}</text>
      </view>
      
      <!-- 右侧操作 -->
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomNavbar',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: false,
    },
    showBackText: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    titleColor: {
      type: String,
      default: '#303133'
    }
  },
  data() {
    return {
      safeAreaInsets: 0,
      statusBarHeight: 0,
      navBarHeight: 44,
      isBackPressed: false
    }
  },
  computed: {
    navbarStyle() {
      return {
        background: this.backgroundColor,
      }
    },
    navContentStyle() {
      return {
        height: this.navBarHeight + 'px',
        background: this.backgroundColor
      }
    }
  },
  mounted() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0
      this.safeAreaInsets = systemInfo.safeAreaInsets || { top: 0, right: 0, bottom: 0, left: 0 }
      
      // 小程序胶囊按钮位置信息
      if (uni.getMenuButtonBoundingClientRect) {
        try {
          const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
          if (menuButtonInfo && menuButtonInfo.top) {
            this.navBarHeight = (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height
          }
        } catch (e) {
          console.warn('获取胶囊按钮信息失败', e)
        }
      }
      
      // 默认高度（iOS 44px, Android 48px）
      if (this.navBarHeight === 44) {
        this.navBarHeight = systemInfo.platform === 'android' ? 48 : 44
      }
    },
    
    handleBack() {
      uni.navigateBack({
        fail: () => {
          // 如果没有上一页，跳转到首页
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    },
    
    onBackTouchStart() {
      this.isBackPressed = true
    },
    
    onBackTouchEnd() {
      setTimeout(() => {
        this.isBackPressed = false
      }, 150)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/common.scss';

.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  background: $bg-color-white;
  transition: background-color 0.3s ease;
}

.status-bar {
  width: 100%;
  transition: background-color 0.3s ease;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rpx;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 0, 0, 0.06) 20%, 
      rgba(0, 0, 0, 0.06) 80%, 
      transparent 100%
    );
    opacity: 0.6;
  }
}

.nav-left {
  display: flex;
  align-items: center;
  min-width: 120rpx;
  height: 100%;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  border-radius: 12rpx;
  transition: all 0.2s ease;
  position: relative;
  
  &:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
  }
  
  &.back-btn-active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
  }
}

.back-icon {
  font-size: 48rpx;
  font-weight: 300;
  color: $text-color-primary;
  line-height: 1;
  margin-right: 4rpx;
  transition: color 0.2s ease;
}

.back-text {
  font-size: 28rpx;
  color: $text-color-regular;
  line-height: 1;
  transition: color 0.2s ease;
}

.nav-title {
  flex: 1;
  text-align: center;
  padding: 0 20rpx;
  overflow: hidden;
}

.title-text {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-color-primary;
  line-height: 1.2;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.nav-right {
  min-width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}
</style>