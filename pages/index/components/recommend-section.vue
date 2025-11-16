<template>
  <view class="recommend-section">
    <!-- 标题区域 -->
    <view class="section-header">
      <view class="header-left">
        <image class="title-icon" src="/static/icons/fire.png" mode="aspectFit"></image>
        <text class="section-title">{{ title }}</text>
      </view>
      <view class="header-right" @click="handleMoreClick">
        <text class="more-text">更多</text>
        <image class="more-arrow" src="/static/icons/arrow-right.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="recommend-content">
      <scroll-view 
        class="goods-scroll" 
        scroll-x 
        v-if="scrollable"
        :show-scrollbar="false"
      >
        <view class="scroll-content">
          <view 
            class="goods-item" 
            v-for="goods in recommendList" 
            :key="goods.id"
            @click="handleGoodsClick(goods)"
          >
            <view class="goods-image-wrapper">
              <image class="goods-image" :src="goods.image" mode="aspectFill"></image>
              <!-- 热门标签 -->
              <view class="hot-tag" v-if="goods.isHot">
                <text>热销</text>
              </view>
              <!-- 新品标签 -->
              <view class="new-tag" v-if="goods.isNew">
                <text>新品</text>
              </view>
            </view>
            
            <view class="goods-info">
              <text class="goods-title text-ellipsis">{{ goods.title }}</text>
              <text class="goods-desc text-ellipsis" v-if="goods.desc">{{ goods.desc }}</text>
              
              <view class="goods-bottom">
                <view class="price-section">
                  <text class="current-price">¥{{ goods.price }}</text>
                  <text class="original-price" v-if="goods.originalPrice > goods.price">
                    ¥{{ goods.originalPrice }}
                  </text>
                </view>
                <text class="sales">已售{{ formatSales(goods.sales) }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 网格布局 -->
      <view class="goods-grid" v-else>
        <view 
          class="grid-item" 
          v-for="goods in recommendList" 
          :key="goods.id"
          @click="handleGoodsClick(goods)"
        >
          <view class="goods-image-wrapper">
            <image class="goods-image" :src="goods.image" mode="aspectFill"></image>
            <view class="goods-tags">
              <view class="tag hot" v-if="goods.isHot">热销</view>
              <view class="tag new" v-if="goods.isNew">新品</view>
              <view class="tag discount" v-if="goods.discount">
                {{ goods.discount }}折
              </view>
            </view>
          </view>
          
          <view class="goods-info">
            <text class="goods-title text-multi-ellipsis line-2">{{ goods.title }}</text>
            
            <view class="goods-bottom">
              <view class="price-section">
                <text class="current-price">¥{{ goods.price }}</text>
                <text class="original-price" v-if="goods.originalPrice > goods.price">
                  ¥{{ goods.originalPrice }}
                </text>
              </view>
              <view class="add-cart-btn" @click.stop="handleAddCart(goods)">
                <image src="/static/icons/cart-small.png" mode="aspectFit"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <view class="loading-dots">
        <view class="dot"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RecommendSection',

  props: {
    // 推荐商品列表
    recommendList: {
      type: Array,
      default: () => []
    },
    // 标题
    title: {
      type: String,
      default: '热门推荐'
    },
    // 是否可横向滚动
    scrollable: {
      type: Boolean,
      default: true
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['goods-click', 'more-click', 'add-cart'],

  methods: {
    // 商品点击
    handleGoodsClick(goods) {
      this.$emit('goods-click', goods)
    },

    // 更多点击
    handleMoreClick() {
      this.$emit('more-click')
    },

    // 添加到购物车
    handleAddCart(goods) {
      this.$emit('add-cart', goods)
      
      // 显示添加成功反馈
      uni.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
      })
    },

    // 格式化销量
    formatSales(sales) {
      if (sales >= 10000) {
        return (sales / 10000).toFixed(1) + '万'
      }
      return sales
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend-section {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .header-left {
      display: flex;
      align-items: center;

      .title-icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 15rpx;
      }

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-color-primary;
      }
    }

    .header-right {
      display: flex;
      align-items: center;

      .more-text {
        font-size: 26rpx;
        color: $text-color-light;
        margin-right: 8rpx;
      }

      .more-arrow {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }

  .recommend-content {
    .goods-scroll {
      white-space: nowrap;

      .scroll-content {
        display: inline-flex;
        padding-bottom: 10rpx;

        .goods-item {
          display: inline-block;
          width: 280rpx;
          margin-right: 20rpx;
          background: $bg-color;
          border-radius: 16rpx;
          overflow: hidden;
          vertical-align: top;

          &:last-child {
            margin-right: 0;
          }

          .goods-image-wrapper {
            position: relative;
            width: 100%;
            height: 280rpx;

            .goods-image {
              width: 100%;
              height: 100%;
            }

            .hot-tag, .new-tag {
              position: absolute;
              top: 10rpx;
              left: 10rpx;
              padding: 6rpx 12rpx;
              border-radius: 4rpx;
              font-size: 20rpx;
              color: #fff;
              line-height: 1;
            }

            .hot-tag {
              background: linear-gradient(135deg, #FF6A3C, #FF8E6B);
            }

            .new-tag {
              background: linear-gradient(135deg, #4CD964, #6BE885);
            }
          }

          .goods-info {
            padding: 20rpx;

            .goods-title {
              font-size: 26rpx;
              color: $text-color-primary;
              margin-bottom: 10rpx;
              display: block;
            }

            .goods-desc {
              font-size: 22rpx;
              color: $text-color-light;
              margin-bottom: 15rpx;
              display: block;
            }

            .goods-bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .price-section {
                .current-price {
                  font-size: 28rpx;
                  color: $primary-color;
                  font-weight: bold;
                  margin-right: 8rpx;
                }

                .original-price {
                  font-size: 22rpx;
                  color: $text-color-light;
                  text-decoration: line-through;
                }
              }

              .sales {
                font-size: 20rpx;
                color: $text-color-light;
              }
            }
          }
        }
      }
    }

    .goods-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .grid-item {
        width: 330rpx;
        margin-bottom: 30rpx;
        background: $bg-color;
        border-radius: 16rpx;
        overflow: hidden;

        .goods-image-wrapper {
          position: relative;
          width: 100%;
          height: 330rpx;

          .goods-image {
            width: 100%;
            height: 100%;
          }

          .goods-tags {
            position: absolute;
            top: 10rpx;
            left: 10rpx;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .tag {
              padding: 6rpx 12rpx;
              border-radius: 4rpx;
              font-size: 20rpx;
              color: #fff;
              margin-bottom: 8rpx;
              line-height: 1;

              &.hot {
                background: linear-gradient(135deg, #FF6A3C, #FF8E6B);
              }

              &.new {
                background: linear-gradient(135deg, #4CD964, #6BE885);
              }

              &.discount {
                background: linear-gradient(135deg, #FF9500, #FFB143);
              }
            }
          }
        }

        .goods-info {
          padding: 20rpx;

          .goods-title {
            font-size: 26rpx;
            color: $text-color-primary;
            line-height: 1.4;
            margin-bottom: 15rpx;
            min-height: 72rpx;
          }

          .goods-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price-section {
              .current-price {
                font-size: 28rpx;
                color: $primary-color;
                font-weight: bold;
                margin-right: 8rpx;
              }

              .original-price {
                font-size: 22rpx;
                color: $text-color-light;
                text-decoration: line-through;
              }
            }

            .add-cart-btn {
              width: 50rpx;
              height: 50rpx;
              background: $primary-color;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              image {
                width: 24rpx;
                height: 24rpx;
              }
            }
          }
        }
      }
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;

    .loading-dots {
      display: flex;
      margin-bottom: 20rpx;

      .dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background: $primary-color;
        margin: 0 6rpx;
        animation: bounce 1.4s infinite ease-in-out both;

        &:nth-child(1) {
          animation-delay: -0.32s;
        }

        &:nth-child(2) {
          animation-delay: -0.16s;
        }
      }
    }

    text {
      font-size: 24rpx;
      color: $text-color-light;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>