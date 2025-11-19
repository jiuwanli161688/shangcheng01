<template>
  <view class="member-page">
    <!-- 顶部状态栏 -->
    <custom-navbar title="会员中心" />
    <!-- 列表 -->
    <view class="menu-list" :style="{ marginTop: getTopHeight() - 5 + 'px' }">
      <view class="menu-item menu-item-avatar">
        <view class="menu-left">
          <text class="menu-text">头像</text>
        </view>
        <image
          class="avatar"
          src="@/static/images/user/user.png"
          mode="aspectFill"
          @click="goToPage(item.path)"
        ></image>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-text">昵称</text>
        </view>
        <view class="menu-text flex-1 menu-label" @click="showModalName=true">小明明</view>
        <image
          class="arrow"
          src="/static/images/user/right.png"
          mode="aspectFill"
				 @click="showModalName=true"
        ></image>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-text">手机号码</text>
        </view>
        <view class="flex-cc" @click="showModal=true">
          <view class="menu-text flex-1 menu-label">166666666</view>
          <image
            class="arrow"
            src="/static/images/user/right.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-text">会员ID</text>
        </view>
        <view class="menu-text flex-1 menu-label">111111</view>
        <image
          class="arrow"
          src="/static/images/user/right.png"
          mode="aspectFill"
          style="opacity: 0"
        ></image>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-text">性别</text>
        </view>
				<picker class="flex-1" @change="bindPickerChange" :value="sexIndex" :range="sexRange">
					 <!-- <view class="uni-input"></view> -->
					<view class="menu-text flex-1 menu-label" style="text-align: right;">
						<text>{{sexRange[sexIndex]}}</text>
						<!-- <image
							class="arrow"
							src="/static/images/user/right.png"
							mode="aspectFill"
						></image> -->
					</view>
					<image
						class="arrow"
						src="/static/images/user/right.png"
						mode="aspectFill"
					></image>
			 </picker>
      </view>
    </view>
    <view class="logout" @click="logout">退出登录</view>
    <!-- 修改手机 -->
    <modal-phone
      :visible="showModal"
      :phone="info.userPhone"
      @close="showModal = false"
      @save="handleSave"
    />
		<!-- 修改名称 -->
		<modal-name
			:visible="showModalName"
			:name="info.userName"
			@close="showModalName = false"
			@save="handleSave"
		/>
		<!--  -->
	<!-- 	<picker @change="bindPickerChange" :value="sexIndex" :range="sexRange">
		   <view class="uni-input">{{sexRange[sexIndex].label}}</view>
		 </picker> -->
  </view>
</template>

<script>
import CustomNavbar from "@/components/custom-navbar/custom-navbar";
import { getNavBarHeight } from "@/utils/utils";
import ModalPhone from "./components/modal-phone.vue";
import ModalName from "./components/modal-name.vue";

export default {
  components: {
    CustomNavbar,
    ModalPhone,
		ModalName,
  },
  data() {
    return {
      sexIndex: 0,
      sexRange: ['未知', '男', '女' ],
      statusBarHeight: 0,
			showModalName: false,
      showModal: false,
      info: {
        userPhone: "18812345678",
      },
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  methods: {
    getTopHeight: getNavBarHeight,
		bindPickerChange(e) {
		  this.sexIndex = e.detail.value
		},
    handleSave(record) {
      console.log(" 保存信息", record);
    },
  },
};
</script>

<style scoped>
.member-page {
  height: 100vh;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.status-bar {
  background: linear-gradient(135deg, #f60808 0%, #f60808 100%);
}

/* 红色头部区域 */
.header-section {
  background: linear-gradient(135deg, #f60808 0%, #f60808 100%);
  padding: 36rpx 32rpx 64rpx;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.header-actions {
  display: flex;
  gap: 24rpx;
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}
/* 菜单列表 */
.menu-list {
  background: #ffffff;
  margin-top: 12rpx;
  padding: 0 32rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.menu-item.menu-item-avatar {
  height: 160rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.menu-label {
  text-align: right;
  margin-right: 10rpx;
  color: #888;
}

.menu-icon {
  font-size: 40rpx;
  width: 40rpx;
  height: 40rpx;
}

.menu-text {
  height: 120rpx;
  line-height: 120rpx;
  font-size: 30rpx;
}

.bottom-placeholder {
  height: 40rpx;
}

.arrow {
  width: 28rpx;
  height: 28rpx;
}

.logout {
  position: fixed;
  bottom: 20rpx;
  left: 25rpx;
  width: calc(100% - 50rpx);
  height: 100rpx;
  margin: 0 auto;
  line-height: 100rpx;
  border-radius: 50rpx;
  background-color: rgba(255, 255, 255, 1);
  color: rgba(246, 8, 8, 1);
  font-size: 32rpx;
  text-align: center;
  border: 1px solid rgba(246, 8, 8, 1);
  box-sizing: border-box;
}
.flex-cc {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
