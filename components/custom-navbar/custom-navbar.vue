<template>
  <view class="custom-navbar-diy">
    <view class="nav-content" :style="{ height: '60px' }">
      <!-- 左侧区块：可插槽也可显示返回 -->
      <view v-if="showBack" class="nav-left">
        <slot name="left">
          <view class="back-btn" :class="{ opcity: !showBack }" @click="handleBack">
            <text class="back-text" v-if="showBackText">
              <slot name="back-text">返回</slot>
            </text>
            <uni-icons v-else type="left" size="20" color="#fff"></uni-icons>
          </view>
        </slot>
      </view>
      <view v-else-if="textAlign !== 'left'" class="nav-left-def"></view>
      <!-- 标题区块，可插槽覆盖 -->
      <view class="nav-title">
        <slot name="title">
          <text class="title-text" :style="{ color: titleColor, textAlign: textAlign }">{{
            title
          }}</text>
        </slot>
      </view>
      <!-- 右侧内容插槽 -->
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "CustomNavbar",
  props: {
    title: { type: String, default: "" },
    showBack: { type: Boolean, default: false },
    showBackText: { type: Boolean, default: false },
    backgroundColor: { type: String, default: "#F60808" },
    titleColor: { type: String, default: "#ffffff" },
    textAlign: { type: String, default: "center" },
    statusBarHeight: { type: Number, default: 0 }, // 可直接外部传入，内部自动获取
    navBarHeight: { type: Number, default: null }, // 允许直接传入高度
    indexPage: { type: String, default: "/pages/index/index" }, // 首页路径可配置
  },
  data() {
    return {
      innerStatusBarHeight: 0,
      innerNavBarHeight: 44,
      safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
      statusBarHeightNew: 0,
    };
  },
  computed: {
    navbarStyle() {
      return { background: 'blue', paddingTop: 20 + 'px' };
    },
    navContentStyle() {
      return {
        height: (this.statusBarHeightNew + this.computedNavBarHeight) + 'px',
      };
    },
    computedStatusBarHeight() {
      return this.statusBarHeight || this.innerStatusBarHeight;
    },
    computedNavBarHeight() {
      return this.navBarHeight || this.innerNavBarHeight;
    },
  },
  mounted() {
    const systemInfo = uni.getSystemInfoSync()
    console.log('systemInfo', systemInfo)
    this.statusBarHeightNew = systemInfo.top || 20
    // 若外部未传入，则自动获取
    if (!this.statusBarHeight || !this.navBarHeight) {
      this.getSystemInfo();
    }
  },
  methods: {
    getSystemInfo() {
      // 推荐异步，提升页面性能
      uni.getSystemInfo({
        success: (sys) => {
          this.innerStatusBarHeight = sys.statusBarHeight || 20;
          this.safeAreaInsets = sys.safeAreaInsets || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          };
          if (uni.getMenuButtonBoundingClientRect) {
            try {
              const mb = uni.getMenuButtonBoundingClientRect();
              if (mb && mb.top) {
                this.innerNavBarHeight =
                  (mb.top - this.innerStatusBarHeight) * 2 + mb.height;
              }
            } catch (e) {
              // 不做日志，仅降级默认值
              this.innerNavBarHeight = sys.platform === "android" ? 48 : 44;
            }
          } else {
            this.innerNavBarHeight = sys.platform === "android" ? 48 : 44;
          }
        },
      });
    },
    handleBack() {
      if (!this.showBack) return;
      // 可发送 back 事件
      this.$emit("back");
      uni.navigateBack({
        fail: () => {
          uni.reLaunch({ url: this.indexPage });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/common.scss";
.opcity {
  opacity: 0;
}
.custom-navbar-diy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9900; 
  background: $bg-color-red;
  transition: background-color 0.3s;
}

.status-bar {
  width: 100%;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 30rpx 0;
  position: relative;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.nav-left {
  display: flex;
  align-items: center;
  min-width: 120rpx;
  height: 100%;
}
.nav-left-def {
  min-width: 120rpx;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -16rpx;
  border-radius: 12rpx;
  transition: all 0.2s;
  position: relative;
  // 直接用:active实现按压态
  &:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.96);
  }
}
.back-icon {
  font-size: 48rpx;
  font-weight: 300;
  color: $text-color-primary;
  margin-right: 4rpx;
  transition: color 0.2s;
}

.back-text {
  font-size: 32rpx;
  color: $text-color-regular;
  transition: color 0.2s;
}

.nav-title {
  flex: 1;
  text-align: center;
  // padding: 0 20rpx;
  overflow: hidden;
}
.title-text {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-color-primary;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}
.nav-right {
  min-width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}
</style>
