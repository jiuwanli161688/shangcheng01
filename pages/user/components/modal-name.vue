<template>
  <view class="modal-overlay" v-if="visible" @click="handleOverlayClick">
    <view class="modal-content" @click.stop>
      <view class="modal-title">昵称修改</view>
      <input
        class="form-input"
        type="text"
        v-model="userName"
      />
			<view class="tips">请点击上方昵称进行修改</view>
      <view class="save-btn" @click="handleSave">保存</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommonModalName',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userName: '',
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.userName = ''
      } else {
        this.userName = this.name || '';
      }
    },
  },
  methods: {
    // 保存
    handleSave() {
      if (!this.userName) {
        this.$showToast('请输入昵称')
        return
      }
      
      this.$emit('save', {
        yhnc: this.userName,
				key: 'yhnc'
      })
    },
    
    // 点击遮罩层
    handleOverlayClick() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 90%;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  box-sizing: border-box;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #000000;
  margin-bottom: 48rpx;
}

.form-item {
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
}

.form-label {
  font-size: 30rpx;
  color: #000000;
  width: 120rpx;
  flex-shrink: 0;
}

.form-value {
  font-size: 30rpx;
  color: #888888;
  flex: 1;
}

.form-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.form-input {
  flex: 1;
  font-size: 30rpx;
  color: #000000;
  padding: 0;
  height: 60rpx;
  line-height: 60rpx;
}

.verify-code-btn {
  padding: 12rpx 24rpx;
  background-color: #f60808;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #ffffff;
  white-space: nowrap;
  flex-shrink: 0;
}

.verify-code-btn.disabled {
  background-color: #cccccc;
  color: #ffffff;
}

.save-btn {
  width: 92%;
  height: 80rpx;
  background-color: #f60808;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #ffffff;
  margin: 48rpx auto 0;
}

.form-input {
	text-align: center;
}

.tips {
	font-size: 24rpx;
	margin: 10rpx auto 0;
	text-align: center;
	color: #aaa;
}
</style>
