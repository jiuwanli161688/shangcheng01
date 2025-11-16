<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left">
        <text class="logo">创享家批发</text>
        <image class="icon" src="/static/icons/translate.png" mode="aspectFit"></image>
        <view class="badge">
          <text class="badge-text">分享</text>
        </view>
      </view>
      <view class="header-right">
        <image class="icon" src="/static/icons/location.png" mode="aspectFit"></image>
        <image class="icon" src="/static/icons/message.png" mode="aspectFit"></image>
        <image class="icon" src="/static/icons/more.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <image class="search-icon" src="/static/icons/search.png" mode="aspectFit"></image>
        <text class="search-placeholder">搜索商品</text>
      </view>
      <image class="scan-icon" src="/static/icons/scan.png" mode="aspectFit"></image>
    </view>

    <!-- 分类导航 -->
    <scroll-view class="category-nav" scroll-x>
      <view class="nav-item active">推荐</view>
      <view class="nav-item">美妆个护</view>
      <view class="nav-item">营养美食</view>
      <view class="nav-item">居家生活</view>
      <view class="nav-item">手机</view>
    </scroll-view>

    <scroll-view class="main-content" scroll-y>
      <!-- 轮播图 -->
      <swiper class="banner" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay circular>
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image class="banner-image" :src="banner" mode="aspectFill"></image>
          <view class="banner-content">
            <text class="banner-title">极致生活</text>
            <text class="banner-subtitle">照亮你的美</text>
            <view class="banner-button">
              <text class="banner-button-text">进入专题</text>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <!-- 公告 -->
      <view class="notice">
        <image class="notice-icon" src="/static/icons/notice.png" mode="aspectFit"></image>
        <text class="notice-text">请关注本店发布的公告通知</text>
        <text class="notice-more">更多</text>
      </view>

      <!-- 新品推荐 -->
      <view class="section">
        <view class="section-header">
          <image class="section-icon" src="/static/icons/new.png" mode="aspectFit"></image>
          <text class="section-title">新品推荐</text>
          <text class="section-subtitle">本店上新推荐优质商品</text>
        </view>
        <scroll-view class="product-scroll" scroll-x>
          <view class="product-card" v-for="(product, index) in newProducts" :key="index" @click="goToDetail(product.id)">
            <image class="product-image" :src="product.image" mode="aspectFill"></image>
            <text class="product-name">{{ product.name }}</text>
            <view class="product-footer">
              <text class="product-price">¥{{ product.price }}</text>
              <view class="add-cart-btn">
                <image class="cart-icon" src="/static/icons/cart-add.png" mode="aspectFit"></image>
              </view>
            </view>
            <text class="product-desc">{{ product.desc }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 热销榜单 -->
      <view class="section">
        <view class="section-header">
          <image class="section-icon" src="/static/icons/hot.png" mode="aspectFit"></image>
          <text class="section-title">热销榜单</text>
          <text class="section-subtitle">看看大家都在买什么</text>
        </view>
        <view class="hot-list">
          <view class="hot-item" v-for="(item, index) in hotProducts" :key="index" @click="goToDetail(item.id)">
            <view class="hot-badge" :class="'badge-' + item.badge">
              <text class="badge-label">{{ item.badgeText }}</text>
            </view>
            <image class="hot-image" :src="item.image" mode="aspectFill"></image>
            <view class="hot-info">
              <text class="hot-name">{{ item.name }}</text>
              <view class="hot-footer">
                <view class="price-box">
                  <text class="hot-price">¥{{ item.price }}</text>
                  <text class="hot-unit">/{{ item.unit }}</text>
                </view>
                <view class="hot-tags">
                  <text class="tag">零售不发货</text>
                  <text class="tag">低价不售货</text>
                </view>
                <view class="add-cart-btn">
                  <image class="cart-icon" src="/static/icons/cart-add.png" mode="aspectFit"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="dots">
          <view class="dot active"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>

      <!-- 商家特卖 -->
      <view class="section">
        <view class="section-header special">
          <image class="section-icon" src="/static/icons/special.png" mode="aspectFit"></image>
          <text class="section-title">商家特卖</text>
        </view>
        <view class="special-tags">
          <text class="special-tag">厂家优惠</text>
          <text class="special-tag">商家共赢</text>
        </view>
        <view class="product-grid">
          <view class="grid-item" v-for="(product, index) in specialProducts" :key="index" @click="goToDetail(product.id)">
            <image class="grid-image" :src="product.image" mode="aspectFill"></image>
            <text class="grid-name">{{ product.name }}</text>
            <view class="grid-footer">
              <view class="price-box">
                <text class="grid-price">¥{{ product.price }}</text>
                <text class="grid-unit">/{{ product.unit }}</text>
              </view>
              <view class="add-cart-btn">
                <image class="cart-icon" src="/static/icons/cart-add.png" mode="aspectFit"></image>
              </view>
            </view>
            <text class="grid-desc">{{ product.desc }}</text>
          </view>
        </view>
        <view class="dots">
          <view class="dot active"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="footer-info">
        <text class="footer-text">经营者：广州商香贸易公司</text>
        <text class="footer-text">请确认本店主: 经营者 17798807798988 ☎</text>
      </view>
    </scroll-view>

  </view>
</template>

<script>
import ShareCanvas from './components/share-canvas.vue'
export default {
  components: {
    ShareCanvas
  },
  data() {
    return {
      banners: [
        '/static/images/banner1.jpg',
        '/static/images/banner2.jpg',
        '/static/images/banner3.jpg'
      ],
      newProducts: [
        {
          id: 1,
          name: '修护精华霜/修护精华保湿...',
          price: '68.9',
          desc: '零售不发货',
          image: '/static/products/product1.jpg'
        },
        {
          id: 2,
          name: '修护精华霜/修护精华保湿...',
          price: '68.9',
          desc: '零售不发货',
          image: '/static/products/product2.jpg'
        },
        {
          id: 3,
          name: '修护精华霜/修护精华保湿...',
          price: '68.9',
          desc: '零售不发货',
          image: '/static/products/product3.jpg'
        }
      ],
      hotProducts: [
        {
          id: 1,
          name: 'SK-II神仙四部曲修护精华霜试用装 35ml装',
          price: '29.9',
          unit: '套',
          badge: 'new',
          badgeText: '新人',
          image: '/static/products/hot1.jpg'
        },
        {
          id: 2,
          name: 'SK-II神仙四部曲修护精华霜试用装 35ml装',
          price: '29.9',
          unit: '套',
          badge: 'hot',
          badgeText: '热卖',
          image: '/static/products/hot2.jpg'
        },
        {
          id: 3,
          name: 'SK-II神仙四部曲修护精华霜试用装 35ml装',
          price: '29.9',
          unit: '套',
          badge: 'hot',
          badgeText: '热卖',
          image: '/static/products/hot3.jpg'
        }
      ],
      specialProducts: [
        {
          id: 1,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special1.jpg'
        },
        {
          id: 2,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special2.jpg'
        },
        {
          id: 3,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special3.jpg'
        },
        {
          id: 4,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special4.jpg'
        },
        {
          id: 5,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special5.jpg'
        },
        {
          id: 6,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special6.jpg'
        }
      ]
    }
  },
  methods: {
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/product/detail?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(90deg, #e64340 0%, #f55f5a 100%);
  color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.logo {
  font-size: 36rpx;
  font-weight: bold;
}

.icon {
  width: 40rpx;
  height: 40rpx;
}

.badge {
  padding: 4rpx 16rpx;
  border: 2rpx solid #fff;
  border-radius: 30rpx;
}

.badge-text {
  font-size: 24rpx;
}

.header-right {
  display: flex;
  gap: 30rpx;
  align-items: center;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(90deg, #e64340 0%, #f55f5a 100%);
  gap: 20rpx;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #fff;
  border-radius: 60rpx;
  gap: 16rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999;
}

.scan-icon {
  width: 48rpx;
  height: 48rpx;
}

/* 分类导航 */
.category-nav {
  display: flex;
  padding: 24rpx 30rpx;
  background-color: #fff;
  white-space: nowrap;
}

.nav-item {
  display: inline-block;
  padding: 12rpx 32rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 40rpx;
  
  &.active {
    color: #e64340;
    font-weight: bold;
    border-bottom: 4rpx solid #e64340;
  }
}

/* 主内容 */
.main-content {
  flex: 1;
  overflow-y: auto;
}

/* 轮播图 */
.banner {
  height: 400rpx;
  position: relative;
  margin-bottom: 20rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-content {
  position: absolute;
  left: 60rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.banner-title {
  display: block;
  font-size: 48rpx;
  font-weight: 300;
  margin-bottom: 10rpx;
}

.banner-subtitle {
  display: block;
  font-size: 48rpx;
  font-weight: 300;
  margin-bottom: 40rpx;
}

.banner-button {
  padding: 16rpx 48rpx;
  border: 2rpx solid #999;
  border-radius: 40rpx;
  display: inline-block;
}

.banner-button-text {
  font-size: 24rpx;
  color: #666;
}

/* 公告 */
.notice {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.notice-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}

.notice-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.notice-more {
  font-size: 26rpx;
  color: #999;
}

/* 区块 */
.section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  &.special {
    margin-bottom: 20rpx;
  }
}

.section-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}

.section-subtitle {
  font-size: 24rpx;
  color: #999;
}

/* 新品推荐 */
.product-scroll {
  white-space: nowrap;
}

.product-card {
  display: inline-block;
  width: 220rpx;
  margin-right: 20rpx;
  vertical-align: top;
}

.product-image {
  width: 220rpx;
  height: 220rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.product-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.product-price {
  font-size: 32rpx;
  color: #e64340;
  font-weight: bold;
}

.add-cart-btn {
  width: 48rpx;
  height: 48rpx;
  background-color: #e64340;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon {
  width: 28rpx;
  height: 28rpx;
}

.product-desc {
  font-size: 22rpx;
  color: #999;
}

/* 热销榜单 */
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.hot-item {
  display: flex;
  gap: 24rpx;
  position: relative;
}

.hot-badge {
  position: absolute;
  left: 0;
  top: 0;
  width: 80rpx;
  height: 80rpx;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.badge-new {
    background-color: #ff6b35;
  }
  
  &.badge-hot {
    background-color: #ffb800;
  }
}

.badge-label {
  font-size: 22rpx;
  color: #fff;
  font-weight: bold;
}

.hot-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.hot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hot-name {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
}

.hot-footer {
  display: flex;
  align-items: flex-end;
  gap: 20rpx;
}

.price-box {
  display: flex;
  align-items: baseline;
}

.hot-price {
  font-size: 36rpx;
  color: #e64340;
  font-weight: bold;
}

.hot-unit {
  font-size: 24rpx;
  color: #e64340;
}

.hot-tags {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.tag {
  display: inline-block;
  padding: 4rpx 12rpx;
  background-color: #f5f5f5;
  font-size: 20rpx;
  color: #999;
  border-radius: 4rpx;
}

/* 商家特卖 */
.special-tags {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.special-tag {
  padding: 8rpx 24rpx;
  background-color: #fff5f0;
  color: #ff6b35;
  font-size: 24rpx;
  border-radius: 4rpx;
  border: 2rpx solid #ff6b35;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.grid-image {
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.grid-name {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 68rpx;
}

.grid-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.grid-price {
  font-size: 28rpx;
  color: #e64340;
  font-weight: bold;
}

.grid-unit {
  font-size: 20rpx;
  color: #e64340;
}

.grid-desc {
  font-size: 20rpx;
  color: #999;
}

/* 分页点 */
.dots {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  
  &.active {
    background-color: #e64340;
    width: 32rpx;
    border-radius: 6rpx;
  }
}

/* 底部信息 */
.footer-info {
  padding: 40rpx 30rpx;
  text-align: center;
  background-color: #fff;
}

.footer-text {
  display: block;
  font-size: 24rpx;
  color: #999;
  line-height: 2;
}

</style>
