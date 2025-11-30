<template>
  <view class="member-page">
    <!-- 顶部状态栏 -->
    <custom-navbar title="会员中心" textAlign="left" />
    <!-- 红色头部区域 -->
    <view
      class="header-section"
      :style="{ marginTop: getTopHeight() - 5 + 'px' }"
    >
      <!-- 用户信息 -->
      <view class="user-info">
        <image
          class="avatar"
          :src="userInfo.data.avatar || '/static/images/user/head.png'"
          mode="aspectFill"
          @click="getLogin"
        ></image>

        <view class="user-details">
          <template v-if="isLogin">
            <view class="name-row">
              <text class="username">{{ userInfo.data.yhnc }}</text>
              <view class="vip-badge">
                <image
                  class="vip-icon"
                  src="/static/images/user/huangguan.png"
                  mode="aspectFill"
                ></image>
                <text class="vip-text">洋墨柜</text>
              </view>
            </view>
            <text class="user-id">用户ID：{{ userInfo.data.userId }}</text>
          </template>
          <template v-else>
            <div class="login-btn" @click="getLogin">登录/注册</div>
          </template>
        </view>

        <view v-if="isLogin" class="user-actions">
          <view class="action-icon">
            <image
              src="/static/images/user/xiaoxi.png"
              mode="aspectFill"
            ></image>
          </view>
          <view class="action-icon" @click="goPage('setting')">
            <image
              src="/static/images/user/shezhi.png"
              mode="aspectFill"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="order-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <view class="more-btn" @click="goPage('order')">
          <text class="more-text">更多</text>
          <image
            class="arrow"
            src="/static/images/user/right.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view class="order-tabs">
        <view
          class="order-tab"
          v-for="(item, index) in orderTabs"
          :key="index"
          @click="goPage('order', `?type=${item.type}`)"
        >
          <view class="tab-icon-wrap">
            <image class="tab-icon" :src="item.icon"></image>
            <view v-if="isLogin && item.badge" class="badge">{{ item.badge }}</view>
          </view>
          <text class="tab-label">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 我的钱包 -->
    <view class="wallet-section">
      <view class="section-header">
        <text class="section-title">我的钱包</text>
        <view class="manage-btn" @click="goPage('shop')">
          <image
            class="manage-icon"
            src="/static/images/user/dianpu.png"
            mode="aspectFill"
          ></image>
          <text class="manage-text">管理店铺</text>
          <image
            class="arrow"
            src="/static/images/user/right.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view class="wallet-items">
        <view class="wallet-item">
          <text class="wallet-amount">{{ wallet.zhye }}</text>
          <text class="wallet-label">余额(元)</text>
        </view>
        <view class="wallet-item">
          <text class="wallet-amount">{{ wallet.hongbaoNum }}</text>
          <text class="wallet-label">可用红包(个)</text>
        </view>
        <view class="wallet-item">
          <text class="wallet-amount">{{ wallet.kaquanNum }}</text>
          <text class="wallet-label">可用卡券(张)</text>
        </view>
      </view>
    </view>

    <!-- 商家入驻横幅-暂时没有-注释 -->
    <view v-if="false" class="banner-section" @click="goToMerchantRegister">
      <custom-swiper
        :info="swiperInfo"
        @img-click="bannerClick"
      ></custom-swiper>
    </view>
    <!-- 菜单列表 -->
    <view class="menu-list">
      <view
        class="menu-item"
        v-for="(item, index) in menuList"
        :key="index"
        @click="goToPage(item.path)"
      >
        <view class="menu-left">
          <image class="menu-icon" :src="item.icon"></image>
          <text class="menu-text">{{ item.label }}</text>
        </view>
        <image
          class="arrow"
          src="/static/images/user/right.png"
          mode="aspectFill"
        ></image>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-placeholder"></view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import CustomNavbar from "@/components/custom-navbar/custom-navbar";
import CustomSwiper from "@/components/custom-swiper/custom-swiper";
import { getNavBarHeight } from "@/utils/utils";
import dfk from "@/static/images/user/dfk.png";
import dfh from "@/static/images/user/dfh.png";
import dsh from "@/static/images/user/dsh.png";
import ywc from "@/static/images/user/ywc.png";
import { orderCount } from "@/api/modules/order";
import { getWalltApi } from "@/api/modules/user";

export default {
  components: {
    CustomNavbar,
  },
  data() {
    return {
      statusBarHeight: 0,
      orderTabs: [
        { icon: dfk, label: "待付款", type: "unpaid", badge: 0 },
        { icon: dfh, label: "待发货", type: "unshipped", badge: 0 },
        { icon: dsh, label: "待收货", type: "shipped", badge: 0 },
        { icon: ywc, label: "已完成", type: "completed", badge: 0 },
      ],
      menuList: [
        {
          icon: "/static/images/user/shdz.png",
          label: "收货地址",
          path: "/pages/address/address",
          color: "#F60808",
        },
        {
          icon: "/static/images/user/spsc.png",
          label: "商品收藏",
          path: "/pages/favorites/favorites",
          color: "#4A90E2",
        },
        {
          icon: "/static/images/user/zfmm.png",
          label: "支付密码",
          path: "/pages/password/password",
          color: "#F60808",
        },
        {
          icon: "/static/images/user/bzzx.png",
          label: "帮助中心",
          path: "/pages/help/help",
          color: "#4A90E2",
        },
      ],
      swiperInfo: [
        {
          colorClass: "uni-bg-red",
          url: "https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg",
          content: "内容 A",
        },
        {
          colorClass: "uni-bg-green",
          url: "https://wxls-cms.oss-cn-hangzhou.aliyuncs.com/online/2024-04-18/218da022-f4bf-456a-99af-5cb8e157f7b8.jpg",
          content: "内容 B",
        },
        {
          colorClass: "uni-bg-blue",
          url: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/094a9dc0-50c0-11eb-b680-7980c8a877b8.jpg",
          content: "内容 C",
        },
      ],
      wallet: {
        hongbaoNum: '-',
        kaquanNum: '-',
        ljtx: '-',
        remark: "-",
        userId: '-',
        zhye: '-',
        zsye: '-',
      },
      isLogin: false,
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;

    // 加载用户数据
    this.loadUserData();
    // this.getLogin();
  },
  onShow() {
    const token = uni.getStorageSync("token");
    this.isLogin = token ? true : false;
    // 获取用户信息
    if (token) {
      this.getUserInfo();
    }
  },
  watch: {
    userInfo(newVal) {
      console.log('用户', newVal)
      if (newVal) {
        this.getOrderCount();
        this.getWallt();
      }
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    ...mapActions("user", ["login", "getUserInfo"]),
    getTopHeight: getNavBarHeight,
    getLogin() {
      const that = this;
      if (this.userInfo && this.userInfo.userId) return;
      
      uni.redirectTo({ url: '/pages/user/login' });
      return
      
      uni.login({
        provider: "weixin", //使用微信登录
        success: async function (loginRes) {
          const res = await that.login({
            grant_type: "weChat",
            tenantId: "000000",
            code: loginRes.code,
            logonType: 1,
          });
          uni.hideLoading();
          that.isLogin = true

          that.getOrderCount();
          that.getWallt();
          console.log("令牌结果", res, that.userInfo.userId);
        },
        fail: (err) => {
          console.log("失败", err);
        },
      });
    },
    async getOrderCount() {
      const res = await orderCount({ sjid: this.userInfo.data.sjId });
      const { dfkCount, dfhCount, dshCount, ywcCount } = res.data;
      const count = [dfkCount, dfhCount, dshCount, ywcCount];
      console.log('getOrderCount用户信息', this.userInfo)

      this.orderTabs = this.orderTabs.map((item, inx) => {
        return {
          ...item,
          badge: count[inx],
        };
      });
    },
    async getWallt() {
      const res = await getWalltApi({ sjid: this.userInfo.data.sjId });
      this.wallet = res.data.data || {}
      console.log("钱包", this.wallet);

    },
    bannerClick(item) {
      console.log("广告点击", item);
    },
    loadUserData() {
    },
    goPage(name, params) {
      const path = {
        setting: "/pages/user/setting",
        order: "/pages/",
        shop: "/pages/",
      };
      uni.navigateTo({
        url: path[name] + (params || ""),
      });
    },
    // banner广告
    goToMerchantRegister() {
      uni.navigateTo({
        url: "/pages/merchant/register",
      });
    },
    goToPage(path) {
      // 检查登录状态
      const token = uni.getStorageSync("token");
      this.isLogin = token ? true : false;
      if (!token) {
        uni.showModal({
          title: "提示",
          content: "请先登录",
          showCancel: false,
          success: () => {},
        });
        return;
      }
      uni.navigateTo({
        url: path,
      });
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

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.avatar {
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  /* border: 4rpx solid #ffffff; */
}

.user-details {
  flex: 1;
  margin-left: 24rpx;
}

.name-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.username {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
  margin-right: 16rpx;
}

.vip-badge {
  background: #ffa500;
  padding: 0rpx 16rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.vip-icon {
  width: 32rpx;
  height: 32rpx;
  font-size: 24rpx;
}

.vip-text {
  font-size: 22rpx;
  color: #ffffff;
}

.user-id {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.user-actions {
  display: flex;
  gap: 20rpx;
  height: 96rpx;
  margin-top: 6rpx;
}

.action-icon {
  display: flex;
  justify-content: center;
}
.action-icon image {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
}

/* 我的订单 */
.order-section {
  background: #ffffff;
  margin-top: -20rpx;
  padding: 32rpx;
  z-index: 2;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #101010;
}

.more-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.more-text {
  font-size: 26rpx;
}

.arrow {
  width: 16rpx;
  height: 32rpx;
}

.order-tabs {
  display: flex;
  justify-content: space-around;
}

.order-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.tab-icon-wrap {
  position: relative;
  width: 80rpx;
  /* height: 80rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  font-size: 48rpx;
  width: 66rpx;
  height: 58rpx;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  min-width: 26rpx;
  min-height: 26rpx;
  border: 1px solid #f60808;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #f60808;
}

.tab-label {
  font-size: 26rpx;
}

/* 我的钱包 */
.wallet-section {
  background: #ffffff;
  margin-top: 12rpx;
  padding: 32rpx;
}

.manage-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.manage-icon {
  width: 32rpx;
  height: 32rpx;
}

.manage-text {
  font-size: 26rpx;
  color: #101010;
}

.wallet-items {
  display: flex;
  justify-content: space-around;
  margin-top: 32rpx;
}

.wallet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.wallet-amount {
  font-size: 44rpx;
  font-weight: bold;
  color: #f60808;
}

.wallet-label {
  font-size: 26rpx;
  color: #999999;
}

/* 商家入驻横幅 */
.banner-section {
  margin: 12rpx 0;
  box-sizing: border-box;
}

.banner-img {
  width: 100%;
  border-radius: 16rpx;
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
  padding: 32rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.menu-icon {
  font-size: 40rpx;
  width: 40rpx;
  height: 40rpx;
}

.menu-text {
  font-size: 30rpx;
}

.bottom-placeholder {
  height: 40rpx;
}
.login-btn {
  font-size: 36rpx;
  color: #fff;
}
</style>
