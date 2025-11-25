<template>
  <view class="container">
    <view class="logo-area">
      <view class="logo-circle">
        <text class="logo-text">创享家</text>
      </view>
    </view>

    <view class="info-area">
      <text class="title">该小程序将获取以下权限</text>
      <text class="subtitle">获取您的微信的个人信息</text>

      <view class="permission-list">
        <view class="permission-item">
          <view class="dot"></view>
          <text class="item-text">微信个人昵称</text>
        </view>
        <!-- <view class="permission-item">
          <view class="dot"></view>
          <text class="item-text">微信绑定手机号</text>
        </view> -->
      </view>
    </view>

    <view class="btn-area">
      <button class="login-btn" @getuserinfo="handleGetUserInfo" @click="handleLogin" :loading="loading"
        :disabled="loading">
        <image class="wechat-icon"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik04LjUgMUM0LjYgMSAxLjUgMy44IDEuNSA3LjRjMCAyLjEgMS4xIDQgMi44IDUuMi0uMS42LS40IDEuNC0uNSAxLjUuOS4zIDIuMS42IDIuNS41IDEuNSAxLjEgMy4zIDEuNyA1LjIgMS43aC41YzAtLjIuMS0uNC4xLS42IDAtMy41IDMuMS02LjQgNy02LjRoLjFjMC00LjMtNC42LTcuOC0xMC43LTcuOHptMTMuMiA4LjRjLTMuNSAwLTYuNCAyLjYtNi40IDUuOCAwIDEuOC45IDMuNCAyLjQgNC41LS4zIDEuMS0xIDEuNy0xLjEgMS44IDEuMS4zIDIuNS4xIDMuNC0uNS41LjIgMS4xLjMgMS43LjMgMy41IDAgNi40LTIuNiA2LjQtNS44IDAtMy4yLTIuOS01LjgtNi40LTUuOHoiLz48L3N2Zz4="
          mode="aspectFit"></image>
        <text>微信授权登录</text>
      </button>
    </view>
  </view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      isLogin: false,
      userInfo: null,
      code: ''
    };
  },
  methods: {
    ...mapActions("user", ["login", "getUserInfo"]),

    handleLogin() {
      if (this.loading) return
      this.getWxLoginCode()
    },
    getWxLoginCode() {
      const that = this;
      this.loading = true
      uni.login({
        provider: "weixin",
        success: async function (loginRes) {
          const res = await that.login({
            grant_type: "weChat",
            tenantId: "000000",
            code: loginRes.code,
            logonType: 1,
          });
          uni.hideLoading();
          that.loading = false;
          uni.switchTab({ url: '/pages/user/user' })
        },
        fail: (err) => {
          console.log("失败", err);
        },
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: 100vh;
  background-color: #ffffff;
  padding-top: 100rpx;
}

.logo-area {
  margin-bottom: 60rpx;
}

.logo-circle {
  width: 180rpx;
  height: 180rpx;
  background-color: #f60808;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 10rpx rgba(255, 0, 0, 0.2);
}

.logo-text {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
}

.info-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50rpx;
}

.title {
  font-size: 34rpx;
  color: #f60808;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 40rpx;
}

.permission-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.permission-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #f60808;
  border-radius: 50%;
  margin-right: 20rpx;
}

.item-text {
  font-size: 30rpx;
  color: #f60808;
  font-weight: 500;
}

.btn-area {
  width: 80%;
}

.login-btn {
  background-color: #f60808;
  color: #ffffff;
  border-radius: 50rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 90rpx;
  font-size: 32rpx;
  border: none;

  &::after {
    border: none;
  }
}

.wechat-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}
</style>
