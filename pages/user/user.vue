<template>
  <view class="page-user">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <view class="user-info" @click="handleUserInfoClick">
        <image class="avatar" :src="userAvatar" mode="aspectFit"></image>
        <view class="user-detail">
          <text class="username">{{ userName }}</text>
          <text class="user-level" v-if="isVip">VIP会员</text>
          <text class="login-tip" v-else>点击登录</text>
        </view>
      </view>
      <view class="settings" @click="handleSettingsClick">
        <image src="/static/icons/settings.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 订单状态 -->
    <view class="order-section">
      <view class="section-header" @click="handleOrderListClick">
        <text class="section-title">我的订单</text>
        <view class="section-more">
          <text>查看全部</text>
          <image src="/static/icons/arrow-right.png" mode="aspectFit"></image>
        </view>
      </view>
      
      <view class="order-status">
        <view class="status-item" @click="handleOrderStatusClick(0)">
          <image src="/static/icons/order-pending.png" mode="aspectFit"></image>
          <text>待付款</text>
          <view class="badge" v-if="orderStats.pendingPayment > 0">{{ orderStats.pendingPayment }}</view>
        </view>
        <view class="status-item" @click="handleOrderStatusClick(1)">
          <image src="/static/icons/order-shipping.png" mode="aspectFit"></image>
          <text>待发货</text>
          <view class="badge" v-if="orderStats.pendingShipping > 0">{{ orderStats.pendingShipping }}</view>
        </view>
        <view class="status-item" @click="handleOrderStatusClick(2)">
          <image src="/static/icons/order-delivery.png" mode="aspectFit"></image>
          <text>待收货</text>
          <view class="badge" v-if="orderStats.pendingReceipt > 0">{{ orderStats.pendingReceipt }}</view>
        </view>
        <view class="status-item" @click="handleOrderStatusClick(3)">
          <image src="/static/icons/order-review.png" mode="aspectFit"></image>
          <text>待评价</text>
          <view class="badge" v-if="orderStats.pendingReview > 0">{{ orderStats.pendingReview }}</view>
        </view>
        <view class="status-item" @click="handleOrderStatusClick(4)">
          <image src="/static/icons/order-refund.png" mode="aspectFit"></image>
          <text>退款/售后</text>
          <view class="badge" v-if="orderStats.refund > 0">{{ orderStats.refund }}</view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-grid">
        <view class="menu-item" @click="handleMenuClick('coupon')">
          <image src="/static/icons/coupon.png" mode="aspectFit"></image>
          <text>优惠券</text>
        </view>
        <view class="menu-item" @click="handleMenuClick('collect')">
          <image src="/static/icons/collect.png" mode="aspectFit"></image>
          <text>我的收藏</text>
        </view>
        <view class="menu-item" @click="handleMenuClick('address')">
          <image src="/static/icons/address.png" mode="aspectFit"></image>
          <text>地址管理</text>
        </view>
        <view class="menu-item" @click="handleMenuClick('service')">
          <image src="/static/icons/service.png" mode="aspectFit"></image>
          <text>客服中心</text>
        </view>
      </view>
      
      <view class="menu-grid">
        <view class="menu-item" @click="handleMenuClick('about')">
          <image src="/static/icons/about.png" mode="aspectFit"></image>
          <text>关于我们</text>
        </view>
        <view class="menu-item" @click="handleMenuClick('feedback')">
          <image src="/static/icons/feedback.png" mode="aspectFit"></image>
          <text>意见反馈</text>
        </view>
        <view class="menu-item" @click="handleMenuClick('share')">
          <image src="/static/icons/share.png" mode="aspectFit"></image>
          <text>分享应用</text>
        </view>
        <view class="menu-item" @click="handleMenuClick('logout')" v-if="isLogin">
          <image src="/static/icons/logout.png" mode="aspectFit"></image>
          <text>退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('user', ['isLogin']),
    ...mapGetters('user', ['userAvatar', 'userName', 'isVip']),
    
    orderStats() {
      return {
        pendingPayment: 0,
        pendingShipping: 0,
        pendingReceipt: 0,
        pendingReview: 0,
        refund: 0
      }
    }
  },

  onLoad() {
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  onPullDownRefresh() {
    this.loadUserData().finally(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    ...mapActions('user', ['getUserInfo', 'logout']),

    async loadUserData() {
      if (this.isLogin) {
        try {
          await this.getUserInfo()
        } catch (error) {
          console.error('用户数据加载失败:', error)
        }
      }
    },

    // 用户信息点击
    handleUserInfoClick() {
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/subpackages/auth/pages/login'
        })
      } else {
        uni.navigateTo({
          url: '/pages/user/profile'
        })
      }
    },

    // 设置点击
    handleSettingsClick() {
      uni.navigateTo({
        url: '/pages/user/settings'
      })
    },

    // 订单列表点击
    handleOrderListClick() {
      if (!this.$checkLogin()) return
      
      uni.navigateTo({
        url: '/subpackages/order/pages/list'
      })
    },

    // 订单状态点击
    handleOrderStatusClick(status) {
      if (!this.$checkLogin()) return
      
      uni.navigateTo({
        url: `/subpackages/order/pages/list?status=${status}`
      })
    },

    // 菜单点击
    handleMenuClick(type) {
      switch (type) {
        case 'coupon':
          if (!this.$checkLogin()) return
          uni.navigateTo({
            url: '/pages/user/coupon'
          })
          break
        case 'collect':
          if (!this.$checkLogin()) return
          uni.navigateTo({
            url: '/pages/user/collect'
          })
          break
        case 'address':
          if (!this.$checkLogin()) return
          uni.navigateTo({
            url: '/subpackages/address/pages/list'
          })
          break
        case 'service':
          uni.makePhoneCall({
            phoneNumber: '400-123-4567'
          })
          break
        case 'about':
          uni.navigateTo({
            url: '/pages/about/index'
          })
          break
        case 'feedback':
          uni.navigateTo({
            url: '/pages/feedback/index'
          })
          break
        case 'share':
          this.handleShare()
          break
        case 'logout':
          this.handleLogout()
          break
      }
    },

    // 分享
    handleShare() {
      uni.showShareMenu({
        withShareTicket: true
      })
    },

    // 退出登录
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.logout()
              uni.showToast({
                title: '退出成功',
                icon: 'success'
              })
            } catch (error) {
              console.error('退出登录失败:', error)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user {
  min-height: 100vh;
  background: $bg-color;

  .user-header {
    background: linear-gradient(135deg, $primary-color, lighten($primary-color, 10%));
    padding: 60rpx 30rpx 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
        margin-right: 20rpx;
      }
      
      .user-detail {
        display: flex;
        flex-direction: column;
        
        .username {
          font-size: 36rpx;
          color: #fff;
          font-weight: bold;
          margin-bottom: 10rpx;
        }
        
        .user-level, .login-tip {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .user-level {
          background: rgba(255, 255, 255, 0.2);
          padding: 6rpx 12rpx;
          border-radius: 20rpx;
          align-self: flex-start;
        }
      }
    }
    
    .settings {
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }

  .order-section {
    background: #fff;
    margin: 20rpx;
    padding: 30rpx;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-color-primary;
      }
      
      .section-more {
        display: flex;
        align-items: center;
        
        text {
          font-size: 24rpx;
          color: $text-color-light;
          margin-right: 10rpx;
        }
        
        image {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }
    
    .order-status {
      display: flex;
      justify-content: space-around;
      
      .status-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 10rpx;
        }
        
        text {
          font-size: 24rpx;
          color: $text-color-regular;
        }
        
        .badge {
          position: absolute;
          top: -10rpx;
          right: 0;
          background: $danger-color;
          color: #fff;
          font-size: 20rpx;
          min-width: 30rpx;
          height: 30rpx;
          border-radius: 15rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 8rpx;
        }
      }
    }
  }

  .menu-section {
    background: #fff;
    margin: 20rpx;
    
    .menu-grid {
      display: flex;
      flex-wrap: wrap;
      padding: 20rpx 0;
      
      .menu-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30rpx 0;
        
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 15rpx;
        }
        
        text {
          font-size: 24rpx;
          color: $text-color-regular;
        }
      }
    }
  }
}
</style>