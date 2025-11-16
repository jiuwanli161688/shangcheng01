<template>
  <view class="poster-container">
    <button @click="generatePoster">生成海报</button>
    
    <!-- Canvas画布（隐藏） -->
    <canvas 
      canvas-id="posterCanvas" 
      :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}"
      class="poster-canvas"
    ></canvas>
    
    <!-- 预览生成的海报 -->
    <image v-if="posterImage" :src="posterImage" mode="widthFix" class="poster-preview"></image>
    
    <button v-if="posterImage" @click="savePoster">保存到相册</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      canvasWidth: 350,
      canvasHeight: 622,
      posterImage: '',
      qrcodeUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%B5%AE%E5%B1%82%401x-TovDnW52qudScb8RHLqyuLyg2EWLES.png' // 二维码图片
    }
  },
  
  methods: {
    // 生成海报
    async generatePoster() {
      uni.showLoading({ title: '生成中...' });
      
      const ctx = uni.createCanvasContext('posterCanvas', this);
      
      try {
        // 1. 绘制渐变背景
        await this.drawBackground(ctx);
        
        // 2. 绘制顶部文字
        this.drawTopText(ctx);
        
        // 3. 绘制标题
        this.drawTitle(ctx);
        
        // 4. 绘制副标题
        this.drawSubtitle(ctx);
        
        // 5. 绘制二维码（需要先下载图片）
        await this.drawQRCode(ctx);
        
        // 6. 绘制底部波浪分割线
        this.drawWave(ctx);
        
        // 7. 绘制底部信息
        this.drawBottomInfo(ctx);
        
        // 8. 绘制canvas
        ctx.draw(false, () => {
          setTimeout(() => {
            this.canvasToImage();
          }, 500);
        });
        
      } catch (error) {
        console.error('生成海报失败', error);
        uni.hideLoading();
        uni.showToast({ title: '生成失败', icon: 'none' });
      }
    },
    
    // 绘制渐变背景
    drawBackground(ctx) {
      return new Promise((resolve) => {
        // 上半部分橙红色
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 450);
        gradient1.addColorStop(0, '#FF5722');
        gradient1.addColorStop(1, '#FF6B3D');
        ctx.setFillStyle(gradient1);
        ctx.fillRect(0, 0, this.canvasWidth, 450);
        
        // 下半部分红色
        const gradient2 = ctx.createLinearGradient(0, 450, 0, this.canvasHeight);
        gradient2.addColorStop(0, '#E53935');
        gradient2.addColorStop(1, '#D32F2F');
        ctx.setFillStyle(gradient2);
        ctx.fillRect(0, 450, this.canvasWidth, this.canvasHeight - 450);
        
        resolve();
      });
    },
    
    // 绘制顶部文字
    drawTopText(ctx) {
      ctx.setFontSize(14);
      ctx.setFillStyle('#FFFFFF');
      ctx.fillText('🏠 创享家商城', 20, 30);
    },
    
    // 绘制标题
    drawTitle(ctx) {
      ctx.setFontSize(32);
      ctx.setFillStyle('#FFFFFF');
      ctx.setTextAlign('center');
      // ctx.setFontWeight('bold');
      ctx.fillText('创享家批发', this.canvasWidth / 2, 90);
    },
    
    // 绘制副标题
    drawSubtitle(ctx) {
      ctx.setFontSize(14);
      ctx.setFillStyle('#FFFFFF');
      ctx.setTextAlign('center');
      ctx.fillText('通过在线平台下单更加快捷方便', this.canvasWidth / 2, 120);
    },
    
    // 绘制二维码
    drawQRCode(ctx) {
      return new Promise((resolve, reject) => {
        // 下载网络图片到本地
        uni.downloadFile({
          url: this.qrcodeUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              const qrSize = 200;
              const qrX = (this.canvasWidth - qrSize) / 2;
              const qrY = 150;
              
              // 绘制白色背景圆
              ctx.setFillStyle('#FFFFFF');
              ctx.beginPath();
              ctx.arc(this.canvasWidth / 2, qrY + qrSize / 2, qrSize / 2 + 20, 0, 2 * Math.PI);
              ctx.fill();
              
              // 绘制二维码图片
              ctx.drawImage(res.tempFilePath, qrX, qrY, qrSize, qrSize);
              resolve();
            } else {
              reject(new Error('下载二维码失败'));
            }
          },
          fail: reject
        });
      });
    },
    
    // 绘制波浪线
    drawWave(ctx) {
      ctx.setStrokeStyle('#FFD700');
      ctx.setLineWidth(3);
      ctx.beginPath();
      ctx.moveTo(0, 455);
      
      // 绘制波浪曲线
      for (let i = 0; i < this.canvasWidth; i += 20) {
        ctx.quadraticCurveTo(i + 10, 450, i + 20, 455);
      }
      ctx.stroke();
    },
    
    // 绘制底部信息
    drawBottomInfo(ctx) {
      ctx.setTextAlign('center');
      
      // 客服电话
      ctx.setFontSize(14);
      ctx.setFillStyle('#FFFFFF');
      ctx.fillText('客服电话：19807717688', this.canvasWidth / 2, 500);
      
      // 营销文字
      ctx.setFontSize(16);
      ctx.setFillStyle('#FFEB3B');
      ctx.fillText('来洽谈享受更优最新折价格', this.canvasWidth / 2, 530);
      
      // 主营信息
      ctx.setFontSize(11);
      ctx.setFillStyle('#FFFFFF');
      ctx.fillText('主营：XXXXXXXXXXXXXXXXXXXXXXXXX', this.canvasWidth / 2, 560);
      ctx.fillText('XXXXXXXXXXXXXXXXXXXXXXXXX...', this.canvasWidth / 2, 580);
    },
    
    // Canvas转图片
    canvasToImage() {
      uni.canvasToTempFilePath({
        canvasId: 'posterCanvas',
        success: (res) => {
          this.posterImage = res.tempFilePath;
          uni.hideLoading();
          uni.showToast({ title: '生成成功', icon: 'success' });
        },
        fail: (err) => {
          console.error('转换图片失败', err);
          uni.hideLoading();
          uni.showToast({ title: '生成失败', icon: 'none' });
        }
      }, this);
    },
    
    // 保存到相册
    savePoster() {
      uni.saveImageToPhotosAlbum({
        filePath: this.posterImage,
        success: () => {
          uni.showToast({ title: '已保存到相册', icon: 'success' });
        },
        fail: (err) => {
          if (err.errMsg.includes('auth')) {
            uni.showModal({
              title: '提示',
              content: '需要授权保存相册',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting();
                }
              }
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.poster-container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-canvas {
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.poster-preview {
  width: 90%;
  margin: 20rpx 0;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.15);
}

button {
  width: 80%;
  margin: 10rpx 0;
}
</style>