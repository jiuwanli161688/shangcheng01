<template>
  <view class="page-cart">
    <!-- 购物车列表 -->
    <view class="cart-list" v-if="cartList.length > 0">
      <view
        class="cart-item"
        v-for="item in cartList"
        :key="`${item.id}-${item.specId}`"
      >
        <view class="item-select" @click="toggleSelect(item)">
          <image
            :src="
              item.selected
                ? '/static/icons/selected.png'
                : '/static/icons/unselected.png'
            "
            mode="aspectFit"
          ></image>
        </view>

        <image
          class="item-image"
          :src="item.image"
          mode="aspectFill"
          @click="handleGoodsClick(item)"
        ></image>

        <view class="item-info">
          <text class="item-title" @click="handleGoodsClick(item)">{{
            item.title
          }}</text>
          <text class="item-spec" v-if="item.spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ formatPrice(item.price) }}</text>
            <view class="quantity-control">
              <text
                class="btn minus"
                :class="{ disabled: item.quantity <= 1 }"
                @click="decreaseQuantity(item)"
                >-</text
              >
              <text class="quantity">{{ item.quantity }}</text>
              <text class="btn plus" @click="increaseQuantity(item)">+</text>
            </view>
          </view>
        </view>

        <view class="item-delete" @click="deleteItem(item)">
          <text>删除</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <empty-state
      v-else
      title="购物车空空如也"
      tip="去逛逛吧"
      @action="goShopping"
    />

    <!-- 底部结算栏 -->
    <view class="cart-footer" v-if="cartList.length > 0">
      <view class="footer-left">
        <view class="select-all" @click="toggleSelectAll">
          <image
            :src="
              isAllSelected
                ? '/static/icons/selected.png'
                : '/static/icons/unselected.png'
            "
            mode="aspectFit"
          ></image>
          <text>全选</text>
        </view>
        <view class="total-info">
          <text>合计: </text>
          <text class="price">¥{{ formatPrice(selectedTotalPrice) }}</text>
        </view>
      </view>

      <view class="footer-right">
        <view
          class="settle-btn"
          :class="{ disabled: selectedCount === 0 }"
          @click="handleSettle"
        >
          <text>结算({{ selectedCount }})</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import EmptyState from "@/components/empty-state/empty-state";

export default {
  components: {
    EmptyState,
  },

  computed: {
    ...mapState("cart", ["cartList"]),
    ...mapGetters("cart", [
      "selectedCartItems",
      "selectedTotalPrice",
      "isAllSelected",
    ]),

    // 选中的商品数量
    selectedCount() {
      return this.selectedCartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
  },

  onLoad() {
    this.loadCartList();
  },

  onShow() {
    this.loadCartList();
  },

  onPullDownRefresh() {
    this.loadCartList().finally(() => {
      uni.stopPullDownRefresh();
    });
  },

  methods: {
    ...mapActions("cart", ["getCartList", "updateCartItem", "removeCartItem"]),

    async loadCartList() {
      try {
        await this.getCartList();
      } catch (error) {
        console.error("购物车数据加载失败:", error);
        uni.showToast({
          title: "加载失败，请重试",
          icon: "none",
        });
      }
    },

    // 切换商品选中状态
    async toggleSelect(item) {
      try {
        await this.updateCartItem({
          id: item.id,
          specId: item.specId,
          selected: !item.selected,
        });
      } catch (error) {
        console.error("更新选中状态失败:", error);
        uni.showToast({
          title: "操作失败，请重试",
          icon: "none",
        });
      }
    },

    // 切换全选
    async toggleSelectAll() {
      const newSelectedState = !this.isAllSelected;
      try {
        // 批量更新所有商品选中状态
        const updatePromises = this.cartList.map((item) =>
          this.updateCartItem({
            id: item.id,
            specId: item.specId,
            selected: newSelectedState,
          })
        );
        await Promise.all(updatePromises);
      } catch (error) {
        console.error("全选操作失败:", error);
        uni.showToast({
          title: "操作失败，请重试",
          icon: "none",
        });
      }
    },

    // 减少数量
    async decreaseQuantity(item) {
      if (item.quantity <= 1) return;
      try {
        await this.updateCartItem({
          id: item.id,
          specId: item.specId,
          quantity: item.quantity - 1,
        });
      } catch (error) {
        console.error("减少数量失败:", error);
        uni.showToast({
          title: "操作失败，请重试",
          icon: "none",
        });
      }
    },

    // 增加数量
    async increaseQuantity(item) {
      try {
        await this.updateCartItem({
          id: item.id,
          specId: item.specId,
          quantity: item.quantity + 1,
        });
      } catch (error) {
        console.error("增加数量失败:", error);
        uni.showToast({
          title: "操作失败，请重试",
          icon: "none",
        });
      }
    },

    // 删除商品
    deleteItem(item) {
      uni.showModal({
        title: "提示",
        content: "确定要删除这个商品吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.removeCartItem({
                id: item.id,
                specId: item.specId,
              });
              uni.showToast({
                title: "删除成功",
                icon: "success",
              });
            } catch (error) {
              console.error("删除商品失败:", error);
              uni.showToast({
                title: "删除失败，请重试",
                icon: "none",
              });
            }
          }
        },
      });
    },

    // 结算
    handleSettle() {
      if (this.selectedCount === 0) {
        uni.showToast({
          title: "请选择要结算的商品",
          icon: "none",
        });
        return;
      }

      // 检查登录状态
      if (!this.$checkLogin()) return;

      // 跳转到订单确认页面
      const selectedItems = this.selectedCartItems;
      uni.navigateTo({
        url: `/subpackages/order/pages/confirm?items=${encodeURIComponent(
          JSON.stringify(selectedItems)
        )}`,
      });
    },

    // 商品点击
    handleGoodsClick(item) {
      uni.navigateTo({
        url: `/subpackages/goods/pages/detail?id=${item.id}`,
      });
    },

    // 去购物
    goShopping() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },

    // 格式化价格
    formatPrice(price) {
      if (typeof price !== "number") {
        price = parseFloat(price) || 0;
      }
      return price.toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-cart {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;

  .cart-list {
    .cart-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      margin-bottom: 20rpx;
      background: #fff;

      .item-select {
        width: 60rpx;
        display: flex;
        justify-content: center;

        image {
          width: 36rpx;
          height: 36rpx;
        }
      }

      .item-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin: 0 20rpx;
      }

      .item-info {
        flex: 1;

        .item-title {
          font-size: 28rpx;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          margin-bottom: 10rpx;
        }

        .item-spec {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 20rpx;
        }

        .item-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .item-price {
            font-size: 32rpx;
            color: #ff6a3c;
            font-weight: bold;
          }

          .quantity-control {
            display: flex;
            align-items: center;
            border: 1rpx solid #eee;
            border-radius: 8rpx;

            .btn {
              width: 60rpx;
              height: 50rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 28rpx;

              &.disabled {
                color: #ccc;
              }
            }

            .quantity {
              width: 80rpx;
              height: 50rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 28rpx;
              border-left: 1rpx solid #eee;
              border-right: 1rpx solid #eee;
            }
          }
        }
      }

      .item-delete {
        width: 80rpx;
        display: flex;
        justify-content: center;

        text {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .cart-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    border-top: 1rpx solid #eee;

    .footer-left {
      display: flex;
      align-items: center;
      flex: 1;

      .select-all {
        display: flex;
        align-items: center;
        margin-right: 30rpx;

        image {
          width: 36rpx;
          height: 36rpx;
          margin-right: 10rpx;
        }

        text {
          font-size: 28rpx;
          color: #333;
        }
      }

      .total-info {
        text {
          font-size: 28rpx;
          color: #333;

          &.price {
            color: #ff6a3c;
            font-weight: bold;
          }
        }
      }
    }

    .footer-right {
      .settle-btn {
        width: 200rpx;
        height: 70rpx;
        background: #ff6a3c;
        border-radius: 35rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        text {
          font-size: 28rpx;
          color: #fff;
        }

        &.disabled {
          background: #ccc;
        }
      }
    }
  }
}
</style>
