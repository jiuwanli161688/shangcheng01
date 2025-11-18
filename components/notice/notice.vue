<template>
  <view class="scroll-notice" :style="containerStyle" @click="handleClick">
    <!-- 添加固定在左侧的小喇叭图标 -->
    <view class="horn-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    </view>
    <!-- 调整滚动内容的布局，从图标右侧开始 -->
    <view class="scroll-container">
      <view class="notice-content" :class="{ 'paused': isPaused }" :style="contentStyle">
        {{ text }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Notice',
  props: {
    text: {
      type: String,
      default: '这是一条重要公告，请注意查看相关信息'
    },
    duration: {
      type: Number,
      default: 10
    },
		backgroundColor: {
		  type: String,
		  default: '#ffffff'
		},
		textColor: {
		  type: String,
		  default: '#000000'
		},
  },
  data() {
    return {
      isPaused: false
    }
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.backgroundColor,
        height: '60rpx'
      }
    },
    contentStyle() {
      return {
        color: this.textColor,
        animationDuration: `${this.duration}s`
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    pause() {
      this.isPaused = true
    },
    play() {
      this.isPaused = false
    }
  }
}
</script>

<style scoped>
.scroll-notice {
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20rpx;
}

/* 添加小喇叭图标样式 */
.horn-icon {
  flex-shrink: 0;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-right: 16rpx;
  z-index: 2;
}

/* 调整滚动容器布局 */
.scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.notice-content {
  white-space: nowrap;
  font-size: 28rpx;
  line-height: 1.4;
  animation: scroll-left 10s linear infinite;
  transform: translateX(100%);
}

.notice-content.paused {
  animation-play-state: paused;
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>