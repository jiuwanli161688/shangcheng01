<template>
  <view class="page-goods-list">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view 
        class="filter-item"
        :class="{ active: sortType === 'default' }"
        @click="handleSortChange('default')"
      >
        <text>综合</text>
      </view>
      <view 
        class="filter-item"
        :class="{ active: sortType === 'sales' }"
        @click="handleSortChange('sales')"
      >
        <text>销量</text>
      </view>
      <view 
        class="filter-item"
        :class="{ active: sortType === 'price' }"
        @click="handlePriceSort"
      >
        <text>价格</text>
        <view class="sort-arrows">
          <image 
            :src="sortOrder === 'asc' ? '/static/icons/arrow-up-active.png' : '/static/icons/arrow-up.png'" 
            mode="aspectFit"
          ></image>
          <image 
            :src="sortOrder === 'desc' ? '/static/icons/arrow-down-active.png' : '/static/icons/arrow-down.png'" 
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <view 
        class="filter-item"
        @click="showFilterModal = true"
      >
        <text>筛选</text>
        <image src="/static/icons/filter.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view 
      class="goods-scroll" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <goods-list :goods-list="goodsList" @item-click="handleGoodsClick" />
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
      </view>

      <view class="no-more" v-else-if="goodsList.length > 0">
        <text>没有更多商品了</text>
      </view>

      <!-- 空状态 -->
      <empty-state 
        v-else 
        title="暂无商品" 
        tip="换个筛选条件试试"
        @action="resetFilter"
      />
    </scroll-view>

    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom" background-color="#fff">
      <view class="filter-modal">
        <view class="modal-header">
          <text class="modal-title">筛选</text>
          <text class="modal-close" @click="showFilterModal = false">完成</text>
        </view>
        
        <view class="filter-content">
          <!-- 价格区间 -->
          <view class="filter-group">
            <text class="group-title">价格区间</text>
            <view class="price-range">
              <input 
                class="price-input" 
                type="number" 
                placeholder="最低价" 
                v-model="filterParams.minPrice"
              />
              <text class="price-separator">-</text>
              <input 
                class="price-input" 
                type="number" 
                placeholder="最高价" 
                v-model="filterParams.maxPrice"
              />
            </view>
          </view>

          <!-- 品牌筛选 -->
          <view class="filter-group" v-if="brandList.length > 0">
            <text class="group-title">品牌</text>
            <view class="brand-list">
              <view 
                class="brand-item"
                v-for="brand in brandList"
                :key="brand.id"
                :class="{ active: filterParams.brandId === brand.id }"
                @click="filterParams.brandId = filterParams.brandId === brand.id ? '' : brand.id"
              >
                <text>{{ brand.name }}</text>
              </view>
            </view>
          </view>

          <!-- 重置和确认 -->
          <view class="filter-actions">
            <view class="btn reset" @click="resetFilter">重置</view>
            <view class="btn confirm" @click="confirmFilter">确认</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import GoodsList from '@/components/goods-list/goods-list'
import EmptyState from '@/components/empty-state/empty-state'

export default {
  components: {
    GoodsList,
    EmptyState
  },

  data() {
    return {
      goodsList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      pageSize: 10,
      sortType: 'default',
      sortOrder: 'desc',
      showFilterModal: false,
      filterParams: {
        minPrice: '',
        maxPrice: '',
        brandId: ''
      },
      brandList: [],
      queryParams: {}
    }
  },

  onLoad(options) {
    this.queryParams = options
    this.loadGoodsList()
    this.loadBrandList()
  },

  onPullDownRefresh() {
    this.onRefresh()
  },

  onReachBottom() {
    this.loadMore()
  },

  methods: {
    // 加载商品列表
    async loadGoodsList() {
      if (this.loading) return

      try {
        this.loading = true

        const params = {
          ...this.queryParams,
          page: this.page,
          pageSize: this.pageSize,
          sortType: this.sortType,
          sortOrder: this.sortOrder,
          ...this.filterParams
        }

        const res = await this.$http.get('/goods/list', params)

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
        this.refreshing = false
        uni.stopPullDownRefresh()
      }
    },

    // 加载品牌列表
    async loadBrandList() {
      try {
        const res = await this.$http.get('/goods/brands', {
          categoryId: this.queryParams.categoryId
        })
        this.brandList = res.data
      } catch (error) {
        console.error('品牌列表加载失败:', error)
      }
    },

    // 下拉刷新
    async onRefresh() {
      this.refreshing = true
      this.page = 1
      await this.loadGoodsList()
    },

    // 加载更多
    async loadMore() {
      if (this.loading || !this.hasMore) return

      this.page++
      await this.loadGoodsList()
    },

    // 排序改变
    handleSortChange(type) {
      this.sortType = type
      this.sortOrder = 'desc'
      this.page = 1
      this.loadGoodsList()
    },

    // 价格排序
    handlePriceSort() {
      this.sortType = 'price'
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      this.page = 1
      this.loadGoodsList()
    },

    // 确认筛选
    confirmFilter() {
      this.showFilterModal = false
      this.page = 1
      this.loadGoodsList()
    },

    // 重置筛选
    resetFilter() {
      this.filterParams = {
        minPrice: '',
        maxPrice: '',
        brandId: ''
      }
      this.sortType = 'default'
      this.sortOrder = 'desc'
      this.page = 1
      this.loadGoodsList()
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
.page-goods-list {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .filter-bar {
    display: flex;
    background: #fff;
    border-bottom: 1rpx solid $border-color-light;
    
    .filter-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20rpx 0;
      position: relative;
      
      text {
        font-size: 28rpx;
        color: $text-color-regular;
      }
      
      &.active {
        text {
          color: $primary-color;
          font-weight: bold;
        }
      }
      
      .sort-arrows {
        display: flex;
        flex-direction: column;
        margin-left: 10rpx;
        
        image {
          width: 12rpx;
          height: 12rpx;
          margin: 2rpx 0;
        }
      }
      
      image {
        width: 24rpx;
        height: 24rpx;
        margin-left: 10rpx;
      }
    }
  }

  .goods-scroll {
    flex: 1;
  }

  .load-more, .no-more {
    padding: 40rpx 0;
    text-align: center;
    
    text {
      font-size: 24rpx;
      color: $text-color-light;
    }
  }

  .filter-modal {
    max-height: 70vh;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid $border-color-light;
      
      .modal-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-color-primary;
      }
      
      .modal-close {
        font-size: 28rpx;
        color: $primary-color;
      }
    }
    
    .filter-content {
      padding: 30rpx;
      
      .filter-group {
        margin-bottom: 40rpx;
        
        .group-title {
          font-size: 28rpx;
          color: $text-color-primary;
          margin-bottom: 20rpx;
          display: block;
        }
        
        .price-range {
          display: flex;
          align-items: center;
          
          .price-input {
            flex: 1;
            height: 80rpx;
            border: 1rpx solid $border-color-base;
            padding: 0 20rpx;
            font-size: 28rpx;
          }
          
          .price-separator {
            margin: 0 20rpx;
            color: $text-color-light;
          }
        }
        
        .brand-list {
          display: flex;
          flex-wrap: wrap;
          gap: 20rpx;
          
          .brand-item {
            padding: 16rpx 32rpx;
            border: 1rpx solid $border-color-base;
            font-size: 26rpx;
            color: $text-color-regular;
            
            &.active {
              border-color: $primary-color;
              color: $primary-color;
              background: lighten($primary-color, 45%);
            }
          }
        }
      }
      
      .filter-actions {
        display: flex;
        gap: 20rpx;
        margin-top: 40rpx;
        
        .btn {
          flex: 1;
          height: 80rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28rpx;
          font-weight: bold;
          
          &.reset {
            background: $bg-color;
            color: $text-color-regular;
            border: 1rpx solid $border-color-base;
          }
          
          &.confirm {
            background: $primary-color;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>