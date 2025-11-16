<template>
  <view class="page-address-list">
    <!-- 地址列表 -->
    <scroll-view class="address-scroll" scroll-y>
      <view class="address-list">
        <view 
          class="address-item"
          v-for="address in addressList"
          :key="address.id"
          @click="handleAddressSelect(address)"
        >
          <view class="address-content">
            <view class="address-header">
              <text class="name">{{ address.name }}</text>
              <text class="phone">{{ address.phone }}</text>
              <text class="default-tag" v-if="address.isDefault">默认</text>
            </view>
            <view class="address-detail">
              <text>{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
            </view>
          </view>
          <view class="address-actions">
            <view class="action-item" @click.stop="handleSetDefault(address)">
              <image 
                :src="address.isDefault ? '/static/icons/radio-active.png' : '/static/icons/radio.png'" 
                mode="aspectFit"
              ></image>
              <text>{{ address.isDefault ? '默认地址' : '设为默认' }}</text>
            </view>
            <view class="action-item" @click.stop="handleEditAddress(address)">
              <image src="/static/icons/edit.png" mode="aspectFit"></image>
              <text>编辑</text>
            </view>
            <view class="action-item" @click.stop="handleDeleteAddress(address)">
              <image src="/static/icons/delete.png" mode="aspectFit"></image>
              <text>删除</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <empty-state 
        v-if="addressList.length === 0"
        title="暂无收货地址" 
        tip="添加收货地址方便购物"
        @action="handleAddAddress"
      />
    </scroll-view>

    <!-- 添加地址按钮 -->
    <view class="add-btn-container">
      <view class="add-btn" @click="handleAddAddress">
        <text>添加新地址</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EmptyState from '@/components/empty-state/empty-state'

export default {
  components: {
    EmptyState
  },

  data() {
    return {
      isSelectMode: false
    }
  },

  computed: {
    ...mapState('address', ['addressList'])
  },

  onLoad(options) {
    this.isSelectMode = options.select === 'true'
    this.loadAddressList()
  },

  onShow() {
    this.loadAddressList()
  },

  onPullDownRefresh() {
    this.loadAddressList().finally(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    ...mapActions('address', ['getAddressList', 'setDefaultAddress', 'deleteAddress']),

    // 加载地址列表
    async loadAddressList() {
      try {
        await this.getAddressList()
      } catch (error) {
        console.error('地址列表加载失败:', error)
      }
    },

    // 地址选择
    handleAddressSelect(address) {
      if (this.isSelectMode) {
        // 选择地址模式，返回上一页
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.$vm.setSelectedAddress) {
          prevPage.$vm.setSelectedAddress(address)
        }
        uni.navigateBack()
      }
    },

    // 设置默认地址
    async handleSetDefault(address) {
      if (address.isDefault) return

      try {
        await this.setDefaultAddress(address.id)
        uni.showToast({
          title: '设置成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('设置默认地址失败:', error)
      }
    },

    // 编辑地址
    handleEditAddress(address) {
      uni.navigateTo({
        url: `/subpackages/address/pages/edit?id=${address.id}`
      })
    },

    // 删除地址
    handleDeleteAddress(address) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这个地址吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.deleteAddress(address.id)
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
            } catch (error) {
              console.error('删除地址失败:', error)
            }
          }
        }
      })
    },

    // 添加地址
    handleAddAddress() {
      uni.navigateTo({
        url: '/subpackages/address/pages/edit'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-address-list {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .address-scroll {
    flex: 1;
    padding: 20rpx;
  }

  .address-list {
    .address-item {
      background: #fff;
      padding: 30rpx;
      margin-bottom: 20rpx;
      
      .address-content {
        margin-bottom: 20rpx;
        
        .address-header {
          display: flex;
          align-items: center;
          margin-bottom: 15rpx;
          
          .name {
            font-size: 32rpx;
            font-weight: bold;
            color: $text-color-primary;
            margin-right: 20rpx;
          }
          
          .phone {
            font-size: 28rpx;
            color: $text-color-regular;
            margin-right: 20rpx;
          }
          
          .default-tag {
            background: $primary-color;
            color: #fff;
            font-size: 20rpx;
            padding: 4rpx 8rpx;
            border-radius: 4rpx;
          }
        }
        
        .address-detail {
          text {
            font-size: 26rpx;
            color: $text-color-regular;
            line-height: 1.5;
          }
        }
      }
      
      .address-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20rpx;
        border-top: 1rpx solid $border-color-light;
        
        .action-item {
          display: flex;
          align-items: center;
          
          image {
            width: 24rpx;
            height: 24rpx;
            margin-right: 8rpx;
          }
          
          text {
            font-size: 24rpx;
            color: $text-color-regular;
          }
        }
      }
    }
  }

  .add-btn-container {
    padding: 20rpx 30rpx;
    background: #fff;
    border-top: 1rpx solid $border-color-light;
    
    .add-btn {
      background: $primary-color;
      padding: 25rpx 0;
      text-align: center;
      
      text {
        font-size: 32rpx;
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>