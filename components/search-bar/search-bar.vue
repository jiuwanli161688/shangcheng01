<template>
  <view class="search-bar" :style="customStyle">
    <view class="search-container" :class="{ focus: isFocus }">
      <image class="search-icon" src="/static/icons/search.png" mode="aspectFit"></image>
      <input
        class="search-input"
        :placeholder="placeholder"
        :value="keyword"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        confirm-type="search"
      />
      <image 
        v-if="keyword" 
        class="clear-icon" 
        src="/static/icons/clear.png" 
        mode="aspectFit"
        @click="onClear"
      ></image>
    </view>
    <text class="cancel-btn" v-if="showCancel && isFocus" @click="onCancel">取消</text>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  
  props: {
    placeholder: {
      type: String,
      default: '搜索商品'
    },
    keyword: {
      type: String,
      default: ''
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      isFocus: false
    }
  },

  methods: {
    onInput(e) {
      this.$emit('input', e.detail.value)
    },

    onFocus() {
      this.isFocus = true
      this.$emit('focus')
    },

    onBlur() {
      this.isFocus = false
      this.$emit('blur')
    },

    onConfirm(e) {
      this.$emit('search', e.detail.value)
    },

    onClear() {
      this.$emit('input', '')
      this.$emit('clear')
    },

    onCancel() {
      this.isFocus = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;

  .search-container {
    flex: 1;
    display: flex;
    align-items: center;
    background: $bg-color;
    border-radius: 50rpx;
    padding: 0 20rpx;
    transition: all 0.3s;
    
    &.focus {
      background: #fff;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    }

    .search-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 10rpx;
    }

    .search-input {
      flex: 1;
      height: 60rpx;
      font-size: 28rpx;
      color: $text-color-primary;
    }

    .clear-icon {
      width: 32rpx;
      height: 32rpx;
      margin-left: 10rpx;
    }
  }

  .cancel-btn {
    margin-left: 20rpx;
    font-size: 28rpx;
    color: $text-color-regular;
  }
}
</style>