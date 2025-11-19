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
    <scroll-view class="category-nav" scroll-x :show-scrollbar="false">
			<v-tabs v-model="currentCategory" :tabs="categories" @change="selectCategory" lineColor="linear-gradient(to right, red, gold)" activeColor="red"></v-tabs>
    </scroll-view>

    <scroll-view class="main-content" scroll-y>
      <!-- 轮播图 -->
      <swiper class="banner" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay circular>
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image class="banner-image" :src="banner" mode="aspectFill"></image>
        </swiper-item>
      </swiper>

      <!-- 公告 -->
      <view v-if="false" class="notice">
        <image class="notice-icon" src="/static/icons/notice.png" mode="aspectFit"></image>
        <text class="notice-text">请关注本店发布的公告通知</text>
        <text class="notice-more">更多</text>
      </view>
      <view class="notice">
         <Notice 
					ref="importantNotice"
					text="请关注本店发布的公告通知1"
					:duration="8"
					background-color="#fee2e2"
					text-color="#dc2626"
					height="90rpx"
					@click="onNoticeClick"
				/>
      </view>

      <!-- 新品推荐 -->
      <view class="section">
        <view class="section-header">
          <image class="section-icon" src="/static/icons/new.png" mode="aspectFit"></image>
          <text class="section-title">新品推荐</text>
          <text class="section-subtitle">本店上新推荐优质商品</text>
        </view>
        <swiper 
          class="product-swiper" 
          :indicator-dots="true"
          :indicator-active-color="'#e64340'"
          :indicator-color="'#e0e0e0'"
          circular
        >
          <swiper-item v-for="(page, pageIndex) in newProductPages" :key="pageIndex">
            <view class="swiper-page">
              <view class="product-card" v-for="(product, index) in page" :key="index" @click="goToDetail(product.id)">
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
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 热销榜单 -->
      <view class="section">
        <view class="section-header">
          <image class="section-icon" src="/static/icons/hot.png" mode="aspectFit"></image>
          <text class="section-title">热销榜单</text>
          <text class="section-subtitle">看看大家都在买什么</text>
        </view>
        <swiper 
          class="hot-swiper" 
          :indicator-dots="true"
          :indicator-active-color="'#e64340'"
          :indicator-color="'#e0e0e0'"
          circular
        >
          <swiper-item v-for="(page, pageIndex) in hotProductPages" :key="pageIndex">
            <view class="hot-list">
              <view class="hot-item" v-for="(item, index) in page" :key="index" @click="goToDetail(item.id)">
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
          </swiper-item>
        </swiper>
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
        <swiper 
          class="special-swiper" 
          :indicator-dots="true"
          :indicator-active-color="'#e64340'"
          :indicator-color="'#e0e0e0'"
          circular
        >
          <swiper-item v-for="(page, pageIndex) in specialProductPages" :key="pageIndex">
            <view class="product-grid">
              <view class="grid-item" v-for="(product, index) in page" :key="index" @click="goToDetail(product.id)">
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
          </swiper-item>
        </swiper>
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
import Notice from '@/components/notice/notice.vue'

export default {
  components: {
    Notice
  },
  data() {
    return {
      currentCategory: 0,
      categories: ['推荐', '美妆个护', '营养美食', '居家生活', '手机', '其他', '电脑'],
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
        },
        {
          id: 4,
          name: '修护精华霜/修护精华保湿...',
          price: '68.9',
          desc: '零售不发货',
          image: '/static/products/product1.jpg'
        },
        {
          id: 5,
          name: '修护精华霜/修护精华保湿...',
          price: '68.9',
          desc: '零售不发货',
          image: '/static/products/product2.jpg'
        },
        {
          id: 6,
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
        },
        {
          id: 4,
          name: 'SK-II神仙四部曲修护精华霜试用装 35ml装',
          price: '29.9',
          unit: '套',
          badge: 'new',
          badgeText: '新人',
          image: '/static/products/hot1.jpg'
        },
        {
          id: 5,
          name: 'SK-II神仙四部曲修护精华霜试用装 35ml装',
          price: '29.9',
          unit: '套',
          badge: 'hot',
          badgeText: '热卖',
          image: '/static/products/hot2.jpg'
        },
        {
          id: 6,
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
        },
        {
          id: 7,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special1.jpg'
        },
        {
          id: 8,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special2.jpg'
        },
        {
          id: 9,
          name: '法国兰LANCOM 小黑瓶眼霜 15ml',
          price: '299',
          unit: '套',
          desc: '零售不发货',
          image: '/static/products/special3.jpg'
        }
      ]
    }
  },
  computed: {
    newProductPages() {
      const pageSize = 3
      const pages = []
      for (let i = 0; i < this.newProducts.length; i += pageSize) {
        pages.push(this.newProducts.slice(i, i + pageSize))
      }
      return pages
    },
    hotProductPages() {
      const pageSize = 3
      const pages = []
      for (let i = 0; i < this.hotProducts.length; i += pageSize) {
        pages.push(this.hotProducts.slice(i, i + pageSize))
      }
      return pages
    },
    specialProductPages() {
      const pageSize = 6
      const pages = []
      for (let i = 0; i < this.specialProducts.length; i += pageSize) {
        pages.push(this.specialProducts.slice(i, i + pageSize))
      }
      return pages
    }
  },
  methods: {
    selectCategory(index) {
      this.currentCategory = index
      // 可以在这里添加筛选逻辑
      console.log('[v0] 选中分类:', this.categories[index])
    },
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
	padding: 0;
}

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

.category-nav {
  display: flex;
  padding: 20rpx 26rpx;
  background-color: #fff;
  white-space: nowrap;
	box-sizing: border-box;
}

.nav-item {
  display: inline-block;
  padding: 12rpx 32rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 40rpx;
  position: relative;
  transition: all 0.3s ease;
  
  /* 激活状态使用渐变色底部边框 */
  &.active {
    color: #e64340;
    font-weight: bold;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 4rpx;
      background: linear-gradient(90deg, #e64340 0%, #f55f5a 100%);
      border-radius: 2rpx;
    }
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.banner {
  height: 400rpx;
  position: relative;
  margin-bottom: 20rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

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

.product-swiper {
  height: 380rpx;
  
  ::v-deep .uni-swiper-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 6rpx;
    
    &.uni-swiper-dot-active {
      width: 32rpx !important;
    }
  }
}

.swiper-page {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx;
}

.product-card {
  flex: 1;
  width: 220rpx;
}

.product-image {
  width: 100%;
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

.hot-swiper {
  height: 700rpx;
  
  ::v-deep .uni-swiper-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 6rpx;
    
    &.uni-swiper-dot-active {
      width: 32rpx !important;
    }
  }
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 30rpx;
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

.special-swiper {
  height: 560rpx;
  
  ::v-deep .uni-swiper-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 6rpx;
    
    &.uni-swiper-dot-active {
      width: 32rpx !important;
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 0 30rpx;
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
