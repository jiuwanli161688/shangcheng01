<template>
  <view class="loading" v-if="show">
    <view class="loading-content">
      <view class="loading-spinner"></view>
      <text class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Loading',
  
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .loading-content {
    background: #fff;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .loading-spinner {
      width: 60rpx;
      height: 60rpx;
      border: 4rpx solid $border-color-light;
      border-top: 4rpx solid $primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20rpx;
    }

    .loading-text {
      font-size: 28rpx;
      color: $text-color-regular;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>