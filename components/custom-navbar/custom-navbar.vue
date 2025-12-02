<template>
  <view>
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px', background: '#F60808' }">
      <view class="navbar__content" :style="{ height: navBarHeight + 'px' }">
        <!-- 左侧返回按钮 -->
        <view v-if="showBack" class="navbar__left" @click="handleBack">
          <uni-icons type="left" size="22" :color="iconColor" />
        </view>
        
        <!-- 中间标题 -->
        <view class="navbar__title" :style="{ textAlign, color }">
          <text class="navbar__title-text" :style="{ color }">{{ title }}</text>
        </view>
        
        <!-- 右侧占位，保持标题居中 -->
        <view class="navbar__right">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
    
    <!-- 占位元素，防止内容被导航栏遮挡 -->
    <view :style="{ height: statusBarHeight + navBarHeight + 'px' }"></view>
  </view>

</template>

<script>

export default {
  name: 'CustomNavbar',
  props: {
    // 标题文字
    title: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: '#fff'
    },
    textAlign: {
      type: String,
      default: 'center'
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      statusBarHeight: 20,
      navBarHeight: 44
    }
  },
  created() {
    this.initNavbarHeight()
  },
  methods: {
    // 初始化导航栏高度
    initNavbarHeight() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 20
      
      // #ifdef MP-WEIXIN
      // 微信小程序获取胶囊按钮位置
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.navBarHeight = (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height
      // #endif
      
      // #ifndef MP-WEIXIN
      this.navBarHeight = 44
      // #endif
    },
    
    // 返回上一页
    handleBack() {
      if (!this.showBack) return
      
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        // 没有上一页时返回首页
        uni.reLaunch({ url: '/pages/index/index' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  
  &__content {
    display: flex;
    align-items: center;
    padding: 0 16rpx;
  }
  
  &__left,
  &__right {
    width: 80rpx;
    display: flex;
    align-items: center;
  }
  
  &__left {
    justify-content: flex-start;
  }
  
  &__right {
    justify-content: flex-end;
  }
  
  &__title {
    flex: 1;
    text-align: center;
    overflow: hidden;
    
    &-text {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
