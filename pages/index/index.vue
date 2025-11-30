<template>
  <view class="index-container">
    <!-- 顶部导航 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="shop-info">
          <text class="shop-name">创享家批发</text>
          <uni-icons type="bottom" size="14" color="#fff" />
        </view>
        <view class="header-actions">
          <view class="action-btn">
            <text class="action-text">自购</text>
          </view>
          <view class="action-btn share-btn">
            <text class="action-text">分享</text>
            <uni-icons type="redo" size="12" color="#f60808" />
          </view>
          <uni-icons type="scan" size="22" color="#fff" class="icon-gap" />
          <view class="menu-dots">
            <text class="dot">•••</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="16" color="#999" />
        <input type="text" placeholder="搜索商品" placeholder-class="placeholder" />
      </view>
      <view class="scan-btn">
        <uni-icons type="scan" size="22" color="#333" />
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
      <v-tabs v-model="currentCategory" :tabs="categories" @change="selectCategory" lineColor="linear-gradient(to right, red, gold)" activeColor="red"></v-tabs>
    </scroll-view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <!-- Banner轮播 -->
      <swiper class="banner-swiper" indicator-dots circular autoplay>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <view class="banner-item">
            <image :src="item.image" mode="aspectFit" class="banner-image" />
          </view>
        </swiper-item>
      </swiper>

      <!-- 公告栏 -->
      <view class="notice-bar">
        <uni-icons type="sound" size="16" color="#333" />
        <swiper 
          class="notice-swiper" 
          vertical 
          autoplay 
          circular 
          :interval="3200" 
          :duration="500"
        >
          <swiper-item v-for="(item, index) in notices" :key="index">
            <text class="notice-text">{{ item }}</text>
          </swiper-item>
        </swiper>
        <text class="notice-more">更多</text>
      </view>

      <!-- 新品推荐 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <text class="fire-icon">🔥</text>
            <text class="title-text">新品推荐</text>
            <text class="title-desc">本店上新推荐优质新品</text>
          </view>
        </view>
        <swiper 
          class="product-swiper" 
          :indicator-dots="false"
          :current="newProductsIndex"
          @change="onNewProductsChange"
        >
          <swiper-item v-for="(page, pageIndex) in newProductPages" :key="pageIndex">
            <view class="product-list">
              <view v-for="(item, index) in page" :key="index" class="product-item">
                <image :src="item.image" mode="aspectFill" class="product-image" />
                <text class="product-name">{{ item.name }}</text>
                <view class="product-price-row">
                  <text class="product-price">¥{{ item.price }}</text>
                  <text class="product-origin-price">¥{{ item.originPrice }}</text>
                  <view class="cart-btn">
                    <uni-icons type="cart" size="14" color="#f60808" />
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="dots-indicator">
          <view 
            v-for="(page, i) in newProductPages" 
            :key="i" 
            :class="['dot', { active: newProductsIndex === i }]"
          ></view>
        </view>
      </view>

      <!-- 热销榜单 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <text class="fire-icon">🔥</text>
            <text class="title-text">热销榜单</text>
            <text class="title-desc">看看大家都在买什么</text>
          </view>
        </view>
        <swiper 
          class="hot-swiper" 
          :indicator-dots="false"
          :current="hotProductsIndex"
          @change="onHotProductsChange"
        >
          <swiper-item v-for="(page, pageIndex) in hotProductPages" :key="pageIndex">
            <view class="hot-list">
              <view v-for="(item, index) in page" :key="index" class="hot-item">
                <view class="hot-rank">
                  <view :class="['rank-badge', 'rank-' + (pageIndex * 3 + index + 1)]">
                    TOP{{ pageIndex * 3 + index + 1 }}
                  </view>
                </view>
                <image :src="item.image" mode="aspectFill" class="hot-image" />
                <view class="hot-info">
                  <text class="hot-name">{{ item.name }}</text>
                  <view class="hot-price-row">
                    <text class="hot-price">¥{{ item.price }}</text>
                    <text class="hot-unit">/{{ item.unit }}</text>
                  </view>
                  <view class="hot-tags">
                    <text class="hot-origin-price">零售¥{{ item.originPrice }}</text>
                    <text class="hot-stock">还30天卖300件</text>
                  </view>
                </view>
                <view class="hot-cart">
                  <uni-icons type="cart" size="18" color="#f60808" />
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="dots-indicator">
          <view 
            v-for="(page, i) in hotProductPages" 
            :key="i" 
            :class="['dot', { active: hotProductsIndex === i }]"
          ></view>
        </view>
      </view>

      <!-- 商家特卖 -->
      <view class="section">
        <view class="section-header special-header">
          <view class="section-title">
            <text class="crown-icon">👑</text>
            <text class="title-text">商家特卖</text>
          </view>
          <view class="special-tags">
            <text class="special-tag">厂家放量</text>
            <text class="special-tag">商家共赢</text>
          </view>
        </view>
        <swiper 
          class="special-swiper" 
          :indicator-dots="false"
          :current="specialProductsIndex"
          @change="onSpecialProductsChange"
        >
          <swiper-item v-for="(page, pageIndex) in specialProductPages" :key="pageIndex">
            <view class="special-grid">
              <view v-for="(item, index) in page" :key="index" class="special-item">
                <image :src="item.image" mode="aspectFill" class="special-image" />
                <text class="special-name">{{ item.name }}</text>
                <view class="special-price-row">
                  <text class="special-price">¥{{ item.price }}</text>
                  <text class="special-unit">/件</text>
                  <view class="special-cart">
                    <uni-icons type="cart" size="14" color="#f60808" />
                  </view>
                </view>
                <text class="special-origin-price">零售¥{{ item.originPrice }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="dots-indicator">
          <view 
            v-for="(page, i) in specialProductPages" 
            :key="i" 
            :class="['dot', { active: specialProductsIndex === i }]"
          ></view>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="footer-info">
        <text class="company-name">创享家(广西)信息有限公司</text>
        <text class="company-desc">提供极速技术支持 平台服务: 19807717688</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>

export default {

  data() {
    return {
      statusBarHeight: 20,
      currentCategory: 0,
      newProductsIndex: 0,
      hotProductsIndex: 0,
      specialProductsIndex: 0,
      categories: ['推荐', '美妆个护', '营养美食', '居家生活', '手机数码'],
      banners: [
        {
          title: '极致生活',
          subtitle: '照亮你的美',
          date: '活动时间：2019/11/17-2019/11/26',
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          image: '/static/logo.png'
        },
        {
          title: '极致生活',
          subtitle: '照亮你的美',
          date: '活动时间：2019/11/17-2019/11/26',
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          image: '/static/logo.png'
        }
      ],
      newProducts: [
        { name: '修护精华霜修护精华霜修护精...', price: '68.9', originPrice: '98.9', image: '/placeholder.svg?height=120&width=120' },
        { name: '修护精华霜修护精华霜修护精...', price: '68.9', originPrice: '68.9', image: '/placeholder.svg?height=120&width=120' },
        { name: '修护精华霜修护精华霜修护精...', price: '68.9', originPrice: '68.9', image: '/placeholder.svg?height=120&width=120' },
        { name: '修护精华霜修护精华霜修护精...', price: '68.9', originPrice: '68.9', image: '/placeholder.svg?height=120&width=120' },
        { name: '修护精华霜修护精华霜修护精...', price: '78.9', originPrice: '108.9', image: '/placeholder.svg?height=120&width=120' },
        { name: '修护精华霜修护精华霜修护精...', price: '88.9', originPrice: '118.9', image: '/placeholder.svg?height=120&width=120' }
      ],
      hotProducts: [
        { name: 'SK-II微肌因赋活修护精华试用装35ml装', price: '29.9', unit: '瓶', originPrice: '68.9', image: '/placeholder.svg?height=100&width=100' },
        { name: 'SK-II微肌因赋活修护精华试用装35ml装', price: '29.9', unit: '瓶', originPrice: '68.9', image: '/placeholder.svg?height=100&width=100' },
        { name: 'SK-II微肌因赋活修护精华试用装35ml装', price: '29.9', unit: '瓶', originPrice: '68.9', image: '/placeholder.svg?height=100&width=100' },
        { name: 'SK-II微肌因赋活修护精华试用装35ml装', price: '39.9', unit: '瓶', originPrice: '88.9', image: '/placeholder.svg?height=100&width=100' },
        { name: 'SK-II微肌因赋活修护精华试用装35ml装', price: '49.9', unit: '瓶', originPrice: '98.9', image: '/placeholder.svg?height=100&width=100' },
        { name: 'SK-II微肌因赋活修护精华试用装35ml装', price: '59.9', unit: '瓶', originPrice: '108.9', image: '/placeholder.svg?height=100&width=100' }
      ],
      specialProducts: [
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '299', originPrice: '969', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '299', originPrice: '969', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '299', originPrice: '969', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '299', originPrice: '969', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '299', originPrice: '969', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '299', originPrice: '969', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '329', originPrice: '999', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '359', originPrice: '1099', image: '/placeholder.svg?height=100&width=100' },
        { name: '法国兰LANCOME小黑瓶眼霜 15ml', price: '389', originPrice: '1199', image: '/placeholder.svg?height=100&width=100' }
      ],
      notices: [
        '请关注本店发布的公告通知',
        '会员日下单享受满200减50优惠',
        '仓库搬迁升级，发货时间顺延1-2天，感谢理解'
      ]
    }
  },
  computed: {
    newProductPages() {
      const pages = []
      for (let i = 0; i < this.newProducts.length; i += 3) {
        pages.push(this.newProducts.slice(i, i + 3))
      }
      return pages
    },
    hotProductPages() {
      const pages = []
      for (let i = 0; i < this.hotProducts.length; i += 3) {
        pages.push(this.hotProducts.slice(i, i + 3))
      }
      return pages
    },
    specialProductPages() {
      const pages = []
      for (let i = 0; i < this.specialProducts.length; i += 6) {
        pages.push(this.specialProducts.slice(i, i + 6))
      }
      return pages
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 20
  },
  methods: {
    selectCategory(index) {
      this.currentCategory = index
      // 可以在这里添加筛选逻辑
      console.log('[v0] 选中分类:', this.categories[index])
    },
    onNewProductsChange(e) {
      this.newProductsIndex = e.detail.current
    },
    onHotProductsChange(e) {
      this.hotProductsIndex = e.detail.current
    },
    onSpecialProductsChange(e) {
      this.specialProductsIndex = e.detail.current
    }
  }
}
</script>

<style lang="scss" scoped>
.index-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: #f60808;
  padding-bottom: 20rpx;
}

.header-content {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.shop-name {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 6rpx 16rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.share-btn {
  background: #fff;
  .action-text {
    color: #f60808;
  }
}

.action-text {
  color: #fff;
  font-size: 22rpx;
}

.icon-gap {
  margin-left: 8rpx;
}

.menu-dots {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  padding: 4rpx 12rpx;
}

.dot {
  color: #fff;
  font-size: 20rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 30rpx;
  background: #fff;
  gap: 20rpx;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 36rpx;
  padding: 16rpx 24rpx;
  gap: 12rpx;
  
  input {
    flex: 1;
    font-size: 28rpx;
  }
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}

.category-scroll {
  white-space: nowrap;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.category-list {
  display: inline-flex;
  padding: 0 20rpx;
}

.category-item {
  padding: 24rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  
  &.active {
    color: #f60808;
    font-weight: bold;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background: #f60808;
      border-radius: 2rpx;
    }
  }
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.banner-swiper {
  height: 280rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background: #f8f8f8;
  .image {
    width: 100%;
    height: 100%;
  }
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.banner-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.banner-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 28rpx;
}

.banner-btn {
  margin-top: 16rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  display: inline-block;
  width: fit-content;
}

.banner-date {
  color: rgba(255, 255, 255, 0.6);
  font-size: 20rpx;
  margin-top: 8rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.notice-bar {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 0 20rpx 20rpx;
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  gap: 12rpx;
}

.notice-swiper {
  flex: 1;
  height: 40rpx;
}

.notice-text {
  font-size: 26rpx;
  color: #333;
  line-height: 40rpx;
}

.notice-more {
  font-size: 26rpx;
  color: #999;
}

.section {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.fire-icon, .crown-icon {
  font-size: 32rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.title-desc {
  font-size: 24rpx;
  color: #999;
  margin-left: 12rpx;
}

.product-swiper {
  height: 340rpx;
}

.product-list {
  display: flex;
  justify-content: space-between;
  padding: 0 10rpx;
}

.product-item {
  width: 200rpx;
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background: #f9f9f9;
}

.product-name {
  font-size: 24rpx;
  color: #333;
  margin-top: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.product-price-row {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
  gap: 8rpx;
}

.product-price {
  font-size: 28rpx;
  color: #f60808;
  font-weight: bold;
}

.product-origin-price {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
}

.cart-btn {
  margin-left: auto;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 1rpx solid #f60808;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots-indicator {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
  
  .dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #ddd;
    
    &.active {
      background: #f60808;
      width: 24rpx;
      border-radius: 6rpx;
    }
  }
}

.hot-swiper {
  height: 480rpx;
}

.hot-list {
  display: flex;
  flex-direction: column;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.hot-rank {
  width: 60rpx;
}

.rank-badge {
  font-size: 20rpx;
  font-weight: bold;
  color: #fff;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  text-align: center;
  
  &.rank-1 {
    background: linear-gradient(135deg, #f60808, #ff7875);
  }
  &.rank-2 {
    background: linear-gradient(135deg, #ff7a45, #ffa940);
  }
  &.rank-3 {
    background: linear-gradient(135deg, #ffc53d, #ffe58f);
    color: #8c6e00;
  }
  &.rank-4, &.rank-5, &.rank-6 {
    background: #e8e8e8;
    color: #8c8c8c;
  }
}

.hot-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background: #f9f9f9;
}

.hot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hot-name {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hot-price-row {
  display: flex;
  align-items: baseline;
}

.hot-price {
  font-size: 32rpx;
  color: #f60808;
  font-weight: bold;
}

.hot-unit {
  font-size: 22rpx;
  color: #f60808;
}

.hot-tags {
  display: flex;
  gap: 16rpx;
}

.hot-origin-price {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
}

.hot-stock {
  font-size: 22rpx;
  color: #999;
}

.hot-cart {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 1rpx solid #f60808;
  display: flex;
  align-items: center;
  justify-content: center;
}

.special-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.special-tags {
  display: flex;
  gap: 20rpx;
}

.special-tag {
  font-size: 24rpx;
  color: #999;
}

.special-swiper {
  height: 560rpx;
}

.special-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.special-item {
  width: calc(33.33% - 12rpx);
  display: flex;
  flex-direction: column;
}

.special-image {
  width: 100%;
  height: 180rpx;
  border-radius: 12rpx;
  background: #f9f9f9;
}

.special-name {
  font-size: 22rpx;
  color: #333;
  margin-top: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.special-price-row {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}

.special-price {
  font-size: 28rpx;
  color: #f60808;
  font-weight: bold;
}

.special-unit {
  font-size: 20rpx;
  color: #f60808;
}

.special-cart {
  margin-left: auto;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 1rpx solid #f60808;
  display: flex;
  align-items: center;
  justify-content: center;
}

.special-origin-price {
  font-size: 20rpx;
  color: #999;
  text-decoration: line-through;
}

.footer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 20rpx 60rpx;
  gap: 8rpx;
}

.company-name {
  font-size: 24rpx;
  color: #999;
}

.company-desc {
  font-size: 22rpx;
  color: #bbb;
}
</style>
