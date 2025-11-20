<template>
  <view class="modal-overlay" v-if="visible" @click="handleOverlayClick">
    <view class="modal-content" @click.stop>
      <view class="modal-title">手机号码修改</view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <text class="form-value">{{ phone }}</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">验证码</text>
        <view class="form-input-wrapper">
          <input
            class="form-input"
            type="number"
            placeholder="请输入短信验证码"
            v-model="verifyCode"
            maxlength="6"
          />
          <view 
            class="verify-code-btn" 
            :class="{ disabled: countdown > 0 }"
            @click="handleGetVerifyCode"
          >
            <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
          </view>
        </view>
      </view>
      
      <view class="save-btn" @click="handleSave">保存</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommonModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      verifyCode: '',
      countdown: 0,
      timer: null
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        // 弹窗关闭时清理倒计时
        this.clearTimer()
        this.verifyCode = ''
      }
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    // 获取验证码
    async handleGetVerifyCode() {
      if (this.countdown > 0) return
      
      if (!this.phone) {
        this.$showToast('手机号不能为空')
        return
      }

      try {
        this.$showLoading('发送中...')
        
        // 调用发送验证码接口
        await this.$http.post('/auth/send-verify-code', {
          phone: this.phone,
          type: 'changePhone'
        })

        this.$showToast('验证码已发送', 'success')
        
        // 开始60秒倒计时
        this.countdown = 60
        this.timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            this.clearTimer()
          }
        }, 1000)

      } catch (error) {
        console.error('发送验证码失败:', error)
      } finally {
        this.$hideLoading()
      }
    },
    
    // 清理定时器
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.countdown = 0
    },
    
    // 保存
    handleSave() {
      if (!this.verifyCode) {
        this.$showToast('请输入验证码')
        return
      }
      
      this.$emit('save', {
        phone: this.phone,
        verifyCode: this.verifyCode,
				key: 'userPhone'
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
</style>
