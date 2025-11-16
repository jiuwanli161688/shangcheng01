<template>
  <view class="page-order-list">
    <!-- 订单状态筛选 -->
    <view class="order-tabs">
      <view 
        class="tab-item"
        v-for="tab in orderTabs"
        :key="tab.status"
        :class="{ active: currentStatus === tab.status }"
        @click="switchTab(tab.status)"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view 
      class="order-scroll" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="order-list">
        <view class="order-item" v-for="order in orderList" :key="order.id">
          <!-- 订单头部 -->
          <view class="order-header">
            <text class="order-no">订单号: {{ order.orderNo }}</text>
            <text class="order-status">{{ getStatusText(order.status) }}</text>
          </view>

          <!-- 订单商品 -->
          <view class="order-goods">
            <view class="goods-item" v-for="item in order.items" :key="item.id">
              <image class="goods-image" :src="item.image" mode="aspectFill"></image>
              <view class="goods-info">
                <text class="goods-title">{{ item.title }}</text>
                <text class="goods-spec" v-if="item.spec">{{ item.spec }}</text>
                <view class="goods-price">
                  <text class="price">¥{{ item.price }}</text>
                  <text class="quantity">x{{ item.quantity }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 订单信息 -->
          <view class="order-info">
            <text class="total-amount">共{{ order.itemCount }}件商品 合计: ¥{{ order.actualAmount }}</text>
          </view>

          <!-- 订单操作 -->
          <view class="order-actions">
            <view 
              class="action-btn"
              v-for="action in getOrderActions(order.status)"
              :key="action.type"
              :class="action.className"
              @click="handleOrderAction(order, action.type)"
            >
              <text>{{ action.text }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
      </view>

      <view class="no-more" v-else-if="orderList.length > 0">
        <text>没有更多订单了</text>
      </view>

      <!-- 空状态 -->
      <empty-state 
        v-else 
        :title="emptyTitle" 
        :tip="emptyTip"
        @action="goShopping"
      />
    </scroll-view>
  </view>
</template>

<script>
import EmptyState from '@/components/empty-state/empty-state'

export default {
  components: {
    EmptyState
  },

  data() {
    return {
      orderList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      pageSize: 10,
      currentStatus: '',
      orderTabs: [
        { status: '', name: '全部' },
        { status: '0', name: '待付款' },
        { status: '1', name: '待发货' },
        { status: '2', name: '待收货' },
        { status: '3', name: '待评价' },
        { status: '4', name: '已完成' }
      ]
    }
  },

  computed: {
    emptyTitle() {
      const statusMap = {
        '': '暂无订单',
        '0': '暂无待付款订单',
        '1': '暂无待发货订单',
        '2': '暂无待收货订单',
        '3': '暂无待评价订单',
        '4': '暂无已完成订单'
      }
      return statusMap[this.currentStatus] || '暂无订单'
    },
    
    emptyTip() {
      return this.currentStatus === '' ? '去逛逛吧' : ''
    }
  },

  onLoad(options) {
    this.currentStatus = options.status || ''
    this.loadOrderList()
  },

  onPullDownRefresh() {
    this.onRefresh()
  },

  onReachBottom() {
    this.loadMore()
  },

  methods: {
    // 加载订单列表
    async loadOrderList() {
      if (this.loading) return

      try {
        this.loading = true

        const params = {
          status: this.currentStatus,
          page: this.page,
          pageSize: this.pageSize
        }

        const res = await this.$http.get('/order/list', params)

        if (this.page === 1) {
          this.orderList = res.data.list
        } else {
          this.orderList = [...this.orderList, ...res.data.list]
        }

        this.hasMore = res.data.hasMore
      } catch (error) {
        console.error('订单列表加载失败:', error)
      } finally {
        this.loading = false
        this.refreshing = false
        uni.stopPullDownRefresh()
      }
    },

    // 切换标签
    switchTab(status) {
      if (this.currentStatus === status) return
      
      this.currentStatus = status
      this.page = 1
      this.hasMore = true
      this.loadOrderList()
    },

    // 下拉刷新
    async onRefresh() {
      this.refreshing = true
      this.page = 1
      await this.loadOrderList()
    },

    // 加载更多
    async loadMore() {
      if (this.loading || !this.hasMore) return

      this.page++
      await this.loadOrderList()
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': '待付款',
        '1': '待发货',
        '2': '待收货',
        '3': '待评价',
        '4': '已完成',
        '-1': '已取消'
      }
      return statusMap[status] || '未知状态'
    },

    // 获取订单操作按钮
    getOrderActions(status) {
      const actions = []
      
      switch (status) {
        case '0': // 待付款
          actions.push(
            { type: 'cancel', text: '取消订单', className: 'btn-default' },
            { type: 'pay', text: '立即支付', className: 'btn-primary' }
          )
          break
        case '1': // 待发货
          actions.push(
            { type: 'cancel', text: '申请退款', className: 'btn-default' }
          )
          break
        case '2': // 待收货
          actions.push(
            { type: 'confirm', text: '确认收货', className: 'btn-primary' }
          )
          break
        case '3': // 待评价
          actions.push(
            { type: 'review', text: '评价', className: 'btn-primary' }
          )
          break
        case '4': // 已完成
          actions.push(
            { type: 'delete', text: '删除订单', className: 'btn-default' },
            { type: 'buyAgain', text: '再次购买', className: 'btn-primary' }
          )
          break
      }
      
      return actions
    },

    // 订单操作
    handleOrderAction(order, actionType) {
      switch (actionType) {
        case 'pay':
          this.handlePayOrder(order)
          break
        case 'cancel':
          this.handleCancelOrder(order)
          break
        case 'confirm':
          this.handleConfirmOrder(order)
          break
        case 'review':
          this.handleReviewOrder(order)
          break
        case 'delete':
          this.handleDeleteOrder(order)
          break
        case 'buyAgain':
          this.handleBuyAgain(order)
          break
      }
    },

    // 支付订单
    handlePayOrder(order) {
      uni.navigateTo({
        url: `/pages/order/payment?id=${order.id}`
      })
    },

    // 取消订单
    handleCancelOrder(order) {
      uni.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$http.post('/order/cancel', { orderId: order.id })
              uni.showToast({ title: '取消成功', icon: 'success' })
              this.onRefresh()
            } catch (error) {
              console.error('取消订单失败:', error)
            }
          }
        }
      })
    },

    // 确认收货
    handleConfirmOrder(order) {
      uni.showModal({
        title: '提示',
        content: '请确认已收到商品',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$http.post('/order/confirm', { orderId: order.id })
              uni.showToast({ title: '确认成功', icon: 'success' })
              this.onRefresh()
            } catch (error) {
              console.error('确认收货失败:', error)
            }
          }
        }
      })
    },

    // 评价订单
    handleReviewOrder(order) {
      uni.navigateTo({
        url: `/pages/order/review?id=${order.id}`
      })
    },

    // 删除订单
    handleDeleteOrder(order) {
      uni.showModal({
        title: '提示',
        content: '确定要删除订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$http.delete('/order/delete', { orderId: order.id })
              uni.showToast({ title: '删除成功', icon: 'success' })
              this.onRefresh()
            } catch (error) {
              console.error('删除订单失败:', error)
            }
          }
        }
      })
    },

    // 再次购买
    handleBuyAgain(order) {
      const items = order.items.map(item => ({
        id: item.goodsId,
        specId: item.specId,
        title: item.title,
        price: item.price,
        image: item.image,
        spec: item.spec,
        quantity: item.quantity
      }))
      
      uni.navigateTo({
        url: `/subpackages/order/pages/confirm?items=${encodeURIComponent(JSON.stringify(items))}`
      })
    },

    // 去购物
    goShopping() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-order-list {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .order-tabs {
    display: flex;
    background: #fff;
    border-bottom: 1rpx solid $border-color-light;
    
    .tab-item {
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
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 4rpx;
          background: $primary-color;
          border-radius: 2rpx;
        }
      }
    }
  }

  .order-scroll {
    flex: 1;
  }

  .order-list {
    .order-item {
      background: #fff;
      margin-bottom: 20rpx;
      padding: 0 30rpx;
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid $border-color-light;
        
        .order-no {
          font-size: 26rpx;
          color: $text-color-light;
        }
        
        .order-status {
          font-size: 26rpx;
          color: $primary-color;
        }
      }
      
      .order-goods {
        padding: 20rpx 0;
        border-bottom: 1rpx solid $border-color-light;
        
        .goods-item {
          display: flex;
          margin-bottom: 20rpx;
          
          &:last-child {
            margin-bottom: 0;
          }
          
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
            
            .goods-price {
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .price {
                font-size: 26rpx;
                color: $primary-color;
                font-weight: bold;
              }
              
              .quantity {
                font-size: 24rpx;
                color: $text-color-light;
              }
            }
          }
        }
      }
      
      .order-info {
        padding: 20rpx 0;
        text-align: right;
        
        .total-amount {
          font-size: 26rpx;
          color: $text-color-primary;
        }
      }
      
      .order-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 20rpx 0;
        gap: 20rpx;
        
        .action-btn {
          padding: 12rpx 24rpx;
          border-radius: 20rpx;
          font-size: 24rpx;
          
          &.btn-default {
            background: $bg-color;
            color: $text-color-regular;
            border: 1rpx solid $border-color-base;
          }
          
          &.btn-primary {
            background: $primary-color;
            color: #fff;
          }
        }
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
</style>