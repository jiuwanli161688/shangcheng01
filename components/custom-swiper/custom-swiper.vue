<template>
  <view>
    <uni-swiper-dot
      class="uni-swiper-dot-box"
      field="content"
      :info="info"
      :current="current"
      :mode="mode"
      :dots-styles="dotsStyles"
      @clickItem="clickItem"
    >
      <swiper class="swiper-box" :current="swiperDotIndex" @change="change">
        <swiper-item v-for="(item, index) in info" :key="index" @click="bannerClick(item)">
          <!-- 展示中间部分 -->
          <!-- <image
            class="image"
            style="width: 100%; height: 100%"
            mode="aspectFill"
            :src="item.url"
          ></image> -->

          <!-- 最长边展示出来 -->
          <image
            class="image"
            style="width: 100%; height: 100%"
            mode="aspectFit"
            :src="item.url"
          ></image>

          <view :class="['swiper-item' + index, 'swiper-item']">
            <text style="font-size: 32px; color: #fff">{{ index + 1 }}</text>
          </view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>

    <!-- 使用 top: -99999rpx; 隐藏掉画布-->
    <canvas
      canvas-id="canvasId"
      id="canvasId"
      style="position: absolute; top: -99999rpx"
    ></canvas>
  </view>
</template>

<script>
export default {
  name: "CustomSwiper",
  props: {
    info: {
      type: Array,
      default: () => {
        return [];
      },
    },
    height: {
      type: String,
      default: "400rpx",
    },
    // mode: 模式
    // default 条状
    // round 椭圆
    // dot 圆点
    // nav 例子： 1/3 内容c
    // index 索引
    mode: {
      type: String,
      default: "dot",
    },
    // 指示点样式
    dotsStyles: {
      type: Object,
      default: () => {
        return {
          backgroundColor: "#DDDDDD",
          border: "0 #fff solid",
          color: "#fff",
          selectedBackgroundColor: "#F75AAC",
          selectedBorder: "0 #fff solid",
        };
      },
    },
  },
  data() {
    return {
      swiperDotIndex: 0,
      current: 0,
    };
  },
  methods: {
    bannerClick(item) {
      this.$emit('img-click', item);
    },
    change(e) {
      this.current = e.detail.current;
    },
    clickItem(e) {
      this.swiperDotIndex = e;
    },
  },
  onLoad() {
  },
};
</script>

<style lang="scss" scoped>
.swiper-item {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 280rpx;
  color: #fff;
}

@media screen and (min-width: 500px) {
  .uni-swiper-dot-box {
    width: 800rpx;
    /* #ifndef APP-NVUE */
    margin: 0 auto;
    /* #endif */
    margin-top: 16rpx;
  }
  .image {
    width: 100%;
  }
}
</style>
