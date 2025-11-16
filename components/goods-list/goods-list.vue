<template>
  <view class="goods-list-component">
    <!-- 列表布局 -->
    <view class="goods-list list-layout" :class="layout">
      <view 
        class="goods-item" 
        v-for="goods in goodsList" 
        :key="goods.id"
        @click="$emit('item-click', goods)"
      >
        <!-- 商品图片 -->
        <view class="goods-image-wrapper">
          <image 
            class="goods-image" 
            :src="goods.image" 
            mode="aspectFill"
            :lazy-load="true"
          ></image>
          
          <!-- 商品标签 -->
          <view class="goods-tags" v-if="goods.tags && goods.tags.length > 0">
            <text 
              class="goods-tag" 
              v-for="tag in goods.tags.slice(0, 2)" 
              :key="tag"
              :style="{ backgroundColor: tagColor }"
            >
              {{ tag }}
            </text>
          </view>
          
          <!-- 库存不足遮罩 -->
          <view class="sold-out-mask" v-if="goods.stock === 0">
            <text>已售罄</text>
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="goods-info">
          <!-- 商品标题 -->
          <text class="goods-title text-multi-ellipsis line-2">{{ goods.title }}</text>
          
          <!-- 商品描述 -->
          <text class="goods-desc text-multi-ellipsis line-1" v-if="goods.desc && showDesc">
            {{ goods.desc }}
          </text>

          <!-- 价格区域 -->
          <view class="goods-price-section">
            <view class="price-main">
              <text class="current-price">¥{{ goods.price }}</text>
              <text class="original-price" v-if="goods.originalPrice > goods.price">
                ¥{{ goods.originalPrice }}
              </text>
            </view>
            <text class="sales" v-if="showSales">已售{{ goods.sales }}{{ goods.sales >= 10000 ? '万+' : '' }}</text>
          </view>

          <!-- 促销信息 -->
          <view class="promotion-info" v-if="goods.promotion && showPromotion">
            <text class="promotion-tag" v-for="promo in goods.promotion.slice(0, 1)" :key="promo">
              {{ promo }}
            </text>
          </view>

          <!-- 操作按钮 -->
          <view class="goods-actions" v-if="showActions">
            <view class="add-cart-btn" @click.stop="handleAddCart(goods)">
              <image src="/static/icons/cart-small.png" mode="aspectFit"></image>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <view class="loading-spinner"></view>
      <text>加载中...</text>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading && goodsList.length === 0">
      <image class="empty-image" src="/static/images/empty-goods.png" mode="aspectFit"></image>
      <text class="empty-text">{{ emptyText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsList',

  props: {
    // 商品列表数据
    goodsList: {
      type: Array,
      default: () => []
    },
    // 列表布局：grid-网格布局，list-列表布局
    layout: {
      type: String,
      default: 'grid' // grid | list
    },
    // 是否显示商品描述
    showDesc: {
      type: Boolean,
      default: false
    },
    // 是否显示销量
    showSales: {
      type: Boolean,
      default: true
    },
    // 是否显示促销信息
    showPromotion: {
      type: Boolean,
      default: true
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      default: true
    },
    // 标签颜色
    tagColor: {
      type: String,
      default: '#FF6A3C'
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 空状态文本
    emptyText: {
      type: String,
      default: '暂无商品'
    }
  },

  emits: ['item-click', 'add-cart'],

  methods: {
    // 添加到购物车
    handleAddCart(goods) {
      this.$emit('add-cart', goods)
      
      // 显示添加成功反馈
      uni.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list-component {
  .goods-list {
    &.grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 20rpx;

      .goods-item {
        width: 345rpx;
        margin-bottom: 30rpx;
        background: #fff;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

        .goods-image-wrapper {
          position: relative;
          width: 100%;
          height: 345rpx;

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

            .goods-tag {
              font-size: 20rpx;
              color: #fff;
              padding: 4rpx 8rpx;
              border-radius: 4rpx;
              margin-bottom: 8rpx;
              line-height: 1;
            }
          }

          .sold-out-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;

            text {
              color: #fff;
              font-size: 28rpx;
              font-weight: bold;
            }
          }
        }

        .goods-info {
          padding: 20rpx;

          .goods-title {
            font-size: 28rpx;
            color: $text-color-primary;
            line-height: 1.4;
            margin-bottom: 12rpx;
            min-height: 78rpx;
          }

          .goods-desc {
            font-size: 24rpx;
            color: $text-color-light;
            margin-bottom: 15rpx;
          }

          .goods-price-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 15rpx;

            .price-main {
              display: flex;
              align-items: baseline;

              .current-price {
                font-size: 32rpx;
                color: $primary-color;
                font-weight: bold;
                margin-right: 10rpx;
              }

              .original-price {
                font-size: 24rpx;
                color: $text-color-light;
                text-decoration: line-through;
              }
            }

            .sales {
              font-size: 22rpx;
              color: $text-color-light;
            }
          }

          .promotion-info {
            .promotion-tag {
              display: inline-block;
              font-size: 20rpx;
              color: $primary-color;
              background: lighten($primary-color, 45%);
              padding: 4rpx 8rpx;
              border-radius: 4rpx;
              margin-right: 8rpx;
            }
          }

          .goods-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 15rpx;

            .add-cart-btn {
              width: 60rpx;
              height: 60rpx;
              background: $primary-color;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              image {
                width: 30rpx;
                height: 30rpx;
              }
            }
          }
        }
      }
    }

    &.list {
      .goods-item {
        display: flex;
        background: #fff;
        padding: 30rpx;
        margin-bottom: 20rpx;
        border-radius: 16rpx;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

        .goods-image-wrapper {
          position: relative;
          width: 200rpx;
          height: 200rpx;
          margin-right: 20rpx;
          flex-shrink: 0;

          .goods-image {
            width: 100%;
            height: 100%;
            border-radius: 8rpx;
          }

          .goods-tags {
            position: absolute;
            top: 8rpx;
            left: 8rpx;

            .goods-tag {
              font-size: 18rpx;
              color: #fff;
              padding: 3rpx 6rpx;
              border-radius: 3rpx;
              margin-bottom: 5rpx;
              line-height: 1;
              display: block;
            }
          }
        }

        .goods-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;

          .goods-title {
            font-size: 30rpx;
            color: $text-color-primary;
            line-height: 1.4;
            margin-bottom: 15rpx;
          }

          .goods-desc {
            font-size: 24rpx;
            color: $text-color-light;
            margin-bottom: 20rpx;
          }

          .goods-price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15rpx;

            .price-main {
              display: flex;
              align-items: baseline;

              .current-price {
                font-size: 36rpx;
                color: $primary-color;
                font-weight: bold;
                margin-right: 10rpx;
              }

              .original-price {
                font-size: 26rpx;
                color: $text-color-light;
                text-decoration: line-through;
              }
            }

            .sales {
              font-size: 24rpx;
              color: $text-color-light;
            }
          }

          .promotion-info {
            margin-bottom: 15rpx;

            .promotion-tag {
              display: inline-block;
              font-size: 22rpx;
              color: $primary-color;
              background: lighten($primary-color, 45%);
              padding: 6rpx 12rpx;
              border-radius: 6rpx;
              margin-right: 10rpx;
            }
          }

          .goods-actions {
            display: flex;
            justify-content: flex-end;

            .add-cart-btn {
              width: 60rpx;
              height: 60rpx;
              background: $primary-color;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              image {
                width: 30rpx;
                height: 30rpx;
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
    padding: 60rpx 0;

    .loading-spinner {
      width: 40rpx;
      height: 40rpx;
      border: 4rpx solid $border-color-light;
      border-top: 4rpx solid $primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20rpx;
    }

    text {
      font-size: 26rpx;
      color: $text-color-light;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;

    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
      opacity: 0.6;
    }

    .empty-text {
      font-size: 28rpx;
      color: $text-color-light;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>