<template>
  <view class="page-index">
    <!-- 自定义导航栏 -->
    <!-- <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content">
        <text class="navbar-title">商城首页</text>
        <search-bar @search="handleSearch" />
      </view>
    </view> -->
    <custom-navbar 
      class="custom-navbar"
      :title="navbarTitle" 
      :class="{ 'navbar-transparent': isTransparent }"
    />
    <!-- 页面内容 -->
    <scroll-view 
      class="page-content" 
      scroll-y 
      :style="{ height: scrollViewHeight }"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 轮播图 -->
      <banner :banner-list="bannerList" @banner-click="handleBannerClick" />

      <!-- 分类导航 -->
      <category-nav :category-list="categoryList" @category-click="handleCategoryClick" />

      <!-- 公告 -->
      <view class="notice-section" v-if="noticeList.length > 0">
        <image class="notice-icon" src="/static/icons/notice.png" mode="aspectFit"></image>
        <swiper class="notice-swiper" vertical autoplay circular interval="3000">
          <swiper-item v-for="(notice, index) in noticeList" :key="index">
            <text class="notice-text" @click="handleNoticeClick(notice)">{{ notice.title }}</text>
          </swiper-item>
        </swiper>
      </view>

      <!-- 推荐商品 -->
      <recommend-section 
        :recommend-list="recommendList" 
        :loading="loading"
        @goods-click="handleGoodsClick"
        @more-click="handleMoreClick"
      />

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text class="load-more-text">{{ loading ? '加载中...' : '上拉加载更多' }}</text>
      </view>

      <!-- 没有更多 -->
      <view class="no-more" v-else-if="recommendList.length > 0">
        <text class="no-more-text">没有更多商品了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import SearchBar from '@/components/search-bar/search-bar'
import CustomNavbar from '@/components/custom-navbar/custom-navbar'
// import Banner from './components/banner'
import CategoryNav from './components/category-nav'
import RecommendSection from './components/recommend-section'

export default {
  components: {
    SearchBar,
    // Banner,
    CustomNavbar,
    CategoryNav,
    RecommendSection
  },
  
  data() {
    return {
      bannerList: [],
      categoryList: [],
      noticeList: [],
      recommendList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      pageSize: 10,
      statusBarHeight: 0,
      scrollViewHeight: '0px',

      navbarTitle: '商城首页',
      isTransparent: true,
    }
  },
  
  computed: {
    ...mapState('user', ['isLogin'])
  },
  
  onLoad() {
    this.calculateScrollViewHeight()
    this.loadHomeData()
  },
  
  onShow() {
    // 更新购物车数量
    if (this.isLogin) {
      this.$store.dispatch('cart/getCartList')
    }
  },
  
  onPullDownRefresh() {
    this.onRefresh()
  },
  
  onReachBottom() {
    this.loadMore()
  },
  
  methods: {
    // 计算滚动区域高度
    calculateScrollViewHeight() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      
      // 计算可用高度：屏幕高度 - 状态栏高度 - 导航栏高度 - 底部安全区域
      const navBarHeight = 44 // 导航栏标准高度
      const safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
      const contentHeight = systemInfo.windowHeight - this.statusBarHeight - navBarHeight - safeAreaBottom
      
      this.scrollViewHeight = contentHeight + 'px'
    },
    
    // 加载首页数据
    async loadHomeData() {
      try {
        this.loading = true
        
        const [bannerRes, categoryRes, noticeRes, recommendRes] = await Promise.all([
          this.$http.get('/home/banner'),
          this.$http.get('/home/categories'),
          this.$http.get('/home/notice'),
          this.$http.get('/home/recommend', { page: this.page, pageSize: this.pageSize })
        ])
        
        this.bannerList = bannerRes.data
        this.categoryList = categoryRes.data
        this.noticeList = noticeRes.data
        this.recommendList = recommendRes.data.list
        this.hasMore = recommendRes.data.hasMore
        
      } catch (error) {
        console.error('首页数据加载失败:', error)
      } finally {
        this.loading = false
        this.refreshing = false
        uni.stopPullDownRefresh()
      }
    },
    
    // 下拉刷新
    async onRefresh() {
      this.refreshing = true
      this.page = 1
      await this.loadHomeData()
    },
    
    // 加载更多
    async loadMore() {
      if (this.loading || !this.hasMore) return
      
      try {
        this.loading = true
        this.page++
        
        const res = await this.$http.get('/home/recommend', { 
          page: this.page, 
          pageSize: this.pageSize 
        })
        
        this.recommendList = [...this.recommendList, ...res.data.list]
        this.hasMore = res.data.hasMore
        
      } catch (error) {
        console.error('加载更多失败:', error)
        this.page--
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    handleSearch(keyword) {
      uni.navigateTo({
        url: `/pages/goods/list?keyword=${encodeURIComponent(keyword)}`
      })
    },
    
    // 轮播图点击
    handleBannerClick(banner) {
      if (banner.linkType === 'goods') {
        uni.navigateTo({
          url: `/subpackages/goods/pages/detail?id=${banner.linkId}`
        })
      } else if (banner.linkType === 'category') {
        uni.navigateTo({
          url: `/pages/category/category?categoryId=${banner.linkId}`
        })
      } else if (banner.linkType === 'url') {
        // 跳转外部链接
        uni.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(banner.linkUrl)}`
        })
      }
    },
    
    // 分类点击
    handleCategoryClick(category) {
      uni.navigateTo({
        url: `/pages/goods/list?categoryId=${category.id}`
      })
    },
    
    // 公告点击
    handleNoticeClick(notice) {
      uni.navigateTo({
        url: `/pages/notice/detail?id=${notice.id}`
      })
    },
    
    // 商品点击
    handleGoodsClick(goods) {
      uni.navigateTo({
        url: `/subpackages/goods/pages/detail?id=${goods.id}`
      })
    },
    
    // 更多点击
    handleMoreClick() {
      uni.navigateTo({
        url: '/pages/goods/list?type=recommend'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-index {
  .custom-navbar {
    background: linear-gradient(135deg, $primary-color, lighten($primary-color, 10%));
    
    .navbar-content {
      height: 44px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 30rpx;
      
      .navbar-title {
        color: #fff;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
    }
  }
  
  .page-content {
    background: $bg-color;
  }
  
  .notice-section {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background: #fff;
    margin: 20rpx 0;
    
    .notice-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 20rpx;
    }
    
    .notice-swiper {
      flex: 1;
      height: 40rpx;
      
      .notice-text {
        font-size: 24rpx;
        color: $text-color-regular;
        line-height: 40rpx;
      }
    }
  }
  
  .load-more, .no-more {
    padding: 40rpx 0;
    text-align: center;
    
    .load-more-text, .no-more-text {
      font-size: 24rpx;
      color: $text-color-light;
    }
  }
}
</style>