<template>
  <view class="empty-state">
    <image class="empty-image" :src="image" mode="aspectFit"></image>
    <text class="empty-title">{{ title }}</text>
    <text class="empty-tip" v-if="tip">{{ tip }}</text>
    <view class="empty-action" v-if="showAction" @click="handleAction">
      <text class="action-text">{{ actionText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  
  props: {
    image: {
      type: String,
      default: '/static/images/empty-cart.png'
    },
    title: {
      type: String,
      default: '暂无数据'
    },
    tip: {
      type: String,
      default: ''
    },
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: '去逛逛'
    }
  },

  methods: {
    handleAction() {
      this.$emit('action')
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
    opacity: 0.6;
  }

  .empty-title {
    font-size: 32rpx;
    color: $text-color-light;
    margin-bottom: 20rpx;
  }

  .empty-tip {
    font-size: 26rpx;
    color: $text-color-placeholder;
    margin-bottom: 40rpx;
  }

  .empty-action {
    .action-text {
      font-size: 28rpx;
      color: $primary-color;
      padding: 16rpx 32rpx;
      border: 1rpx solid $primary-color;
    }
  }
}
</style>