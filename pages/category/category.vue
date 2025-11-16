<template>
  <view class="page-category">
    <view class="category-container">
      <!-- 左侧分类导航 -->
      <scroll-view class="left-category" scroll-y>
        <view 
          class="category-item"
          v-for="category in categoryList"
          :key="category.id"
          :class="{ active: currentCategory.id === category.id }"
          @click="switchCategory(category)"
        >
          <text>{{ category.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品内容 -->
      <scroll-view class="right-content" scroll-y @scrolltolower="loadMore">
        <!-- 子分类 -->
        <view class="sub-category" v-if="currentCategory.children && currentCategory.children.length > 0">
          <view 
            class="sub-item"
            v-for="sub in currentCategory.children"
            :key="sub.id"
            @click="handleSubCategoryClick(sub)"
          >
            <image :src="sub.image" mode="aspectFit"></image>
            <text>{{ sub.name }}</text>
          </view>
        </view>

        <!-- 商品列表 -->
        <view class="goods-section">
          <view class="section-header">
            <text class="section-title">热门商品</text>
          </view>
          <goods-list :goods-list="goodsList" @item-click="handleGoodsClick" />
        </view>

        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
        </view>

        <view class="no-more" v-else>
          <text>没有更多商品了</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import GoodsList from '@/components/goods-list/goods-list'

export default {
  components: {
    GoodsList
  },

  data() {
    return {
      categoryList: [],
      currentCategory: {},
      goodsList: [],
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 10
    }
  },

  computed: {
    ...mapState('common', ['systemInfo'])
  },

  onLoad() {
    this.loadCategoryData()
  },

  methods: {
    // 加载分类数据
    async loadCategoryData() {
      try {
        uni.showLoading({ title: '加载中...' })
        
        const [categoryRes, goodsRes] = await Promise.all([
          this.$http.get('/goods/category'),
          this.$http.get('/goods/list', {
            categoryId: this.currentCategory.id,
            page: this.page,
            pageSize: this.pageSize
          })
        ])

        this.categoryList = categoryRes.data
        if (this.categoryList.length > 0) {
          this.currentCategory = this.categoryList[0]
          this.goodsList = goodsRes.data.list
          this.hasMore = goodsRes.data.hasMore
        }

        uni.hideLoading()
      } catch (error) {
        console.error('分类数据加载失败:', error)
        uni.hideLoading()
      }
    },

    // 切换分类
    async switchCategory(category) {
      if (this.currentCategory.id === category.id) return
      
      this.currentCategory = category
      this.page = 1
      this.hasMore = true
      await this.loadGoodsList()
    },

    // 加载商品列表
    async loadGoodsList() {
      if (this.loading) return

      try {
        this.loading = true

        const res = await this.$http.get('/goods/list', {
          categoryId: this.currentCategory.id,
          page: this.page,
          pageSize: this.pageSize
        })

        if (this.page === 1) {
          this.goodsList = res.data.list
        } else {
          this.goodsList = [...this.goodsList, ...res.data.list]
        }

        this.hasMore = res.data.hasMore
      } catch (error) {
        console.error('商品列表加载失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 加载更多
    async loadMore() {
      if (this.loading || !this.hasMore) return

      this.page++
      await this.loadGoodsList()
    },

    // 子分类点击
    handleSubCategoryClick(subCategory) {
      uni.navigateTo({
        url: `/pages/goods/list?categoryId=${subCategory.id}`
      })
    },

    // 商品点击
    handleGoodsClick(goods) {
      uni.navigateTo({
        url: `/subpackages/goods/pages/detail?id=${goods.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-category {
  height: 100vh;
  background: $bg-color;

  .category-container {
    display: flex;
    height: 100%;

    .left-category {
      width: 200rpx;
      
      .category-item {
        padding: 30rpx 20rpx;
        text-align: center;
        border-left: 4rpx solid transparent;
        transition: all 0.3s;

        text {
          font-size: 28rpx;
          color: $text-color-regular;
        }

        &.active {
          border-left-color: $primary-color;
          background: lighten($primary-color, 45%);
          
          text {
            color: $primary-color;
            font-weight: bold;
          }
        }
      }
    }

    .right-content {
      flex: 1;
      padding: 20rpx;

      .sub-category {
        display: flex;
        flex-wrap: wrap;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .sub-item {
          width: 33.33%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20rpx 0;

          image {
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 10rpx;
          }

          text {
            font-size: 24rpx;
            color: $text-color-regular;
          }
        }
      }

      .goods-section {
        .section-header {
          padding: 20rpx 0;
          
          .section-title {
            font-size: 32rpx;
            font-weight: bold;
            color: $text-color-primary;
          }
        }
      }

      .load-more, .no-more {
        padding: 40rpx 0;
        text-align: center;
        
        text {
          font-size: 24rpx;
          color: $text-color-light;
        }
      }
    }
  }
}
</style>