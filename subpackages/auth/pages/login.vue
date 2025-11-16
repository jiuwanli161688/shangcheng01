<template>
  <view class="page-login">
    <!-- 背景装饰 -->
    <view class="login-bg">
      <view class="bg-circle circle-1"></view>
      <view class="bg-circle circle-2"></view>
      <view class="bg-circle circle-3"></view>
    </view>

    <!-- 登录表单 -->
    <view class="login-container">
      <!-- 头部 -->
      <view class="login-header">
        <text class="login-title">欢迎登录</text>
        <text class="login-subtitle">登录后享受更多服务</text>
      </view>

      <!-- 表单 -->
      <view class="login-form">
        <!-- 手机号输入 -->
        <view class="form-item">
          <image class="item-icon" src="/static/icons/phone.png" mode="aspectFit"></image>
          <input
            class="form-input"
            type="number"
            placeholder="请输入手机号"
            v-model="loginForm.phone"
            maxlength="11"
          />
          <view class="clear-btn" v-if="loginForm.phone" @click="loginForm.phone = ''">
            <image src="/static/icons/clear.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 密码输入 -->
        <view class="form-item">
          <image class="item-icon" src="/static/icons/password.png" mode="aspectFit"></image>
          <input
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            v-model="loginForm.password"
            maxlength="20"
          />
          <view class="password-toggle" @click="showPassword = !showPassword">
            <image :src="showPassword ? '/static/icons/eye-open.png' : '/static/icons/eye-close.png'" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 验证码登录 -->
        <view class="form-item" v-if="loginType === 'code'">
          <image class="item-icon" src="/static/icons/verify-code.png" mode="aspectFit"></image>
          <input
            class="form-input"
            type="number"
            placeholder="请输入验证码"
            v-model="loginForm.verifyCode"
            maxlength="6"
          />
          <view class="verify-code-btn" :class="{ disabled: countdown > 0 }" @click="getVerifyCode">
            <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
          </view>
        </view>

        <!-- 登录方式切换 -->
        <view class="login-type-switch">
          <text 
            class="switch-item" 
            :class="{ active: loginType === 'password' }"
            @click="switchLoginType('password')"
          >
            密码登录
          </text>
          <text class="switch-divider">|</text>
          <text 
            class="switch-item" 
            :class="{ active: loginType === 'code' }"
            @click="switchLoginType('code')"
          >
            验证码登录
          </text>
        </view>

        <!-- 登录按钮 -->
        <view class="login-btn" :class="{ disabled: !canLogin }" @click="handleLogin">
          <text>登录</text>
        </view>

        <!-- 其他登录方式 -->
        <view class="other-login">
          <view class="other-login-title">
            <view class="title-line"></view>
            <text class="title-text">其他登录方式</text>
            <view class="title-line"></view>
          </view>
          <view class="login-methods">
            <view class="method-item" @click="handleWechatLogin">
              <image src="/static/icons/wechat.png" mode="aspectFit"></image>
              <text>微信</text>
            </view>
            <!-- 可以添加更多登录方式 -->
          </view>
        </view>

        <!-- 注册和忘记密码 -->
        <view class="login-footer">
          <text class="footer-link" @click="handleRegister">立即注册</text>
          <text class="footer-link" @click="handleForgetPassword" v-if="loginType === 'password'">忘记密码</text>
        </view>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <view class="agreement-check" @click="agreementChecked = !agreementChecked">
        <image 
          :src="agreementChecked ? '/static/icons/selected.png' : '/static/icons/unselected.png'" 
          mode="aspectFit"
        ></image>
      </view>
      <text class="agreement-text">
        我已阅读并同意
        <text class="agreement-link" @click="handleAgreementClick('user')">《用户协议》</text>
        和
        <text class="agreement-link" @click="handleAgreementClick('privacy')">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loginType: 'password', // password: 密码登录, code: 验证码登录
      loginForm: {
        phone: '',
        password: '',
        verifyCode: ''
      },
      showPassword: false,
      countdown: 0,
      agreementChecked: false,
      timer: null
    }
  },

  computed: {
    // 是否可以登录
    canLogin() {
      if (!this.agreementChecked) return false
      
      if (this.loginType === 'password') {
        return this.loginForm.phone && this.loginForm.password
      } else {
        return this.loginForm.phone && this.loginForm.verifyCode
      }
    }
  },

  onLoad(options) {
    // 如果有回调页面，保存起来
    if (options.redirect) {
      this.redirectUrl = decodeURIComponent(options.redirect)
    }
  },

  onUnload() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    ...mapActions('user', ['login']),

    // 切换登录方式
    switchLoginType(type) {
      if (this.loginType === type) return
      
      this.loginType = type
      // 清空表单
      this.loginForm.password = ''
      this.loginForm.verifyCode = ''
    },

    // 获取验证码
    async getVerifyCode() {
      if (this.countdown > 0) return
      
      if (!this.loginForm.phone) {
        this.$showToast('请输入手机号')
        return
      }

      if (!/^1[3-9]\d{9}$/.test(this.loginForm.phone)) {
        this.$showToast('手机号格式不正确')
        return
      }

      try {
        this.$showLoading('发送中...')
        
        await this.$http.post('/auth/send-verify-code', {
          phone: this.loginForm.phone,
          type: 'login'
        })

        this.$showToast('验证码已发送', 'success')
        
        // 开始倒计时
        this.countdown = 60
        this.timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(this.timer)
          }
        }, 1000)

      } catch (error) {
        console.error('发送验证码失败:', error)
      } finally {
        this.$hideLoading()
      }
    },

    // 处理登录
    async handleLogin() {
      if (!this.canLogin) {
        if (!this.agreementChecked) {
          this.$showToast('请先同意用户协议和隐私政策')
          return
        }
        this.$showToast('请填写完整信息')
        return
      }

      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.phone)) {
        this.$showToast('手机号格式不正确')
        return
      }

      try {
        this.$showLoading('登录中...')

        let loginData = {}
        if (this.loginType === 'password') {
          loginData = {
            phone: this.loginForm.phone,
            password: this.loginForm.password,
            type: 'password'
          }
        } else {
          loginData = {
            phone: this.loginForm.phone,
            verifyCode: this.loginForm.verifyCode,
            type: 'verifyCode'
          }
        }

        const res = await this.login(loginData)

        this.$showToast('登录成功', 'success')

        // 登录成功后的处理
        setTimeout(() => {
          if (this.redirectUrl) {
            // 跳转到目标页面
            uni.redirectTo({
              url: this.redirectUrl
            })
          } else {
            // 返回上一页或跳转到首页
            const pages = getCurrentPages()
            if (pages.length > 1) {
              uni.navigateBack()
            } else {
              uni.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        }, 1500)

      } catch (error) {
        console.error('登录失败:', error)
        // 错误信息已经在拦截器中处理了
      } finally {
        this.$hideLoading()
      }
    },

    // 微信登录
    handleWechatLogin() {
      if (!this.agreementChecked) {
        this.$showToast('请先同意用户协议和隐私政策')
        return
      }

      uni.showModal({
        title: '提示',
        content: '微信登录功能开发中，请使用手机号登录',
        showCancel: false
      })
    },

    // 跳转注册
    handleRegister() {
      uni.navigateTo({
        url: '/subpackages/auth/pages/register'
      })
    },

    // 忘记密码
    handleForgetPassword() {
      uni.navigateTo({
        url: '/pages/auth/forget-password'
      })
    },

    // 协议点击
    handleAgreementClick(type) {
      const urls = {
        user: '/pages/agreement/user',
        privacy: '/pages/agreement/privacy'
      }
      
      uni.navigateTo({
        url: urls[type]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-login {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 0%, lighten($primary-color, 15%) 100%);
  position: relative;
  overflow: hidden;

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      
      &.circle-1 {
        width: 200rpx;
        height: 200rpx;
        top: -100rpx;
        right: -100rpx;
      }
      
      &.circle-2 {
        width: 300rpx;
        height: 300rpx;
        bottom: -150rpx;
        left: -150rpx;
      }
      
      &.circle-3 {
        width: 150rpx;
        height: 150rpx;
        top: 30%;
        left: -75rpx;
      }
    }
  }

  .login-container {
    position: relative;
    z-index: 1;
    padding: 120rpx 60rpx 0;

    .login-header {
      text-align: center;
      margin-bottom: 80rpx;

      .login-title {
        display: block;
        font-size: 48rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 20rpx;
      }

      .login-subtitle {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .login-form {
      background: #fff;
      border-radius: 20rpx;
      padding: 60rpx 40rpx;
      box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);

      .form-item {
        display: flex;
        align-items: center;
        height: 100rpx;
        border-bottom: 1rpx solid $border-color-light;
        margin-bottom: 40rpx;
        position: relative;

        .item-icon {
          width: 32rpx;
          height: 32rpx;
          margin-right: 20rpx;
        }

        .form-input {
          flex: 1;
          height: 100%;
          font-size: 28rpx;
          color: $text-color-primary;
        }

        .clear-btn, .password-toggle {
          width: 40rpx;
          height: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 24rpx;
            height: 24rpx;
          }
        }

        .verify-code-btn {
          padding: 12rpx 20rpx;
          background: $primary-color;
          border-radius: 20rpx;
          
          text {
            font-size: 24rpx;
            color: #fff;
          }
          
          &.disabled {
            background: $border-color-light;
            
            text {
              color: $text-color-light;
            }
          }
        }
      }

      .login-type-switch {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 60rpx;

        .switch-item {
          font-size: 28rpx;
          color: $text-color-light;
          padding: 0 20rpx;

          &.active {
            color: $primary-color;
            font-weight: bold;
          }
        }

        .switch-divider {
          color: $border-color-base;
        }
      }

      .login-btn {
        height: 90rpx;
        background: $primary-color;
        border-radius: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40rpx;

        text {
          font-size: 32rpx;
          color: #fff;
          font-weight: bold;
        }

        &.disabled {
          background: $border-color-light;

          text {
            color: $text-color-light;
          }
        }
      }

      .other-login {
        .other-login-title {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40rpx;

          .title-line {
            flex: 1;
            height: 1rpx;
            background: $border-color-light;
          }

          .title-text {
            padding: 0 20rpx;
            font-size: 24rpx;
            color: $text-color-light;
          }
        }

        .login-methods {
          display: flex;
          justify-content: center;

          .method-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 40rpx;

            image {
              width: 60rpx;
              height: 60rpx;
              margin-bottom: 10rpx;
            }

            text {
              font-size: 22rpx;
              color: $text-color-light;
            }
          }
        }
      }

      .login-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 40rpx;

        .footer-link {
          font-size: 26rpx;
          color: $primary-color;
        }
      }
    }
  }

  .agreement {
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 60rpx;

    .agreement-check {
      margin-right: 10rpx;

      image {
        width: 28rpx;
        height: 28rpx;
      }
    }

    .agreement-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }

    .agreement-link {
      color: #fff;
    }
  }
}
</style>