<template>
  <view class="page-order-confirm">
    <!-- 收货地址 -->
    <view class="address-section" @click="handleAddressClick">
      <view class="address-content" v-if="selectedAddress">
        <view class="address-info">
          <text class="name">{{ selectedAddress.name }}</text>
          <text class="phone">{{ selectedAddress.phone }}</text>
        </view>
        <view class="address-detail">
          <text class="default-tag" v-if="selectedAddress.isDefault">默认</text>
          <text>{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
        </view>
      </view>
      <view class="address-empty" v-else>
        <text>请选择收货地址</text>
      </view>
      <image class="arrow" src="/static/icons/arrow-right.png" mode="aspectFit"></image>
    </view>

    <!-- 商品列表 -->
    <view class="goods-section">
      <view class="section-title">商品信息</view>
      <view class="goods-list">
        <view class="goods-item" v-for="item in orderItems" :key="item.id + '-' + item.specId">
          <image class="goods-image" :src="item.image" mode="aspectFill"></image>
          <view class="goods-info">
            <text class="goods-title">{{ item.title }}</text>
            <text class="goods-spec" v-if="item.spec">{{ item.spec }}</text>
            <view class="goods-bottom">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="label">商品金额</text>
        <text class="value">¥{{ totalAmount }}</text>
      </view>
      <view class="info-item">
        <text class="label">运费</text>
        <text class="value">+¥{{ shippingFee }}</text>
      </view>
      <view class="info-item">
        <text class="label">优惠券</text>
        <text class="value discount" @click="handleCouponClick">-¥{{ discountAmount }}</text>
      </view>
      <view class="info-item total">
        <text class="label">实付金额</text>
        <text class="value price">¥{{ actualAmount }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="order-footer">
      <view class="footer-left">
        <text class="total-text">合计: </text>
        <text class="total-price">¥{{ actualAmount }}</text>
      </view>
      <view class="footer-right">
        <view class="submit-btn" @click="handleSubmitOrder">提交订单</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      orderItems: [],
      selectedAddress: null,
      shippingFee: 0,
      discountAmount: 0,
      couponId: ''
    }
  },

  computed: {
    ...mapState('address', ['addressList']),
    
    // 总金额
    totalAmount() {
      return this.orderItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    
    // 实付金额
    actualAmount() {
      return this.totalAmount + this.shippingFee - this.discountAmount
    }
  },

  onLoad(options) {
    this.initOrderData(options)
  },

  onShow() {
    this.loadDefaultAddress()
  },

  methods: {
    ...mapActions('address', ['getAddressList']),

    // 初始化订单数据
    initOrderData(options) {
      if (options.items) {
        this.orderItems = JSON.parse(decodeURIComponent(options.items))
      } else if (options.goods) {
        this.orderItems = JSON.parse(decodeURIComponent(options.goods))
      }
    },

    // 加载默认地址
    async loadDefaultAddress() {
      try {
        await this.getAddressList()
        this.selectedAddress = this.addressList.find(item => item.isDefault) || null
      } catch (error) {
        console.error('地址加载失败:', error)
      }
    },

    // 地址点击
    handleAddressClick() {
      uni.navigateTo({
        url: '/subpackages/address/pages/select'
      })
    },

    // 优惠券点击
    handleCouponClick() {
      uni.navigateTo({
        url: '/pages/user/coupon?select=true'
      })
    },

    // 提交订单
    async handleSubmitOrder() {
      if (!this.selectedAddress) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '提交中...' })

        const orderData = {
          addressId: this.selectedAddress.id,
          items: this.orderItems,
          totalAmount: this.totalAmount,
          shippingFee: this.shippingFee,
          discountAmount: this.discountAmount,
          actualAmount: this.actualAmount,
          couponId: this.couponId
        }

        const res = await this.$http.post('/order/create', orderData)

        uni.hideLoading()

        // 订单创建成功，跳转到支付页面
        uni.redirectTo({
          url: `/subpackages/order/pages/detail?id=${res.data.orderId}`
        })

      } catch (error) {
        uni.hideLoading()
        console.error('订单提交失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-order-confirm {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;

  .address-section {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .address-content {
      flex: 1;
      
      .address-info {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        
        .name {
          font-size: 32rpx;
          font-weight: bold;
          color: $text-color-primary;
          margin-right: 20rpx;
        }
        
        .phone {
          font-size: 28rpx;
          color: $text-color-regular;
        }
      }
      
      .address-detail {
        display: flex;
        align-items: center;
        
        .default-tag {
          background: $primary-color;
          color: #fff;
          font-size: 20rpx;
          padding: 4rpx 8rpx;
          border-radius: 4rpx;
          margin-right: 10rpx;
        }
        
        text {
          font-size: 26rpx;
          color: $text-color-regular;
        }
      }
    }
    
    .address-empty {
      flex: 1;
      
      text {
        font-size: 28rpx;
        color: $text-color-light;
      }
    }
    
    .arrow {
      width: 24rpx;
      height: 24rpx;
    }
  }

  .goods-section {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 28rpx;
      color: $text-color-primary;
      margin-bottom: 20rpx;
    }
    
    .goods-list {
      .goods-item {
        display: flex;
        padding: 20rpx 0;
        
        .goods-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }
        
        .goods-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .goods-title {
            font-size: 26rpx;
            color: $text-color-primary;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          
          .goods-spec {
            font-size: 22rpx;
            color: $text-color-light;
          }
          
          .goods-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .goods-price {
              font-size: 28rpx;
              color: $primary-color;
              font-weight: bold;
            }
            
            .goods-quantity {
              font-size: 24rpx;
              color: $text-color-light;
            }
          }
        }
      }
    }
  }

  .order-info {
    background: #fff;
    padding: 30rpx;
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      
      .label {
        font-size: 28rpx;
        color: $text-color-regular;
      }
      
      .value {
        font-size: 28rpx;
        color: $text-color-primary;
        
        &.discount {
          color: $primary-color;
        }
      }
      
      &.total {
        border-top: 1rpx solid $border-color-light;
        margin-top: 10rpx;
        padding-top: 20rpx;
        
        .price {
          font-size: 32rpx;
          color: $primary-color;
          font-weight: bold;
        }
      }
    }
  }

  .order-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    border-top: 1rpx solid $border-color-light;
    
    .footer-left {
      .total-text {
        font-size: 28rpx;
        color: $text-color-regular;
      }
      
      .total-price {
        font-size: 32rpx;
        color: $primary-color;
        font-weight: bold;
      }
    }
    
    .footer-right {
      .submit-btn {
        width: 200rpx;
        height: 70rpx;
        background: $primary-color;
        border-radius: 35rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        
        text {
          font-size: 28rpx;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}
</style>