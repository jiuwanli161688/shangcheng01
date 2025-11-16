<template>
  <view class="category-nav">
    <!-- 分类导航 -->
    <scroll-view class="nav-scroll" scroll-x :show-scrollbar="false">
      <view class="nav-content">
        <view 
          class="nav-item" 
          v-for="category in categoryList" 
          :key="category.id"
          @click="handleCategoryClick(category)"
        >
          <!-- 图标区域 -->
          <view class="item-icon">
            <image 
              class="icon-image" 
              :src="category.icon" 
              mode="aspectFit"
              :lazy-load="true"
            ></image>
            <!-- 角标 -->
            <view class="item-badge" v-if="category.badge">
              <text class="badge-text">{{ category.badge }}</text>
            </view>
          </view>
          
          <!-- 分类名称 -->
          <text class="item-name">{{ category.name }}</text>
        </view>
        
        <!-- 全部分类 -->
        <view class="nav-item all-category" @click="handleAllCategory">
          <view class="item-icon">
            <image class="icon-image" src="/static/icons/all-category.png" mode="aspectFit"></image>
          </view>
          <text class="item-name">全部分类</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'CategoryNav',

  props: {
    // 分类列表数据
    categoryList: {
      type: Array,
      default: () => []
    },
    // 每行显示的数量
    rowCount: {
      type: Number,
      default: 5
    }
  },

  emits: ['category-click', 'all-category-click'],

  computed: {
    // 计算每个分类项的宽度
    itemWidth() {
      return 100 / this.rowCount + '%'
    }
  },

  methods: {
    // 分类点击
    handleCategoryClick(category) {
      this.$emit('category-click', category)
    },

    // 全部分类点击
    handleAllCategory() {
      this.$emit('all-category-click')
    }
  }
}
</script>

<style lang="scss" scoped>
.category-nav {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .nav-scroll {
    white-space: nowrap;

    .nav-content {
      display: inline-flex;
      padding: 0 20rpx;

      .nav-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 140rpx;
        margin: 0 10rpx;
        position: relative;

        .item-icon {
          position: relative;
          width: 80rpx;
          height: 80rpx;
          margin-bottom: 15rpx;
          background: linear-gradient(135deg, #FF6A3C, #FF8E6B);
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          .icon-image {
            width: 40rpx;
            height: 40rpx;
          }

          .item-badge {
            position: absolute;
            top: -8rpx;
            right: -8rpx;
            background: $danger-color;
            border-radius: 20rpx;
            min-width: 32rpx;
            height: 32rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 8rpx;

            .badge-text {
              font-size: 20rpx;
              color: #fff;
              line-height: 1;
              font-weight: bold;
            }
          }
        }

        .item-name {
          font-size: 24rpx;
          color: $text-color-primary;
          text-align: center;
          line-height: 1.2;
        }

        // 不同的分类使用不同的渐变色
        &:nth-child(1) .item-icon {
          background: linear-gradient(135deg, #FF6A3C, #FF8E6B);
        }
        &:nth-child(2) .item-icon {
          background: linear-gradient(135deg, #4CD964, #6BE885);
        }
        &:nth-child(3) .item-icon {
          background: linear-gradient(135deg, #007AFF, #5AC8FA);
        }
        &:nth-child(4) .item-icon {
          background: linear-gradient(135deg, #5856D6, #7D7AFF);
        }
        &:nth-child(5) .item-icon {
          background: linear-gradient(135deg, #FF2D50, #FF5E7D);
        }
        &:nth-child(6) .item-icon {
          background: linear-gradient(135deg, #FF9500, #FFB143);
        }
        &:nth-child(7) .item-icon {
          background: linear-gradient(135deg, #8E8E93, #AEAEB2);
        }
        &:nth-child(8) .item-icon {
          background: linear-gradient(135deg, #34C759, #5CD685);
        }

        // 全部分类特殊样式
        &.all-category {
          .item-icon {
            background: linear-gradient(135deg, #8E8E93, #AEAEB2);
            
            .icon-image {
              width: 36rpx;
              height: 36rpx;
            }
          }
        }

        // 点击效果
        &:active {
          .item-icon {
            transform: scale(0.95);
          }
        }
      }
    }
  }

  // 网格布局版本（如果需要的话）
  &.grid-layout {
    .nav-scroll {
      white-space: normal;
      
      .nav-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 0;

        .nav-item {
          width: 20%; // 5个一行
          margin: 0;
          padding: 20rpx 0;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 375px) {
  .category-nav {
    .nav-scroll {
      .nav-content {
        .nav-item {
          width: 120rpx;
          
          .item-icon {
            width: 70rpx;
            height: 70rpx;
            
            .icon-image {
              width: 35rpx;
              height: 35rpx;
            }
          }
          
          .item-name {
            font-size: 22rpx;
          }
        }
      }
    }
  }
}
</style>