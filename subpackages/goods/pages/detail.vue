<template>
  <view class="page-goods-detail">
    <!-- 商品图片轮播 -->
    <swiper class="goods-swiper" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000">
      <swiper-item v-for="(img, index) in goodsInfo.images" :key="index">
        <image :src="img" mode="aspectFill" @click="previewImage(index)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息 -->
    <view class="goods-info">
      <view class="goods-price">
        <text class="current">¥{{ goodsInfo.price }}</text>
        <text class="original" v-if="goodsInfo.originalPrice">¥{{ goodsInfo.originalPrice }}</text>
        <text class="discount" v-if="goodsInfo.discount"> {{ goodsInfo.discount }}折</text>
      </view>
      <view class="goods-title">{{ goodsInfo.title }}</view>
      <view class="goods-tags">
        <text class="tag" v-for="tag in goodsInfo.tags" :key="tag">{{ tag }}</text>
      </view>
      <view class="goods-meta">
        <text>销量 {{ goodsInfo.sales }}</text>
        <text>库存 {{ goodsInfo.stock }}</text>
        <text>收藏 {{ goodsInfo.collectCount }}</text>
      </view>
    </view>

    <!-- 商品规格选择 -->
    <view class="spec-section" v-if="goodsInfo.specs && goodsInfo.specs.length > 0">
      <view class="section-title">选择规格</view>
      <view class="spec-list">
        <view 
          class="spec-item" 
          v-for="spec in goodsInfo.specs" 
          :key="spec.id"
          :class="{ active: selectedSpec.id === spec.id }"
          @click="selectSpec(spec)"
        >
          {{ spec.name }}
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-section">
      <view class="section-title">商品详情</view>
      <rich-text :nodes="goodsInfo.detail"></rich-text>
    </view>

    <!-- 底部操作栏 -->
    <view class="goods-footer">
      <view class="footer-left">
        <view class="footer-btn" @click="handleCollect">
          <image :src="isCollected ? '/static/icons/collected.png' : '/static/icons/collect.png'" mode="aspectFit"></image>
          <text>收藏</text>
        </view>
        <view class="footer-btn" @click="handleCustomerService">
          <image src="/static/icons/service.png" mode="aspectFit"></image>
          <text>客服</text>
        </view>
        <view class="footer-btn cart" @click="handleCart">
          <image src="/static/icons/cart.png" mode="aspectFit"></image>
          <text>购物车</text>
          <view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
        </view>
      </view>
      <view class="footer-right">
        <view class="action-btn add-cart" @click="handleAddToCart">加入购物车</view>
        <view class="action-btn buy-now" @click="handleBuyNow">立即购买</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      goodsId: '',
      goodsInfo: {},
      selectedSpec: {},
      isCollected: false
    }
  },

  computed: {
    ...mapState('cart', ['cartCount'])
  },

  onLoad(options) {
    this.goodsId = options.id
    this.loadGoodsDetail()
  },

  onShareAppMessage() {
    return {
      title: this.goodsInfo.title,
      path: `/subpackages/goods/pages/detail?id=${this.goodsId}`
    }
  },

  methods: {
    ...mapActions('cart', ['addToCart']),

    async loadGoodsDetail() {
      try {
        uni.showLoading({
          title: '加载中...'
        })

        const res = await this.$http.get(`/goods/detail/${this.goodsId}`)
        this.goodsInfo = res.data
        
        // 默认选择第一个规格
        if (this.goodsInfo.specs && this.goodsInfo.specs.length > 0) {
          this.selectedSpec = this.goodsInfo.specs[0]
        }

        uni.hideLoading()
      } catch (error) {
        console.error('商品详情加载失败:', error)
        uni.hideLoading()
        uni.showToast({
          title: '商品加载失败',
          icon: 'none'
        })
      }
    },

    // 预览图片
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.goodsInfo.images
      })
    },

    // 选择规格
    selectSpec(spec) {
      this.selectedSpec = spec
    },

    // 添加到购物车
    async handleAddToCart() {
      if (!this.selectedSpec.id) {
        uni.showToast({
          title: '请选择规格',
          icon: 'none'
        })
        return
      }

      try {
        await this.addToCart({
          id: this.goodsInfo.id,
          specId: this.selectedSpec.id,
          title: this.goodsInfo.title,
          price: this.goodsInfo.price,
          image: this.goodsInfo.images[0],
          spec: this.selectedSpec.name,
          quantity: 1
        })

        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
      } catch (error) {
        uni.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    },

    // 立即购买
    handleBuyNow() {
      if (!this.selectedSpec.id) {
        uni.showToast({
          title: '请选择规格',
          icon: 'none'
        })
        return
      }

      const goods = {
        id: this.goodsInfo.id,
        specId: this.selectedSpec.id,
        title: this.goodsInfo.title,
        price: this.goodsInfo.price,
        image: this.goodsInfo.images[0],
        spec: this.selectedSpec.name,
        quantity: 1
      }

      uni.navigateTo({
        url: `/subpackages/order/pages/confirm?goods=${JSON.stringify([goods])}&type=buyNow`
      })
    },

    // 收藏商品
    handleCollect() {
      this.isCollected = !this.isCollected
      uni.showToast({
        title: this.isCollected ? '收藏成功' : '取消收藏',
        icon: 'success'
      })
    },

    // 客服
    handleCustomerService() {
      uni.showToast({
        title: '客服功能开发中',
        icon: 'none'
      })
    },

    // 跳转购物车
    handleCart() {
      uni.switchTab({
        url: '/pages/cart/cart'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-goods-detail {
  padding-bottom: 120rpx;

  .goods-swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info {
    padding: 30rpx;
    background: #fff;

    .goods-price {
      display: flex;
      align-items: baseline;
      margin-bottom: 20rpx;

      .current {
        font-size: 48rpx;
        color: #FF6A3C;
        font-weight: bold;
        margin-right: 20rpx;
      }

      .original {
        font-size: 28rpx;
        color: #999;
        text-decoration: line-through;
        margin-right: 20rpx;
      }

      .discount {
        font-size: 24rpx;
        color: #fff;
        background: #FF6A3C;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
      }
    }

    .goods-title {
      font-size: 32rpx;
      color: #333;
      line-height: 1.5;
      margin-bottom: 20rpx;
    }

    .goods-tags {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20rpx;

      .tag {
        font-size: 20rpx;
        color: #FF6A3C;
        background: #FFF0EB;
        padding: 6rpx 12rpx;
        border-radius: 6rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
      }
    }

    .goods-meta {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #999;
    }
  }

  .spec-section {
    margin-top: 20rpx;
    background: #fff;
    padding: 30rpx;

    .section-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .spec-list {
      display: flex;
      flex-wrap: wrap;

      .spec-item {
        padding: 16rpx 32rpx;
        border: 1rpx solid #eee;
        border-radius: 8rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        font-size: 26rpx;
        color: #333;

        &.active {
          border-color: #FF6A3C;
          color: #FF6A3C;
          background: #FFF0EB;
        }
      }
    }
  }

  .detail-section {
    margin-top: 20rpx;
    background: #fff;
    padding: 30rpx;

    .section-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }
  }

  .goods-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #fff;
    display: flex;
    align-items: center;
    border-top: 1rpx solid #eee;
    padding: 0 20rpx;

    .footer-left {
      flex: 1;
      display: flex;
      align-items: center;

      .footer-btn {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 30rpx;

        image {
          width: 40rpx;
          height: 40rpx;
          margin-bottom: 6rpx;
        }

        text {
          font-size: 20rpx;
          color: #666;
        }

        &.cart {
          .cart-badge {
            position: absolute;
            top: -10rpx;
            right: -10rpx;
            background: #FF6A3C;
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

    .footer-right {
      display: flex;
      align-items: center;

      .action-btn {
        height: 70rpx;
        padding: 0 40rpx;
        border-radius: 35rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
        font-weight: bold;
        margin-left: 20rpx;

        &.add-cart {
          background: #FFA726;
          color: #fff;
        }

        &.buy-now {
          background: #FF6A3C;
          color: #fff;
        }
      }
    }
  }
}
</style>